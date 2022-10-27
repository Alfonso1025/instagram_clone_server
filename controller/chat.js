const client = require('../services/db')
const Resolver = require('../services/resolver')



module.exports = {
    createRoom : async(req, res)=>{
        const resolver = Resolver(res)
        try {
    
            const participantsArray = req.body.participants
            await client.connect()
            const createRoom = await client.db('instagram').collection('chat').insertOne(
            {
                participants : participantsArray,
                messages : []
            },
                (error,result)=>{
                    if(error) return resolver.internalServerError('mongodb_error', error)
                    resolver.success('new_room_created', result)
                }
            )
            
        } 
        catch (error) {
            return  resolver.badRequest(error.name, error.message)
        }
    },
    getRooms : async(req, res)=>{
        const resolver = Resolver(res)
       
        try {
            const participantId = req.params.participantId
            await client.connect()
            const allRooms = await client.db('instagram').collection('chat').find(
                {participants : [userId] }
            ).toArray()
            if(allRooms.length < 1  || allRooms[0] == undefined) return resolver.badRequest(allRooms, 'could_not_find_rooms')
            return resolver.success(allRooms, 'found_all_rooms')
        } 
        catch (error) {
            resolver.badRequest(error.name, error.message)
        }
    },
    openRoom : async(req, res)=>{
        const resolver = Resolver(res)
        try {
            const roomId =  new ObjectId(req.params.roomId)
            await client.connect()
            const getRoom = await client.db('instagram').collection('room').findOne(
                            {_id : roomId}
    )
    if(getRoom == undefined || getRoom == null) return resolver.badRequest(getRoom, 'could_not_find_room')
     return resolver.success(getRoom, 'room_found')
        } 
        catch (error) {
            resolver.badRequest(error.name, error.message)
        }
    }
}