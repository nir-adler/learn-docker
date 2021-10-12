const keys = require('./keys')

// Express set up
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Postgres setup
const { Pool } = require('pg')
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})


pgClient.on('connect', (client) => {
    client
        .query('CREATE TABLE IF NOT EXISTS values (number INT UNIQUE)')
        .catch((e) => console.log(e))
})


// Redis client setup
const redis = require('redis')
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
})

const redisPublisher = redisClient.duplicate()

// Express route handler

app.get('/', (req, res) => {
    res.send('Hi')
})

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values')
    res.send(values.rows)
})

app.get('/values/current', (req, res) => {
    redisClient.hgetall('values', (error, values) => {
        console.log(values)
        res.send(values)
    })
})



app.post('/values', async (req, res) => {
    const { index } = req.body

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high')
    }

    redisClient.hset('values', index, 'Nothing yes!')
    redisPublisher.publish('insert', index)
    try{
       await pgClient.query('INSERT INTO values(number) VALUES($1)', [index])

    }catch(e){
        // console.log(e)
    }

    res.send({ working: true })

})

app.listen(5000,()=>{
    console.log('Server up on port 5000')
})

