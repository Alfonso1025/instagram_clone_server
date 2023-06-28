
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
               if(result === null) resolver.notFound(null, 'could_not_find_user')
               
               return resolver.success(result, 'user_info_retrieved')
           })
        } 
        catch (error) {
            console.log('error from get user', error)
            resolver.internalServerError(error, error.message)
        }
        
    },
    chooseProfilePicture : async(req, res) => {
        console.log('this is the file',req.file)
       
        const resolver = Resolver(res)
        
        try {
            const userId = new ObjectId(req.user)//get this from authorization middleware
            if(!req.file) return resolver.badRequest(null,'no_file_sent')
            //upload image to s3 bucket
            const upload = await bucket.uploadProfileImage(req.file)
            //obtain key to image in s3 bucket
            if(!upload.Key) return resolver.internalServerError(null, 'aws_error')
            const key = upload.Key
           
            await client.connect()
            //store key to image in the database
            const storeKeyToImage = await client.db('instagram').collection('users').updateOne(
                {_id : userId}, {$set : {profilePicture : key }}
            )
            if(storeKeyToImage.acknowledged != true || storeKeyToImage.modifiedCount != 1) return resolver.notFound(storeKeyToImage,'could_not_store_key')
            return resolver.success(storeKeyToImage,'profile_pic_uploaded')
        } catch (error) {
            console.log(error)
            resolver.internalServerError(error,error.message)
        }
       

       
    },
    downloadProfilePicture : async (req, res)=>{
        const resolver = Resolver(res)
        try {
            const userId = new ObjectId(req.user)
            await client.connect()
            const findKey = await client.db('instagram').collection('users').findOne( {_id: userId},
                async(error, result) =>{

                    if(error) return resolver.internalServerError(error, 'mongodb error')
                    if(result === null) resolver.notFound(null, 'incorrect_id_no_user_found')
                    if(result.profilePicture === "" || result.profilePicture === undefined) return resolver.notFound(null, 'user_does_not_have_profilepicture')
                    const key = result.profilePicture

                    const readStream = await bucket.downloadProfilePicture(key).then(url=> {
                        
                        resolver.success(url, 'image_url')
                    })
                        .catch(error=>{
                            resolver.internalServerError(error, 'aws_error')
                        } )

                }
                )
        } catch (error) {
            console.log(error)
            resolver.internalServerError(error, error.message)
        }
        
    },
    getProfileUserPosts : async(req, res) =>{
       const resolver = Resolver(res) 
       try {
      
        const userId = ObjectId(req.params.userId)
        console.log(userId)
        await client.connect()
        
        const userPostsArray = await client.db('instagram').collection('userPost').find(
           { postedByUser : userId}
        ).toArray()
        
        if(userPostsArray.length === 0) return resolver.notFound(userPostsArray, 'no_posts_found')
       
        console.log(userPostsArray)
       
       const postsArray = []

       for(let i = 0; i < userPostsArray.length; i++){

           const arrayKeys = userPostsArray[i].contentPost.uploadedKeys
           const arrayUrls =   await bucket.downloadImagesAws(arrayKeys)

           postsArray.push({ 
               postId : userPostsArray[i]._id,   
               contentString : userPostsArray[i].contentPost.contentString,
               author : userPostsArray[i].author,
               arrayUrls,
               likes : userPostsArray[i].likes
               })

       }
    if(postsArray === undefined || postsArray === []) return resolver.badRequest(postsArray, 'no post were found')
    return resolver.success(postsArray, 'user_profile_pots_succesfully_retrieved')
        
       } catch (error) {
          console.log(error)
          return resolver.internalServerError(error, error.message)
       }
        
        
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
        if(userToBeFollowed.acknowledged != true) return resolver.notFound(userToBeFollowed, 'could not update followers')
        
        const userFollowing = await client.db('instagram').collection('users').updateOne(
            {_id : userId}, {$addToSet : {following : {id : userToFollowId, name : userToFollowName}} }
        )
        if(userFollowing.acknowledged != true) return resolver.notFound(userToBeFollowed, 'could not update following')
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
            if(followerUsers.followers.length < 1) return resolver.notFound(null, 'user_has_no_followers')
            return resolver.success(followerUsers.followers, 'succesfully_retrieved_followers')

        } catch (error) {
           return  resolver.internalServerError(error, error.message)
        }
    }
}