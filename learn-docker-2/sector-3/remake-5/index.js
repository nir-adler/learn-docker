const express=require('express')

const app=express()

app.get('/',(req,res)=>{
    res.send('Hello worldaaaa')
})


app.listen(8081,()=>{
    console.log('Server up on port 8081')
})