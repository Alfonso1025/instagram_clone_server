const client = require('../services/db')
const bcrypt = require('bcrypt')
const jwtGenerator = require('../services/jwtGenerator')
const Resolver = require('../services/resolver')
const jwt=require('jsonwebtoken')

module.exports = {

    registerUser : async (req, res) => {
        const resolver = Resolver(res)

         try {
            
            
        
            
            const userName = req.body.userName
            const email = req.body.email
            const password = req.body.password
        
            await client.connect()
        
        
            const existingUser = await client.db('instagram').collection('users').find(
                    {userEmail : email}
                ).toArray()
                
            if(existingUser.length > 0) return resolver.conflict(existingUser, 'existing_user')
        
            const saltRound =10
            const salt= await bcrypt.genSalt(saltRound)
            const bcryptPassword= await bcrypt.hash(password, salt)
        
             const newUser = await client.db('instagram').collection('users').insertOne(
                    {
                        userName,
                        userEmail : email,
                        password : bcryptPassword,
                        followers : [],
                        following : [],
                        isAccountPublic : true
        
        
                    },
                    (error, result) => {
                        if(error) return resolver.internalServerError('mongodb_error', error)
                        
                        return resolver.success(result, ' new user inserted')
                    }
                )
        
         } 
         catch (error) {
             console.log(error)
             return resolver.internalServerError(null,error.message )
         }
     
        
    },
    loginUser : async(req, res) => {

        const resolver = Resolver(res)
        const email = req.body.email
        const password = req.body.password

        try {
            await client.connect()
            const loggedUser = await client.db('instagram').collection('users').findOne(
                {userEmail : email}, async(error, result) =>{
                    //500
                    if(error) return resolver.internalServerError(null, 'mongodb error')
                    //401
                    if (result === null || result === undefined) return resolver.unauthorized(null, 'user_not_found')
                   
                    const validPassword = await bcrypt.compare(password, result.password)
                    //401
                    if(!validPassword) return resolver.unauthorized(null, 'incorrect_password')

                    const token = jwtGenerator(result._id)
                    //200
                    return resolver.success({user : result, token}, 'user found and token produced') 
                }
            )
        } 
        catch (error) {
            console.log(error)
            return resolver.internalServerError(error, error.message)
        }

    }
}