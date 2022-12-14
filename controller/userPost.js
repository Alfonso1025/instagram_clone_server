

const bucket = require('../services/bucket')
const Resolver = require('../services/resolver')
const client = require('../services/db')
const resolver = require('../services/resolver')
const ObjectId=require('mongodb').ObjectId

module.exports = {

multiPost : async (req, res) => {

    const resolver = Resolver(res)
    try {
        if(req.files === [] || !req.files){
            
            return resolver.badRequest(req.files, 'did not make it')
        } 
        else if(req.files) {

            const uploads = await bucket.uploadMultipleImagesAws(req.files)
            console.log(uploads)
        
            const uploadedKeys = uploads.map(object => {return  object.key})
            
            
           
            const userId = ObjectId( req.body.userId )
            const contentString = req.body.contentString
            const date = req.body.date
            if(date === undefined || userId === undefined) return resolver.badRequest(null, 'missing userId or date or content')
            await client.connect()
             client.db('instagram').collection('userPost').insertOne(
               {
                 postedByUser : userId,
                 contentPost : {
                     contentString,
                     uploadedKeys
                 },
                 likes : [],
                 date 

               },
               (error, result) =>{
                   if(error) return resolver.internalServerError(error,'mongo db error')
                   console.log('this is the post inserted', result)
                   return resolver.success(result, 'post inserted')
               }
           )   
           
        }
        
         

    } catch (error) {
        console.log(error)
        return resolver.badRequest(error.name, error.message)
    }
},

getPostsFromFollowingUsers : async (req, res) => {

     const resolver = Resolver(res)
    try {
        //the error of passing a wrong id is handled in the catch block
        
        const userId = new ObjectId(req.params.userId )

        await client.connect()
        const user = await client.db('instagram').collection('users').findOne(
            { _id : userId }
            )
        if(user === undefined || user === null) return resolver.badRequest(user, 'could not find user')
        //check if user  is following other users
        
        if(user.following.length == 0 || user.following === undefined) return resolver.badRequest(null, 'user_is_not_following_anyone') 
        //array of _ids of users being followed
        const followingUsersArray = user.following 
        
        const objectsIdArray = followingUsersArray.map(user => new ObjectId(user.id) )

        const followingUserPostsArray = await client.db('instagram').collection('userPost').find(
           { postedByUser : {$in: objectsIdArray }}
            ).toArray()

        if(followingUserPostsArray === undefined || followingUserPostsArray.length == 0) return resolver.badRequest(followingUserPostsArray, 'no posts found')
        const allPost = []

         
        for(let i = 0; i < followingUserPostsArray.length; i++) {

             const arrayKeys = followingUserPostsArray[i].contentPost.uploadedKeys
            
             const arrayUrls = await bucket.downloadImagesAws(arrayKeys)
        
             allPost.push(
                {
                   contentString : followingUserPostsArray[i].contentPost.contentString,
                   urls : arrayUrls
               }
             )


        }
      if( allPost.length == 0) return resolver.badRequest(null, 'could not get posts')
      
      return  resolver.success(allPost, `retrieved post from users followed by user ${user.userEmail}`)
      
      
    } 
    catch (error) {
     console.log(error)
      return resolver.badRequest(error.name, error.message)
    }
     
    
},


updatePost : async(req, res) => {

const resolver = Resolver(res)
    try {
           //the error of passing a wrong id to new ObjectId() is handled in the catch block
           const postId = new ObjectId(req.body.postId)
        
           const contentToUpdate = req.body.contentToUpdate

           if(contentToUpdate === undefined) return resolver.badRequest( {contentToUpdate}, 'missing_content')
           
           await client.connect()
        
           const updatedContent = await client.db('instagram').collection('userPost').updateOne(
            
            {_id : postId}, { $set: {  "contentPost.contentString" : contentToUpdate  }}
                ,(error, data) => {

                    if(error) return resolver.internalServerError(error, 'mongodb error')
                
                    return resolver.success(data, 'succesfully updated')
            }
            )
       
    } catch (error) {
       
        return resolver.badRequest(error.name, error.message)
    }

},
deletePost : async( req, res ) => {
    const resolver = Resolver(res)
    try {
        const id = req.body.postId
        
        const postId =  new ObjectId(id)
        console.log('this is the id to delete', postId)
        
        await client.connect()

        const deleteFromMongo = await client.db('instagram').collection('userPost').findOneAndDelete(
            {_id : postId}
        )
        
        if(deleteFromMongo.value === null) return resolver.badRequest(deleteFromMongo, 'could not delete post')
        
        const arrayKeys = deleteFromMongo.value.contentPost.uploadedKeys
        console.log('this is the array of keys to delete', arrayKeys)
        const deleteFromAwsArray = await bucket.deleteImagesAws(arrayKeys)

        
        return resolver.success(deleteFromAwsArray, 'post deleted succesfully')

        
        
    } 
    catch (error) {
        console.log('problem with the id',error.message)  
        return  resolver.badRequest(error.name, error.message)
    }
},
findLast : async(req, res) =>{
   await client.connect()
   const addNewField = await client.db('instagram').collection('users').updateMany(
    {}, {$set : {"profilePicture":''}}, {upsert: false}, {multiPost: true}
   )
   //const query = await client.db('instagram').collection('userPost').find({}).toArray()
   //const last = query[query.length-1]._id
  /*  const query = await client.db('instagram').collection('userPost')
  .findOne({_id : new ObjectId('62fbb18f2c1c756bb7936d97')}, (error, data)=>{
      if(error){
        console.log(error)
        return res.send(error.message)
      } 
      console.log(data)
      return res.send(data) 
  }) */
   
}
}