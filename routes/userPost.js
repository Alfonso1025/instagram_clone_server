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
 *     - UserPost
 *     summary: The user post a content string and multiple images. The content string is stored in the database. the images are uploaded to s3 bucket. The keys to the images, produced by s3 bucket are stored in the database.
 *     requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *           schema:
 *            type: object
 *            required:
 *              - date
 *              - contentString
 *              - userId
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
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                     - followers_and_following_updated
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 200
 *      
 *      400:
 *         description: Bad request due to the request missing one of the following elements An image file, date or userId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                     - missing_files/missig_required_field
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 400
 * 
 *       
 *      500:
 *        description: Internal server error. Mongo db or aws s3 bucket error
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                    - mongodb_error
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 500
 
 */
router.get('/getPostsFromFollowingUsers/:userId', controller.getPostsFromFollowingUsers)
/**
 * @openapi
 * '/userPost/getPostsFromFollowingUsers/{userId}':
 *  get:
 *     tags:
 *     - UserPost
 *     summary: retrives posts made by users followed by the logged in user
 *     parameters:
 *     - in : path
 *       name: userId
 *       schema: 
 *          type: string
 *     responses:
 *      200:
 *        description: success in retrieving posts of users followed by the logged in user.
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                     - retrieved_post_from_users_followed_by_user_userEmail
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 200
 *      404:
 *        description: Not found. The user was not found/The user does not follow anyone/No posts where found
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                     - user_not_found/user_is_not_following_anyone/no_posts_found
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 404
 *      
 *      500:
 *        description: Internal server error. Mongo db or aws s3 bucket error
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                    - mongodb_error
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 500     
 *        
 */
router.put('/', controller.updatePost)
/**
 * @openapi
 * '/userPost':
 *  put:
 *     tags:
 *     - UserPost
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
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                     - succesfully_updated
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 200
 *      400:
 *        description: bad request. The request is missing either the postId or the content string
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                     - missing_postId/missing_content
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 400
 *      404:
 *        description: Not found. The post to update was not found and thus was not updated
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                     - document_to_update_not_found
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 404
 *             
 *      500:
 *        description: server error
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                    - mongodb_error
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 500     
 *        
 */
router.delete('/', controller.deletePost)
/**
 * @openapi
 * '/userPost':
 *  delete:
 *     tags:
 *     - UserPost
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
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                     - succesfully_deleted
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 200
 *      400:
 *        description: bad request. The request is missing the postId
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                     - missing_postId
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 400
 *      404:
 *        description: Not found. The post to delete was not found and thus was not updated
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                     - could_not_delete_post
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 404
 *                   
 *      500:
 *        description: Internal server error
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                    - mongodb_error
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 500   
 * 
 */

router.put('/testFindLast', controller.findLast)
router.put('/addUserName', controller.addUserName)


module.exports = router