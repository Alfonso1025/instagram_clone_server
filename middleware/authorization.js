const jwt = require('jsonwebtoken')
require('dotenv').config()
const Resolver = require('../services/resolver')

module.exports = async(req, res, next)=>{
    const resolver = Resolver(res)
     try {
        
        const jwtToken = req.header("token")
        
        
        if(!jwtToken) return resolver.unauthorized(null, 'token missing')

        const payload = jwt.verify(jwtToken, process.env.jwtSecret)
       
        req.user = payload.user
        next();

    } catch (error) {

        console.error('from authorization middleware',error.message)
        return resolver.unauthorized(error, 'unauthorized')
    } 
}