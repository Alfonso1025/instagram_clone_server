const app = require('./server')
const serverSocket = require('./socketConnection')

require('dotenv').config()

app.listen(process.env.PORT, ()=>{
    console.log('app is running in port', process.env.PORT)
})
serverSocket.listen(process.env.socketPort, ()=>{
    console.log(' socket connection running on port', process.env.socketPort)
}) 



