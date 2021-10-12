const express = require('express')
const redis = require('redis')

const redisClient = redis.createClient({
    host: 'redis'
})
redisClient.set('counter', 0, (error) => {
    if (error) {
        console.log(error)
    }
})
const app = express()

app.get('/', async (req, res) => {
    redisClient.get('counter', (error, counter) => {
        redisClient.set('counter', parseInt(counter) + 1, (error) => {
            if (error) {
                return res.status(422).send({ error: error.message })
            }
            res.send(`You are visitor number ${parseInt(counter) + 1}`)
        })
    })
})


app.listen(8081, () => {
    console.log('Server up on port 8081')
})