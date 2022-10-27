const {Router} = require('express')
const router = Router()
const controller = require('../controller/userPost')
const Multer = require('multer')
const { updatePost } = require('../controller/userPost')
const multer =  Multer({dest:'uploads'})



router.post('/multiple', multer.array('multiInputFile'), controller.multiPost)
/**
 * @openapi
 * '/userPost/multiple':
 *  post:
 *     tags:
 *     - createPost
 *     summary: saves contentString to db and uploads multimedia to aws
 *     requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *           schema:
 *            type: object
 *            
 *            properties:
 *              
 *              date:
 *               type: string  
 *              userId: 
 *                type: string
 *                
 *              contentString : 
 *                type : string
 *              multiInputFile:
 *                 type: array
 *                 items:
 *                  type: string
 *                  format: binary
 *     responses:
 *      200:
 *        description: The conntentString was saved to db and multimedia content was uploaded to aws.
 *      400:
 *        description: bad request
 *       
 *      500:
 *        description: server error
 */
router.get('/getPostsFromFollowingUsers/:userId', controller.getPostsFromFollowingUsers)
/**
 * @openapi
 * '/userPost/getPostsFromFollowingUsers/{userId}':
 *  get:
 *     tags:
 *     - get fee
 *     summary: retrives posts made by users followed by logged in user
 *     parameters:
 *     - in : path
 *       name: userId
 *       schema: 
 *          type: string
 *     responses:
 *      200:
 *        description: success retriving posts
 *      401:
 *        description: unauthorized
 *      
 *      
 *        
 */
router.put('/', controller.updatePost)
/**
 * @openapi
 * '/userPost':
 *  put:
 *     tags:
 *     - updatePost
 *     summary: Edits the content string in a post
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              
 *              - postId
 *              - contentToUpdate
 *            properties:
 *              
 *                
 *              postId: 
 *                type: string
 *                
 *              contentToUpdate : 
 *                type : string
 *     responses:
 *      200:
 *        description: The content string of the post was updated.
 *      400:
 *        description: bad request
 *       
 *      500:
 *        description: server error
 */
router.delete('/', controller.deletePost)
/**
 * @openapi
 * '/userPost':
 *  delete:
 *     tags:
 *     - delete
 *     summary: deletes a post from db and related objects from aws bucket
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              
 *              - postId
 *             
 *            properties:
 *              
 *                
 *              postId: 
 *                type: string
 *                
 *             
 *     responses:
 *      200:
 *        description: The post was deleted
 *      400:
 *        description: bad request
 *       
 *      500:
 *        description: server error
 */

router.get('/testFindLast', controller.findLast)


module.exports = router