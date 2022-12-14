
const Resolver = require('../services/resolver')
const ObjectId= require('mongodb').ObjectId
const client = require('../services/db')
const bucket = require('../services/bucket')
const userPost = require('./userPost')

module.exports = {

    verifyToken : async(req, res) => {
        
       const resolver = Resolver(res) 
        try {
            return resolver.success(true, 'Authorized. Token present')
        } 
        catch (error) {
            console.log(error)
        }
    },

    getUser : async(req, res) => {

        const resolver = Resolver(res)
        await client.connect()

        try {
           const id =  new ObjectId(req.user)
           const user = await client.db('instagram').collection('users').findOne({
               _id : id

           }, (error, result) => {

               if(error) return resolver.internalServerError(error, 'mongodb error')
               if(result === null) resolver.badRequest(null, 'the id is incorrect. No user found')
               
               return resolver.success(result, 'user found in dashboard')
           })
        } 
        catch (error) {
            resolver.internalServerError(error, 'server error')
        }
        
    },
    chooseProfilePicture : async(req, res) => {
        console.log('tghis is the file',req.file)
        console.log('this is the body',req.body.file)

        
        try {
            const userId = req.user//get this from authorization middleware
            const upload = await bucket.uploadProfileImage(req.file)
            const key = upload.Key
            await client.connect()
            const storeKeyToImage = await client.db('instagram_clone').collection('users').updateOne(
                {_id : userId}, {$set : {profilePicture : key }}
            )

        } catch (error) {
            
        }
       

       console.log('this is the url', url)
    },
    getProfileUserPosts : async(req, res) =>{

        const resolver = Resolver(res) 
         const userId = ObjectId(req.params.userId)
         console.log(userId)
         await client.connect()
         
         const userPostsArray = await client.db('instagram').collection('userPost').find(
            { postedByUser : userId}
         ).toArray()
         
         if(userPostsArray === undefined || userPostsArray.length ===0) return resolver.internalServerError(userPostsArray, 'mongodb error')
        
         console.log(userPostsArray)
        
        const postsArray = []

        for(let i = 0; i < userPostsArray.length; i++){

            const arrayKeys = userPostsArray[i].contentPost.uploadedKeys
            const arrayUrls =   await bucket.downloadImagesAws(arrayKeys)
            postsArray.push({ 
                postId : userPostsArray[i]._id,   
                contentString : userPostsArray[i].contentPost.contentString,
                arrayUrls
                })

        }
     if(postsArray === undefined || postsArray === []) return resolver.badRequest(postsArray, 'no post were found')
     return resolver.success(postsArray, 'User??s profile posts were retrieved succesfully')
        
    },

    followUser : async(req, res)=>{
        const resolver = Resolver(res)
        const userId = new ObjectId(req.body.userId)
        const userName =  req.body.userName
        const userToFollowId = new ObjectId(req.body.userToFollowId)
        const userToFollowName = req.body.userToFollowName
        await client.connect()

        const userToBeFollowed = await client.db('instagram').collection('users').updateOne(
            {_id : userToFollowId}, {$addToSet : {followers : {id : userId, name : userName}} }
        ) 
        if(userToBeFollowed.acknowledged != true) return resolver.badRequest(userToBeFollowed, 'could not update followers')
        
        const userFollowing = await client.db('instagram').collection('users').updateOne(
            {_id : userId}, {$addToSet : {following : {id : userToFollowId, name : userToFollowName}} }
        )
        if(userFollowing.acknowledged != true) return resolver.badRequest(userToBeFollowed, 'could not update following')
        resolver.success({userToBeFollowed, userFollowing}, 'followers_and_following_updated')
    },
    getFollowers : async (req, res)=>{
        const resolver = Resolver(res)
        try {
            const userId = new ObjectId(req.params.userId)
            await client.connect()
            const followerUsers = await client.db('instagram').collection('users').findOne(
                {
                    _id : userId
                }
            )
            //it is possible that user has no followers. An empty array could be returned 
            return resolver.success(followerUsers.followers, 'found folllowers')

        } catch (error) {
           return  resolver.badRequest(error.name, error.message)
        }
    }
}