const client = require('../services/db')
const Resolver = require('../services/resolver')
const bucket = require('../services/bucket')

module.exports = {
    allUsers : async(req, res) =>{
        const resolver = Resolver(res)
        try {
            await client.connect()
            const query = await client.db('instagram').collection('users').find().toArray()
            const allUsers = []
            if(query.length < 1 ) return resolver.notFound(null, 'could_not_find_users')
            let i = 0
            while(i < query.length){ 

                const userObject = {id:'', name:'',picture:''}
                if(query[i].profilePicture === ''){
                   
                    userObject.id = query[i]._id
                    userObject.name = query[i].userName
                    allUsers[i] = userObject 
                  
                    
                }
                else{
                  
                  
                    const readStream = await bucket.downloadProfilePicture(query[i].profilePicture)
                    .then( url => { 
                        
                        userObject.id = query[i]._id
                        userObject.name = query[i].userName
                        userObject.picture = url
                        allUsers[i] = userObject
                        
                    } )
                }
                i++
            }
            
          return  resolver.success(allUsers, 'all_users_retrieved')
        } catch (error) {
            if(error instanceof Error){
               return resolver.internalServerError(error, error.message)
            }
        }
    }
}