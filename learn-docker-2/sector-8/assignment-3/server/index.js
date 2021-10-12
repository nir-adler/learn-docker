const keys = require('./keys')

// Express App setup
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())


// Postgres Client setup
const { Pool } = require('pg')
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})
pgClient.on('error', (error) => {
    console.log(error)
})

pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((e) => console.log(e))

// Redis Client setup
const redis = require('redis')
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
})


const redisPublisher = redisClient.duplicate()

// Express route handler

app.get('/', (req, res) => {
    console.log('Hi')
})

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values')
    res.send(values.rows)
})

app.get('/values/current', (req, res) => {
    redisClient.hgetall('values', (error, values) => {
        res.send(values)
    })
})

app.post('/values', async (req, res) => {
    const { index } = req.body

    if (parseInt(index) > 40) {
        return res.status(422).send({ error: 'Send index small then 40' })
    }

    redisClient.hset('values', index, 'Nothing yet!')
    redisPublisher.publish('insert', index)
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index])

    res.send({working:true})

})

app.listen(5000,()=>{
    console.log('Server up on port 5000')
})