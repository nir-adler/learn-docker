const keys = require('./keys')

// Express setup

const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// Setup redis
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


// Postgres setup

const { Pool } = require('pg')

const pool = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})


// pool.connect((error, client, release) => {
//     // console.log(error)
//     if (error) {
//         return console.error('Error acquiring client', error.stack)
//     }
//     client.query('CREATE TABLE IF NOT EXISTS values (number INT)', (error, result) => {
//         if (error) {
//             return console.error('Error acquiring client', error.stack)
//         }
//     })
// })
pool.on('error', (e) => console.log(e))
pool.on('connect', (client) => {
    console.log('Postgres connected Success!')
    client
        .query('CREATE TABLE IF NOT EXISTS values (number INT)')
        .catch((e) => console.log(e))

})



// Routes




app.get('/', (req, res) => {
    res.send('Hello')
})

app.get('/tempvalues', (req, res) => {
    redisClient.hgetall('values', (error, values) => {
        if (error) {
            console.log(error)
            return res.status(500).send({ error: JSON.stringify(e) })
        }
        res.send(values)
    })
})

app.get('/savevalues', async (req, res) => {
    try {
        const { rows } = await pool.query('select * from values')
        res.send(rows)
    } catch (e) {
        res.status(500).send({ error: JSON.stringify(e) })
    }
})


app.post('/value', async (req, res) => {
    const { number } = req.body
    try {
        if (!number || number > 40) {
            return res.status(422).send({ error: 'Please send number bigger then 40' })
        }
        const { rows } = await pool.query('select * from values WHERE number=$1', [number])
        if (rows.length === 0) {
            redisClient.hset('values', number, 'Nothing there yet', async (error) => {
                if (error) {
                    return res.status(500).send({ error: JSON.stringify(error) })
                }
                dup.publish('fib', number)
                await pool.query('INSERT INTO values(number) VALUES ($1)', [number])

                return res.status(202).send()
            })
        } else {
            res.status(422).send({ error: `Number ${number} already exists` })
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: JSON.stringify(e) })
    }

})


app.get('*', (req, res) => {
    res.send("*")
})


app.listen(8081, () => {
    console.log('Server up on port 8081')
})