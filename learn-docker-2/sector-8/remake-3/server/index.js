const keys = require('./keys')

const express = require('express')
const cors = require('cors')


const app = express()
app.use(cors())
app.use(express.json())

// Postgres setup
const {Pool}=require('pg')

const pool=new Pool({
    host:keys.pgHost,
    user:keys.pgUser,
    port:keys.pgPort,
    database:keys.pgDatabase,
    password:keys.pgPassword
})


pool.connect()
pool.on('error',(e)=>console.log(e))
pool.on('connect',(c)=>{
    console.log('Postgres connected')
    c.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    
})

// Redis setup
const redis = require('redis')
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: (e) => {
        console.log(e)
        return 1000
    }
})

redisClient.on('error', (e) => console.log(e))
const dup = redisClient.duplicate()


app.get('/', (req, res) => {
    res.send('Hello world')
})

app.get('/savevalues',async (req, res) => {
    try{
        const {rows}=await pool.query('select * from values')
        res.send(rows)
    }catch(e){
        res.status(400).send({error:e.message})
    }
})

app.get('/tempvalues', (req, res) => {
  

    redisClient.hgetall('values', (error, values) => {
        if (error) {
            return res.status(422).send({ error: error.message })
        }
        res.send(values)
    })
})

app.post('/value', async (req, res) => {
    const { number } = req.body
    if (!number || number > 40) {
        return res.status(422).send('Number need to be less then 40!')
    }
    const {rows}=await pool.query('select * from values WHERE number=$1',[number])
    if(rows.length===0){
        const response=await pool.query('INSERT INTO values (number) VALUES ($1)',[number])
        redisClient.hset('values', number, 'Nothing yet!')
        dup.publish('fib', number)
        console.log(response)
        res.status(202).send()

    }else{
        res.status(422).send({error:`${number} alredy exists`})
    }
    // redisClient.hgetall('values', (error, values) => {

    //     console.log(error, values)
    // })

})




app.listen(8081, () => {
    console.log('Server up on port 8081')
})