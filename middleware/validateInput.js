const resolver = require('../services/resolver')
const Resolver = require('../services/resolver')

module.exports = function(req,res,next){

    const resolver = Resolver(res)

    const {userName, email, password} = req.body
    
    function validateEmail(uEmail){

        return  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(uEmail)
    }
    if(req.path === "/registerUser"){

        if(![userName, email, password].every(Boolean)){ 

            return resolver.badRequest(null, 'missing credencials')
        }

        else if(!validateEmail(email)){

            return resolver.badRequest(email, 'invalid email')
        }
    }
    
    else if(req.path === '/loginUser'){
        if(![email, password].every(Boolean)){
            return resolver.unauthorized(null, 'mssing credentials')
        }
        else if(!validateEmail(email)){
            return resolver.badRequest(email, 'invalid email')
        }
    
    }
    next()
    }