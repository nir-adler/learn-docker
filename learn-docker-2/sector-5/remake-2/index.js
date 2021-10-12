const process = require('process')
const express = require('express')
const redis = require('redis')


const app = express()
const client = redis.createClient({
    host: 'redis-server'
})


client.set('counter', 0)

app.get('/', (req, res) => {
    process.exit(0)
    client.get('counter', (error, counter) => {
        if (error) {
            console.log(error)
        }
        client.set('counter', parseInt(counter) + 1, (error) => {
            if (error) {
                console.log(error)
            }
            res.send(`You are ${parseInt(counter)+1}`)
        })
    })

})

app.listen(8081, () => {
    console.log('Server up on port 8081')
})