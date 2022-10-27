const Resolver = require('../services/resolver')
const ObjectId= require('mongodb').ObjectId
const client = require('../services/db')


module.exports = {
    createComment : async (req, res)=>{
        const resolver = Resolver(res)
        
        
        try {
            
            const postId = req.body.relatedPost
            const userId = req.body.commentByUser
            const userName = req.body.userName
            const content = req.body.content
            //guarantee that the postId actually belongs to an existing post in db.
            
            await client.connect()
            const findPost = await client.db('instagram').collection('userPost').findOne(
                {_id : new ObjectId(req.body.relatedPost)}
                
            )
            
            if(findPost == null) return resolver.badRequest(null, 'relatedPost_not_found')
            
            const insertedComment = await client.db('instagram').collection('comments').insertOne(
                {
                    relatedPost : postId,
                    commentByUser : userId,
                    userName,
                    commentContent : content,
                    likes :        [  ],
                    replies : [ ]

                },
                (error, data) =>{
                    if(error) return resolver.internalServerError(error, 'mongodb_error')
                    return resolver.success(data, 'comment_inserted')
                }
            ) 

        } 
        catch (error) {
            return resolver.badRequest(error.name, error.message)
        }
    },
   getComments : async (req, res)=>{
       const resolver = Resolver(res)
       try {
           const postId = new ObjectId(req.params.postId)
          
           await client.connect()
           const getAllComments = await  client.db('instagram').collection('comments').find(
               {
                   relatedPost : postId
               }
           ).toArray()
          return res.send(getAllComments)

       } 
       catch (error) {
           resolver.badRequest(error.name, error.message)
       }
   },
   updateComment : async(req, res)=>{
        const resolver = Resolver(res)
        try {

            const commentId = new ObjectId(req.body.commentId)
            const contentToUpdate = req.body.content
            await client.connect()
            const updateQuery = await client.db('instagram').collection('comments').updateOne(
                {_id : commentId }, { $set : {commentContent : contentToUpdate}}
            )
            
            if(updateQuery.acknowledged != true || updateQuery.modifiedCount != 1) return resolver.badRequest(updateQuery, 'could_not_update')
            return resolver.success(updateQuery, 'comment_updated')
        }
         catch (error) {
             console.log(error)
            return resolver.badRequest(error.name, error.message)
        }
   },
   deleteComment : async (req, res)=>{
    const resolver = Resolver(res)
    try {
        
        const commentId = new ObjectId(req.body.commentId)
        
        await client.connect()

        const deleteQuery = await client.db('instagram').collection('comments').findOneAndDelete(
            {_id : commentId}
        )
        

        if(deleteQuery.value == null) return resolver.badRequest(deleteQuery, 'could_not_delete')
        return resolver.success(deleteQuery, 'deleted')
    } catch (error) {
        return resolver.badRequest(error.name, error.message)
    }
   },

   likeComment : async(req, res) =>{
       const resolver = Resolver(res)
      
       try {
           console.log('id',req.body.commentId)
           const commentId = new ObjectId(req.body.commentId)
           
           const userId = req.body.userId
           const userName = req.body.userName
           
           await client.connect()
            

           const likeComment = await client.db('instagram').collection('comments').updateOne(
               {_id : commentId}, {$addToSet : { likes : {likedBy : userId, userName}} }
           )
           

            if(likeComment.acknowledged =! true || likeComment.modifiedCount != 1)  return resolver.badRequest(likeComment, 'could not update likes')
            
            return resolver.success(likeComment, 'likes updated')
       } 
       catch (error) {
          return resolver.badRequest(error.name, error.message)
       }
   },
   unLike : async(req, res)=>{

       const resolver = Resolver(res)
       try {
           const commentId = new ObjectId(req.body.commentId)
           console.log('this is the object id to delete', commentId)
           const userId = req.body.userId
           await client.connect()

           const deleteLike = await client.db('instagram').collection('comments').updateOne(
               {_id : commentId}, {$pull : {likes:{likedBy : userId}}}
           )
           console.log(deleteLike)
           if(deleteLike.acknowledged =! true && deleteLike.modifiedCount!=1)  return resolver.badRequest(deleteLike, 'could not update likes')
            return resolver.success(deleteLike, 'likes updated')
       } 
       catch (error) {
           return resolver.badRequest(error.name, error.message)
       }

   },
   addReply : async(req, res)=>{
        const resolver = Resolver(res)
       
       try {
            const commentId = new ObjectId(req.body.commentId)
            console.log(commentId)
            const contentReply = req.body.content
            const userId =  req.body.userId
            const userName = req.body.userName

            await client.connect()
            const addReply = await  client.db('instagram').collection('comments').updateOne(
                {_id : commentId}, { $addToSet : {replies: {repliedBy : userId, userName, contentReply}}}
            )
            console.log('this is addreply',addReply)
            if(addReply.acknowledged != true || addReply.modifiedCount != 1) return resolver.badRequest(addReply, 'could not add reply')
            return resolver.success(addReply, 'reply inserted')
            
            
       } catch (error) {
           console.log(error)
           return resolver.badRequest(error.name, error.message)
       }
   },
   updateReply : async(req, res)=>{
        const resolver = Resolver(res)

        try {
            const commentId = new ObjectId(req.body.commentId)
            const contentToUpdate = req.body.content
            const repliedBy = req.body.repliedBy
            await client.connect()
            const updateQuery = await client.db('instagram').collection('comments').updateOne(
                {"_id" :  commentId},
                { "$set" : {"replies.$[rep].contentReply" : contentToUpdate} }, 
                {"arrayFilters" :[ { "rep.repliedBy" : repliedBy} ], new : true}
            )
            res.send(updateQuery)
        } 
        catch (error) {
            console.log(error)
            return resolver.badRequest(error.name, error.message)
        }
   },
   deleteReply : async(req, res)=>{
       const resolver = Resolver(res)
       try {
           const commentId = new ObjectId(req.body.commentId)
           const repliedBy = req.body.repliedBy
           await client.connect()
           const deleteQuery = await client.db('instagram').collection('comments').updateOne(
               {_id : commentId}, {$pull : {replies : {repliedBy}}}
           )

           if(deleteQuery.acknowledged =! true || deleteQuery.modifiedCount != 1)  return resolver.badRequest(deleteQuery, 'could not delete reply')
            return resolver.success(deleteQuery, 'likes updated')
       } catch (error) {
           resolver.badRequest(error.name, error.message)
       }
   },
   findUser : async(req, res)=>{
       const id = new ObjectId(req.params.id)
       await client.connect()
       const user = await client.db('instagram').collection('userPost').findOne({_id : id})
       res.send(user)
   }
}