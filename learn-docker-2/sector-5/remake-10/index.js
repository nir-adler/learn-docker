const express = require('express')
const redis = require('redis')
const app = express()

const redisClient = redis.createClient({
    host: 'redis'
})
redisClient.set('counter', 0)

app.get('/', async (req, res) => {
    redisClient.get('counter',(error,counter)=>{
        if(error){
            return res.status(422).send({error:error.message})
        }
        redisClient.set('counter',parseInt(counter)+1,(error)=>{
            if(error){
                return res.status(422).send({error:error.message})
            }
            res.send(`You are visitor number ${parseInt(counter)+1}`)
        })
    })
})


app.listen(8081, () => {
    console.log('Server up on port 8081')
})