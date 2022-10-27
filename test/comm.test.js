const app = require('../server')
const request = require('supertest')
const client = require('../services/db')
const ObjectId=require('mongodb').ObjectId

describe('save comment to database', ()=>{
    let commentId = ''
    const wrongPostId = '86868gugygsrsr'
    const unexistentPostId = '62fbb25d2c1c756bb7936d99'

    afterAll(async()=>{
        
        const id = new ObjectId(commentId)
        await client.connect()
        const deletedComment = await client.db('instagram').collection('comments').findOneAndDelete(
            { _id : id }
        )
        await client.close()
        
    })
    it('should return status code 200 and save comment to db', async ()=>{
        
        
        const res = await request(app)
        .post('/comments')
        .send(
            {
                relatedPost : '62fbb18f2c1c756bb7936d97',
                commentByUser : '62d192479117e94e6321610c',
                userName :'Theo',
                content : 'test comment'

            }
        )
        expect(res.statusCode).toEqual(200)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()
        expect(res.body.data.insertedId).toBeDefined()
        commentId = res.body.data.insertedId
        console.log('this is the insertedId', commentId)
    }),

    it('should return status code 400 if the related postId is unpromperly constructed', async()=>{
        const res = await request(app)
        .post('/comments')
        .send(
            {
                relatedPost : wrongPostId,
                commentByUser : '62d192479117e94e6321610c',
                userName :'Theo',
                content : 'test comment'

            }
        )
        expect(res.statusCode).toEqual(400)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()
        


        
    }),
    it('should return status code 400 if the post doesnt exist in the db',async ()=>{
        const res = await request(app)
        .post('/comments')
        .send(
            {
                relatedPost : unexistentPostId,
                commentByUser : '62d192479117e94e6321610c',
                userName :'Theo',
                content : 'test comment'
            }
        )
        expect(res.statusCode).toEqual(400)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.message).toBe('relatedPost_not_found')
        expect(res.body.data).toBeDefined()
    })

})
describe('update comment in database', ()=>{
    let wrongCommentId =  '6319771eeba5f992166936'

    afterAll(async ()=>{
        await client.connect()
        await client.db('instagram').collection('comments').updateOne(
            {_id : new ObjectId('6319771eeba5f992166936ad') }, 
            {$set : {commentContent: 'modificado de bolon pimpon'}}
        )
        await client.close()
    })

    it('should update the contentString with new content in db', async()=>{
        const res = await request(app)
        .put('/comments/updateComment')
        .send(
            {
                commentId : '6319771eeba5f992166936ad',
                content : 'test updated comment'

            }
        )
        expect(res.statusCode).toEqual(200)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()
        expect(res.body.data.modifiedCount).toEqual(1)
        
    }, 8000),
    it('should return status code 400 if the commentId is unpromperly constructed', async()=>{
        const res = await request(app)
        .put('/comments/updateComment')
        .send(
            {
                commentId : wrongCommentId,
                content : 'update comment'

            }
        )
        expect(res.statusCode).toEqual(400)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()
        


        
    })
})

describe('delete comment from db', ()=>{
   let commentId = ''
   const wrongCommentId = 'rytry1w183970s'
   const unexistentCommentId = '63197b33e6917ab6c1c6f51a'
    beforeAll(async ()=>{
        await client.connect()
        const createdComment = await client.db('instagram').collection('comments').insertOne(
           {  relatedPost : '62fbb18f2c1c756bb7936d97',
              commentByUser : '62d192479117e94e6321610c',
              userName :'Theo',
              content : 'test comment to be deleted'
          }
        )
       commentId = createdComment.insertedId
       console.log('commentId en before all', commentId)
    })
    it('should delete comment from db and return status code 200', async()=>{
        const res = await request(app)
        .delete('/comments')
        .send(
            {
                commentId
            }
        )
        expect(res.statusCode).toEqual(200)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()
        expect(res.body.data.value._id).toBeDefined()
    }),
    it('should return status code 400 if commentId is unproperly constructed', async()=>{
        const res = await request(app)
        .delete('/comments')
        .send(
                {
                    commentId : wrongCommentId
                
                }
        ) 
        expect(res.statusCode).toEqual(400)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()

    }),
    it('should return status code 400 if comment can not be found with commentId', async()=>{
        const res = await request(app)
        .delete('/comments')
        .send(
            {
                commentId : unexistentCommentId
            }
        )
        expect(res.statusCode).toEqual(400)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()
        expect(res.body.data.value).toBe(null)


    })
})

