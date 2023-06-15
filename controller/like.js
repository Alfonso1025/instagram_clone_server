const Resolver = require('../services/resolver')
const ObjectId= require('mongodb').ObjectId
const client = require('../services/db')

module.exports = {
    addLike  : async(req, res) =>{
        const resolver = Resolver(res)
       
        try {
            
            const id = new ObjectId(req.body.id)
            const collection = req.body.collection
            const userId = req.body.userId
            const userName = req.body.userName
            
            await client.connect()
             
 
            const giveALike = await client.db('instagram').collection(`${collection}`).updateOne(
                {_id : id}, {$addToSet : { likes : {likedBy : userId, userName}} }
            )
            
 
             if(giveALike.acknowledged =! true || giveALike.modifiedCount != 1)  return resolver.badRequest(null, 'could not update likes')
             
             return resolver.success(giveALike, 'likes updated')
        } 
        catch (error) {
           return resolver.badRequest(error.name, error.message)
        }
    },
    unLike : async(req, res)=>{

        const resolver = Resolver(res)
        try {
            const id = new ObjectId(req.body.id)
            const userId = req.body.userId
            const collection = req.body.collection
            await client.connect()
 
            const deleteLike = await client.db('instagram').collection(`${collection}`).updateOne(
                {_id : id}, {$pull : {likes:{likedBy : userId}}}
            )
            console.log(deleteLike)
            if(deleteLike.acknowledged =! true && deleteLike.modifiedCount!=1)  return resolver.badRequest(deleteLike, 'could not update likes')
             return resolver.success(deleteLike, 'unliked')
        } 
        catch (error) {
            return resolver.badRequest(error.name, error.message)
        }
 
    },
}