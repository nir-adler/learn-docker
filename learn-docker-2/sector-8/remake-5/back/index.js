const keys = require('./keys')
const express = require('express')
const cors = require('cors')
const redis = require('redis')


// setup express

const app = express()
app.use(cors())
app.use(express.json())


// redis setup
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort
})
const redisDup = redisClient.duplicate()
redisClient.on('error', (error) => {
    console.log(error)
})

redisClient.on('connect', (error) => {
    if (error) {
        console.log(error)
    }
    console.log('redis connected successfully')
})

// pg setup

const { Pool } = require('pg')
const pool = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})

pool.on('connect', (client) => {
    console.log('pg conected successfully')
    client.query('CREATE TABLE IF NOT EXISTS values (number INT PRIMARY KEY)', (error, result) => {
        if (error) {
            console.log(error)
        }
        // console.log(result)
        // console.log('pg crate table values')
        client.release()
    })
})

pool.on('error', (error) => {
    console.log(error)
})

pool.connect((error) => {
    if (error) {
        console.log(error)
    }
})


app.get('/', (req, res) => {
    console.log(req.query)
    res.send('hello world')
})



app.get('/temp', (req, res) => {
    redisClient.hgetall('values', (error, values) => {
        if (error) {
            console.log(error)
            return res.status(500).send(error)
        }
        res.send(values)
    })
})


app.get('/addvalue/:number', (req, res) => {
    const { number } = req.params



    redisClient.publish('fib', number, async (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).send(error)
        }
        let client
        try {
            client = await pool.connect()
            await client.query('INSERT INTO values (number) VALUES ($1)', [number])
            res.status(201).send()
        } catch (error) {
            console.log(error)
            if(client){
                client.release()
            }
            // console.log(error.name)
            // console.log(error.message)
            // console.log(error)
            if (error.message === 'duplicate key value violates unique constraint "values_pkey"') {
                return res.status(404).send({ error: error.message })
            } else {
                return res.status(500).send({ error: error.message })

            }
        }
    })
})


app.get('/saved', async (req, res) => {
    try {
        const client = await pool.connect()
        const results = await client.query('SELECT * FROM values')
        // console.log(results.rows)
        res.send(results.rows)
    } catch (error) {
        console.log(error)
        res.status(500).send(e.message)
    }
})




app.listen(8081, () => {
    console.log('Server up on port 8081')
})