
 const app = require('./server')
 const client = require('./services/db')
const serverSocket = require('http').createServer(app)
const {Server} = require('socket.io')
const io = new Server(serverSocket, {
    cors: {
        origin : "*",
        methods: ["GET", "POST"]
    }
})

    io.on('connection', socket => {

        console.log('user :', socket.id)
        socket.on('join', (roomId)=>{
    
            socket.join(roomId)
            console.log(`user ${socket.id} has join the room : ${roomId} `)
    
        })
        socket.on('send', async(messageObject) =>{
            console.log(messageObject)
            socket.to(messageObject.roomId).emit('receive_message', messageObject)
            await client.connect()
           const newMessage = await client.db('instagram').collection('chat').updateOne(
                {_id : new ObjectId(messageObject.roomId) }, {$addToSet : { messages : { 
                    author : messageObject.author,
                    content : messageObject.content,
                    time : messageObject.time
                }}}
            )
            console.log(newMessage)
            
        })
        socket.on('disconnect', ()=>{
            console.log('user disconnected : ', socket.id)
        })
        
    })
    
    module.exports = serverSocket
   

     