describe('add a like by updating the field likes in db collection', ()=>{

    const commentId = '6319771eeba5f992166936ad'
    const wrongCommentId = '6319771eeba5f992166936'
    const unexistentCommentId = '63197b33e6917ab6c1c6f51a'

     afterAll(async()=>{
        await client.connect()
         await    client.db('instagram').collection('comments').updateOne(
                {_id : new ObjectId(commentId)}, {$pull : {likes:{likedBy :'62d192479117e94e6321610c' }}}
            )
        
        await client.close()
    }) 
    /* it('should add a like object in db document', async()=> {
        const res = await request(app)
        .put('/comments/like')
        .send(
            {
                commentId,
                userId : '62d192479117e94e6321610c',
                userName : 'Morales'
            }
        )
        expect(res.statusCode).toEqual(200)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()
        expect(res.body.data.modifiedCount).toEqual(1)
    }), */
    /* it('should return status code 400 if commentId is unproperly constructed', async()=>{

        const res = await request(app)
        .put('/comments/like')
        .send(
            {
                commentId : wrongCommentId,
                userId : '62d192479117e94e6321610c',
                userName : 'Morales'
            }
        )
        expect(res.statusCode).toEqual(400)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()
    }), */
    it('should return status code 400 if comment can not be found with the commentId', async()=>{
        const res = await request(app)
        .put('/comments/like')
        .send(
            {
                commentId : '63197b33e6917ab6c1c6f51a',
                 userId : '62d192479117e94e6321610c',
                userName : 'Morales'
            }
        )
        expect(res.statusCode).toEqual(400)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()
        expect(res.body.data.modifiedCount).toEqual(0)
    })
})

 describe('eliminate like object from document in Likes collection', ()=>{
    const commentId = '631221f7fd4b9226c49440ed'
    const userId = '62d192479117e94e6321610c'
    const userName = 'Morales'

    beforeAll(async()=>{
        await client.connect()

        const newLike = await client.db('instagram').collection('comments').updateOne(
            {_id : new ObjectId(commentId)}, {$addToSet : { likes : {likedBy : userId, userName}} }
        )
        
        console.log('this is the newLike',newLike)
    })
    it('should return status code 200 if like object is removed from document in likes collection',async()=>{
        const res = await request(app)
        .put('/comments/unlike')
        .send(
            {
                commentId,
                userId
            }
        )
        expect(res.statusCode).toEqual(200)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()
        expect(res.body.data.modifiedCount).toEqual(1)

    })
}) 
describe('add a reply object to the array of replies nested in a comment document', ()=>{
    const commentId = '6319771eeba5f992166936ad'
    const wrongCommentId = '6319771eeba5f9921'

    afterAll(async()=>{
        await client.connect()
        const id = new ObjectId(commentId)
        console.log('delete reply for this comment : ', id)
       const deletedReply =  await client.db('instagram').collection('comments').updateOne(
            {_id : id}, {$pull : {replies:{contentReply :'aa_reply' }}}
            )
        
        console.log('this is delted reply', deletedReply)
    })

    it('should add reply to comment document', async()=>{
        const res = await request(app)
        .put('/comments/addReply')
        .send(
            {
                commentId,
                content : 'aa_reply',
                userId : '62d191d5b8b8a2e30bcf8f82',
                userName: 'Theo',
            }
        )
        expect(res.statusCode).toEqual(200)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()
        expect(res.body.data.modifiedCount).toEqual(1)
        
    }),
    it('should return 400 if the commentId is wrongly structured', async()=>{
        const res = await request(app)
        .put('/comments/addReply')
        .send(
            {
                wrongCommentId,
                content : 'test_reply_with_wrong_id',
                userId : '62d191d5b8b8a2e30bcf8f82',
                userName: 'Theo',
            }
        )
        expect(res.statusCode).toEqual(400)
        expect(res.headers['content-type']).toContain('json')
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('data')
        expect(res.body.message).toBeDefined()
        expect(typeof res.body.message).toBe('string')
        expect(res.body.data).toBeDefined()

    })
})