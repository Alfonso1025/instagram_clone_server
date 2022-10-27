const app = require('../server')
const request = require('supertest')
const client = require('../services/db')
const ObjectId=require('mongodb').ObjectId
const path = require('path')
const imagePath1 = path.join(__dirname, '../testImages/elon.png' )
const imagePath2 = path.join(__dirname, '../testImages/lex.png')

describe('upload post to db and aws', ()=>{
    
    it('should upload images in bulk to aws and insert post to db ', async()=>{
        const res = await request(app)
        .post('/userPost/multiple')
        .field('userId' , '62d185b2659bd1329a45c30d')
        .field('contentString' , 'last post inserted')
        .field('date', '08/07/22')
        .attach('multiInputFile', imagePath1  )
        .attach('multiInputFile', imagePath2  )

        expect(res.statusCode).toEqual(200)
        expect(res.headers['content-type']).toContain('json');
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()
        expect(res.body.data.insertedId).toBeDefined()
        

    })
    it('should return status 400 if req.files is undefined', async ()=>{
        const res = await request(app)
        .post('/userPost/multiple')

        
        expect(res.statusCode).toEqual(400)
        expect(res.headers['content-type']).toContain('json');

    })


    
}) 

describe('retrieve posts from users followed by logged user', ()=>{

    it('should retrieve all posts from all users that are followed by logged user',
    async()=>{
        const userId = '62d185b2659bd1329a45c30d'
        const res = await request(app).get(`/userPost/getPostsfromFollowingUsers/${userId}`)
        
        expect(res.statusCode).toEqual(200)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()
        
    }
    ),
    it('should return status code 400 if the userId is incorect',
    async ()=>{
        const wrongId = '62d185b2659bd1329a45'
        const res = await request(app).get(`/userPost/getPostsfromFollowingUsers/${wrongId}`)

        expect(res.statusCode).toEqual(400)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()

    }
    ),
    it('should return status code 400 if user does not follow anyone',
    async ()=>{
        const idOfUserDoesntFolloAnyone = '62e17f7b9eb0e271cf1480d8'
        const res = await request(app).get(`/userPost/getPostsfromFollowingUsers/${idOfUserDoesntFolloAnyone}`)
        
        expect(res.statusCode).toEqual(400)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBeDefined()
        expect(res.body.message).toBe('user_is_not_following_anyone')
        expect(typeof res.body.message).toBe('string')
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toBeDefined()

    }
    )
})

describe('update the contentString from a post', ()=>{
    
    afterAll(async ()=>{

        await client.connect()
        await client.db('instagram').collection('userPost').updateOne(
            { _id : new ObjectId('62fbb18f2c1c756bb7936d97')  }, {$set : {"contentPost.contentString" : 'original content'}}
            
            );
        await client.close()
    })

    
    it('should update post in db and return status code 200', 
    async()=>{

        const res = await request(app).put('/userPost')
        .send(
            {
                postId : '62fbb18f2c1c756bb7936d97',
                contentToUpdate : 'updated content'
            }
        )
        expect(res.statusCode).toEqual(200)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.message).toBe('succesfully updated')
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toBeDefined()
        expect(res.body.data.acknowledged).toBe(true)
        expect(res.body.data.modifiedCount).toEqual(1)
        
        
        
    }
    ),
    it('should return error code 400 if the id is incorrect',
     async()=>{
        const wrongId = '62d185b2659bd1329a45'
        const res = await request(app).put(`/userPost`)
        .send(
            {
                postId : wrongId,
                contentToUpdate : 'me gusta comer mucho'
            }
        )

        expect(res.statusCode).toEqual(400)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()
        expect(res.body.data).toBe('BSONTypeError')

    }),

    it('should return error code 400 if there is no contentToBeUpdated',
     async()=>{

        const id = '62fbb18f2c1c756bb7936d97'
        const res = await request(app).put(`/userPost`)
        .send(
            {
                postId : id
                //missing contentToUpdate
            }
        )

        expect(res.statusCode).toEqual(400)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body.message).toBeDefined()
        expect(res.body.message).toBe('missing_content')
        expect(res.body).toHaveProperty('data')
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()
        

    })

    
    

})

describe('delete post', ()=>{

    let lastInsertion
    beforeAll(async ()=>{

        await client.connect()
        
        const query = await client.db('instagram').collection('userPost').find({}).toArray()
        
        lastInsertion = query[query.length-1]._id.toString()
        console.log('this is last insertion', lastInsertion)
        
    }) 

    it('should delete post from db and images from aws', async()=>{
        const res = await request(app).delete('/userPost')
         .send(
             {
                postId : lastInsertion
                 //postId : '63039abd133b84990d237893'
             }
         )
         expect(res.statusCode).toEqual(200)
    }),
    it('should return status code 400 if postId is incorrect', async()=>{
        const wrongId = '0808ddkhkjh90'
        const res = await request(app).delete('/userPost')
       .send(
        {
            postId : wrongId
        }
        )

        expect(res.statusCode).toEqual(400)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()
        expect(res.body.data).toBe('BSONTypeError')
    })
    
})