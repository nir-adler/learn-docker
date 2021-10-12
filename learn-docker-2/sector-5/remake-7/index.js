const express = require('express')
const redis = require('redis')

const redisClient = redis.createClient({
    host: 'redis'
})
redisClient.on('error', (err) => {
    console.log(err)
})
const app = express()

redisClient.set('counter', 0)

app.get('/', (req, res) => {
    redisClient.get('counter', (error, counter) => {
        redisClient.set('counter', parseInt(counter) + 1, (error) => {
            res.send(`You are visitor number ${parseInt(counter) + 1}`)
        })
    })
})




app.listen(8081, () => {
    console.log('Server up on port 8081')
})