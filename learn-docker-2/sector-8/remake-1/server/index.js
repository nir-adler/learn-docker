const keys = require('./keys')
// Express setup
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

pgClient.on('error', () => console.log('postgres error'))

pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((e) => console.log(e))


// Redis setup
const redis = require('redis')
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisHost,
    retry_strategy: () => 1000
})

const redisPublisher = redisClient.duplicate()

// Express route handler

app.get('/',(req,res)=>{
    res.send('Hi')
})
