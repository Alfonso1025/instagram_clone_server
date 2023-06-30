const client = require('../services/db')
const Resolver = require('../services/resolver')



module.exports = {
    createRoom : async(req, res)=>{
        const resolver = Resolver(res)
        try {
            if(req.body.participants === undefined) return resolver.badRequest(null, 'missing_participants')
            const participantsArray = req.body.participants
            
            await client.connect()
           
            const createRoom = await client.db('instagram').collection('chat').insertOne(
            {
                participants : participantsArray,
                messages : []
            },
                (error,result)=>{
                    if(error) return resolver.internalServerError(error,'mongodb_error')
                    resolver.success(result,'new_room_created')
                }
            )
            
        } 
        catch (error) {
            return  resolver.internalServerError(error, error.message)
        }
    },
    getRooms : async(req, res)=>{
        const resolver = Resolver(res)
       
        try {
            if(req.params.participantId === undefined) return resolver.badRequest(null, 'missing_participantId')
            const participantId = req.params.participantId
            await client.connect()
            const allRooms = await client.db('instagram').collection('chat').find(
               { $or: [
                    { "participants.userId": participantId },
                    { "participants.friendId": participantId }
                    ]
               }
            ).toArray()
            console.log(allRooms)
            if(allRooms.length < 1  || allRooms[0] == undefined) return resolver.notFound(allRooms, 'user_has_no_chats')
            return resolver.success(allRooms, 'found_all_rooms')
        } 
        catch (error) {
            resolver.internalServerError(error, error.message)
        }
    },
    openRoom : async(req, res)=>{
        const resolver = Resolver(res)
        try {
            if(req.params.roomId === undefined) return resolver.badRequest(null, 'missing_roomId')
            const roomId =  new ObjectId(req.params.roomId)
            await client.connect()
            const getRoom = await client.db('instagram').collection('room').findOne(
                            {_id : roomId}
            )
            if(getRoom == undefined || getRoom == null) return resolver.notFound(getRoom, 'could_not_find_room')
            return resolver.success(getRoom, 'room_found')
        } 
        catch (error) {
            resolver.badRequest(error.name, error.message)
        }
    },
    checkIfRoomExists : async(req,res) =>{
        
        const resolver =  Resolver(res)
        try {
            if(req.body.userId === undefined) return resolver.badRequest(null, 'missing_userId')
            if(req.body.friendId === undefined) return resolver.badRequest(null, 'missing_friendId')
            const userId = req.body.userId
            const friendId = req.body.friendId
            console.log(userId)
            console.log(friendId)
            await client.connect()
            const firstQuery = await client.db('instagram').collection('chat').find(
                {participants : {
                    
                    $all: 
                     [
                        {$elemMatch: {id: friendId}},
                        {$elemMatch: {id: userId}}
                    ] 
                }
                    
                }
            ).toArray()
            if(firstQuery.length !== 1)  return resolver.notFound(null, 'not_room_found')
            return resolver.success(firstQuery, 'room_exist')
           
        } catch (error) {
            console.log(error)
            if(error instanceof Error) return resolver.internalServerError(error, error.message)
            return resolver.internalServerError(error, 'an error ocurred')
        }
    }
}