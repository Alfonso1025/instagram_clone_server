 const app = require('../server')
const request = require('supertest')
const client = require('../services/db')


//verifyToken 

 describe('verifyToken endpoint', ()=>{
    let jwToken = ''
    beforeAll(async()=>{
        const response = await  request(app).post('/authentication/loginUser')
        .send(
            {
                
                email : 'joaquin@gmail.com',
                password : '123'
            }
        )
        console.log(response.body.data.token)
        jwToken = response.body.data.token

    })
    //1. request comes with token in header. The token brings the req.user
    it('should return statuscode 200 if token is present in the request header', async()=>{
        
        const res = await request(app).get('/dashboard/verifyToken')
        .set('content-type', 'application/json')
        .set('token', jwToken )
        //.auth(jwToken, {type : "jwt"} )
        
        expect(res.statusCode).toEqual(200)
        expect(res.headers['content-type']).toContain('json')
        
    })

 

    //2. request misses token in header
     it('should return statuscode 401 if token is not present in header', async()=>{
        const res = await request(app).get('dashboard/verifyToken')
        expect(res.statusCode).toEqual(401)
        expect(res.headers['content-type']).toContain('json')
    }),
    //3. request has an invalid token 
    it('should return 401 if token is invalid', async()=>{
        const res = await request(app).get('dashboard/verifyToken')
        expect(res.statusCode).toEqual(401)
        expect(res.headers['content-type']).toContain('json')
        
       
    }) 


})

/* describe('getUser endpoint', ()=>{
    //1 token is present in header and the user info is retrived succesfully from db
    it('should return statusCode 200 if user is retrieved by id from database', async()=>{
        const res = await request(app).get('dashboard/getUser')
        expect(res.statusCode).toEqual(200)
        //expect(res.headers["Content-Type"]).toEqual(expect.stringContaining("json"));
         //compare req.user in token with user.id in query response

    }),
    //2. request misses token in header
    it('should return statuscode 401 if token is not present in header', async()=>{
        const res = await request(app).get('dashboard/verifyToken')
        expect(res.statusCode).toEqual(401)
    }),
    //3. request has an invalid token 
    it('should return 401 if token is invalid', async()=>{
        const res = await request(app).get('dashboard/verifyToken')
        expect(res.statusCode).toEqual(401)
        
       
    })

    
})  */