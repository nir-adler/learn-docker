const express = require('express')
const app = express()
const redis = require('redis')

const client = redis.createClient({
    host: 'redis-server'
})

client.set('counter', 0)

app.get('/', (req, res) => {
    client.get('counter', (error, counter) => {
        client.set('counter', parseInt(counter) + 1, (error) => {
            res.send(`You are visitor ${parseInt(counter) + 1}`)
        })
    })
})


app.listen(8081, () => {
    console.log('Server up on port 8081')
})
