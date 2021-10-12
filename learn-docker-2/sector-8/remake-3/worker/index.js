const keys = require('./keys')
const redis = require('redis')


const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    // retry_strategy:(e)=>{
    //     console.log(e)
    //     return 1000
    // }
})


const fib = (number) => {
    if (number < 2) {
        return number
    }
    return fib(number - 1) + fib(number - 2)
}

redisClient.on('error', (e) => console.log(e))

redisClient.on('connect', () => {
    const dup = redisClient.duplicate()
    dup.on('message', (channel, number) => {
        console.log(channel,number)
        redisClient.HSET('values',number,fib(number))
    })
    setTimeout(() => {

        redisClient.publish('fib', "aaa")
    }, 2000)
    dup.subscribe('fib')
})
