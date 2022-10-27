 const app = require('../server')
const request = require('supertest')
const Resolver = require('../services/resolver')
const client = require('../services/db')
/* 
user registration  test
 */

/* describe('registerUser endpoint', ()=>{
    afterAll(async () => {
        await client.connect()
        await client.db('instagram').collection('users').deleteOne({ userEmail: 'marcial@gmail.com' });
        await client.close()
    });
   
    //1. user provides all 3 valid credentials and does not exist on db
    it('insert user to db', async() => {

        const res = await request(app).post('/authentication/registerUser').send({

            userName : 'marcial',
            email : 'marcial@gmail.com',
            password : '123'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toContain('json');
        expect(res.body.data.insertedId).toBeDefined();

    }),
    //2. user already exist on the db
    it(' user already exists returns stauscode 400', async() => {
        const res = await request(app).post('/authentication/registerUser').send({
            userName : 'Joaquin',
            email : 'joaquin@gmail.com',
            password : '123'
        });
        expect(res.statusCode).toEqual(400)
        expect(res.headers['content-type']).toContain('json');
    }),
    //3. user is missing email, password or userName
    it('missing credentials returns stauscode 400', async() => {
        const res = await request(app).post('/authentication/registerUser').send({
            
            email : 'Martin@gmail.com',
            password : '123'
        });
        expect(res.statusCode).toEqual(400)
        expect(res.headers['content-type']).toContain('json');
    }),
    //4. user provides an invalid email format
    it('invalid email format returns statuscode 400', async() => {
        const res = await request(app).post('/authentication/registerUser').send({

            userName : 'Joaquin',
            email : 'joaquingmail.com',
            password : '123'
        })
        expect(res.statusCode).toEqual(400)
        expect(res.headers['content-type']).toContain('json');
    })
    
}) */


/* 
user login test
 */

/*  describe('login user endpoint', ()=>{
    //1. user provides correct email and password
    it(' if user provides correct credencials. Returns statuscode 200', async () => {
        const res = await request(app).post('/authentication/loginUser').send({

            email : 'joaquin@gmail.com',
            password : '123'
        })
        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toContain('json');
        expect(res.body.data.user.userEmail).toBe('joaquin@gmail.com')
    }),
    //2. user misses email or password
    it('if user misses email or password, returns statuscode 401', async ()=>{
        const res = await request(app).post('/authentication/loginUser').send({
            email : 'joaquin@gmail.com',
            
        })
        expect(res.statusCode).toEqual(401);
        expect(res.headers['content-type']).toContain('json');
    }),
    //3. email has an invalid format
    it('if email has an invalid format, returns statuscode 400', async ()=>{
        const res = await request(app).post('/authentication/loginUser').send({

            email : 'joaquingmail.com',
            password : '123'
            
        })
        expect(res.statusCode).toEqual(400);
        expect(res.headers['content-type']).toContain('json');
    })
    //4.email does not exist on db
    it('if email is unexistent, returns statuscode 401', async()=>{
        const res = await request(app).post('/authentication/loginUser').send({
            email : 'unexistent@gmail.com',
            password : '123'
        })
        expect(res.statusCode).toEqual(401)
    }),
    //password is incorrect
    it('if password is incorrect, returns statuscode 401', async()=>{
        const res = await request(app).post('/authentication/loginUser').send({
            email : 'joaquin@gmail.com',
            password : 'incorrect password'
        })
        expect(res.statusCode).toEqual(401)
        expect(res.headers['content-type']).toContain('json');
    })

}) 
  */
