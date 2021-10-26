const keys = require('./keys')
const redis = require('redis')
var kindOf = require('kind-of')

// redis setup

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort
})

redisClient.on("connect", () => {
    console.log('redis connected successfully')
})

redisClient.on("error", (error) => {
    console.log(error)
})


const subscriber = redisClient.duplicate()
const fibc = redisClient.duplicate()

// fib function

const fib = (number) => {
    if (number < 2) {
        return number
    }
    return fib(number - 1) + fib(number - 2)
}


// subscribe fib channel

subscriber.subscribe('fib')
subscriber.on('message', (channel, message) => {
    if (channel === 'fib') {
        redisClient.hset('values', message, 'Nothing there yet :)', (error) => {
            if(error){
                console.log(error)
            }
            redisClient.hset('values', message, fib(parseInt(message)), (error) => {
                if(error){
                    console.log(error)
                }
            })
        })
        // redisClient.hgetall('values', (error, values) => {
        //     console.log(values)
        // })
    }
})



// test

// subscriber.on('subscribe', () => {
//     redisClient.publish('fib', 10)
//     redisClient.publish('fib', 30)
// })
