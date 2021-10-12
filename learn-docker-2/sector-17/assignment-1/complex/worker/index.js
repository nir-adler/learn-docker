const keys = require('./keys')
const redis = require('redis')

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: (e) => {
        console.log(e)
        return 1000
    }
})

const fib = (number) => {
    if (number < 2) {
        return number
    }
    return fib(number - 1) + fib(number - 2)
}

redisClient.on('error', (e) => console.log(e))

const dup = redisClient.duplicate()

redisClient.on('connect', () => {
    dup.on('message', (channel, number) => {
        console.log(number,fib(number))
        redisClient.hset('values',number,fib(number))
    })

 
    dup.subscribe('fib')
})
