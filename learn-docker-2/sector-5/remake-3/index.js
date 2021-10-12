const express = require('express')
const redis = require('redis')
const client = redis.createClient()

client.set('counter',1)
const app = express()


app.listen('/',(req,res)=>{
    client.get('counter',(error,counter)=>{
        client.set('counter',parseInt(counter)+1,(error)=>{
            res.send(`You are visitor number:${parseInt(counter)+1}`)
        })

    })
})




app.listen(8081, () => {
    console.log('Server up on port 8081')
})