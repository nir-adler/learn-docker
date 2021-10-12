const express = require('express')
const redis = require('redis')

const client = redis.createClient({
    host: 'redis-server'
})

client.set('counter', 0)

const app = express()

app.get('/', (req, res) => {
    client.get('counter', (error, counter) => {
        client.set('counter', parseInt(counter) + 1, (error, result) => {
            res.send(`You are the ${ parseInt(counter)+1} visitor`)
        })


    })
})



app.listen(8081, () => {
    console.log('Server up on port 8081')
})