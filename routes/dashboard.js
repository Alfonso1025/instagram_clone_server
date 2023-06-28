const {Router} = require('express')
const router = Router()
const controller = require('../controller/dashboard')
const authorization = require('../middleware/authorization')
const multer= require('multer')
const upload= multer({dest:'uploads'})


router.get('/verifyToken', authorization, controller.verifyToken)
/**
 * @openapi
 * '/dashboard/verifyToken':
 *  get:
 *     tags:
 *     - Dashboard
 *     summary: Verify that the client sends an authentication token in the request header. The presence of a valid token indicates that the user has logged in.
 *     parameters:
 *     - in: header
 *       name: token
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: Authentication token was sent in the header.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Authorized. Token present
 *                 data:
 *                   type: boolean
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 200
 *                   
 *       401:
 *         description: Unauthorized - the provided token is invalid or missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: boolean
 *                   enum:
 *                    - false
 *                 code:
 *                   type: number
 *                   enum:
 *                     - 401
 */

router.get('/getUser', authorization, controller.getUser)
/**
 * @openapi
 * '/dashboard/getUser':
 *  get:
 *     tags:
 *     - Dashboard
 *     summary: Retrieve the profile info of a user. The client has to send a token in the request header. The userId is read from such token
 *     parameters: 
 *     - in:  header
 *       name: token
 *       schema: 
 *         type: string 
 *     
 *     responses:
 *       200:
 *         description: Succesfully found and retieved user info. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                    - user_info_retrieved
 *                 data:
 *                   type: object
 * 
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 200
 *       404:
 *         description: The user info was not found on the database.The userId sent by the client does not match with any in the database. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                    - could_not_find_user
 *                 data:
 *                   type: string
 *                   enum:
 *                     - null
 * 
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 404
 *       401:
 *         description: Unauthorized - the provided token is invalid or missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: boolean
 *                   enum:
 *                    - false
 *                 code:
 *                   type: number
 *                   enum:
 *                     - 401
 *       500:
 *         description: Internal server error.  
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   
 *                 data:
 *                   type: object
 * 
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 500
 */
router.post('/chooseProfilePic', authorization,upload.single('file') , controller.chooseProfilePicture)
/**
 * @openapi
 * '/dashboard/chooseProfilePic':
 *   post:
 *     tags:
 *       - Dashboard
 *     summary: Choose a profile picture for the user.
 *     parameters:
 *     - in: header
 *       name: token
 *       schema:
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *        200:
 *         description: Succesfully found and retieved user info. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                    - user_info_retrieved
 *                 data:
 *                   type: object
 * 
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 200
 *        400:
 *         description: Bad request. No file was sent. Send an image file. Make sure to select an image file. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                    - no_file_sent
 *                 data:
 *                   type: object
 * 
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 400
 * 
 *        404:
 *         description: Not found. The document to be updated could not be found by the userId and thus it was not updated. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                    - could_not_store_key
 *                 data:
 *                   type: object
 * 
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 404
 
 *        500:
 *         description: Internal server error.  
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   
 *                 data:
 *                   type: object
 * 
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 500

 *         
 */

router.get('/downloadProfilePicture', authorization, controller.downloadProfilePicture)
/**
 * @openapi
 * '/dashboard/downloadProfilePicture':
 *   post:
 *     tags:
 *       - Dashboard
 *     summary: Retrives the user profile picture from s3 bucket.
 *     parameters:
 *     - in: header
 *       name: token
 *       schema:
 *         type: string
 *     responses:
 *        200:
 *         description: Succesfully retrieved profile picture from aws S3 bucket. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                    - user_info_retrieved
 *                 data:
 *                   type: object
 * 
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 200
 *        400:
 *         description: Bad request. No file was sent. Send an image file. Make sure to select an image file. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                    - no_file_sent
 *                 data:
 *                   type: object
 * 
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 400
 * 
 *        404:
 *         description: Not found. Two cases. 1.-The user info could not be found in the users collection in the db. Thus, the key to the user profile picture was not retrieved.To fix this error make sure to use a valid token of an authenticated user. 2.-The user info was found, however, the user does not have a profile picture yet. To fix this issue go to /chooseprofilepicture and upload a profile image.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                    - incorrect_id_no_user_found
 *                 data:
 *                   type: object
 * 
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 404
 
 *        500:
 *         description: Internal server error.  AWS or MongoDB error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   
 *                 data:
 *                   type: object
 * 
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 500

 *         
 */
router.get('/getProfilePosts/:userId', controller.getProfileUserPosts)
/**
 * @openapi
 * '/dashboard/getProfilePosts/{userId}':
 *   post:
 *     tags:
 *       - Dashboard
 *     summary: Retrives the posts made by the user.
 *     parameters:
 *     - in: path
 *       name: userId
 *       schema:
 *         type: string
 *     responses:
 *        200:
 *         description: Succesfully retrieved user posts from db. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                    - user_profile_pots_succesfully_retrieved
 *                 data:
 *                   type: object
 * 
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 200

 *        404:
 *         description: Not found. The user has not made any posts yet so there are no resources to retrieve
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                    - no_posts_found
 *                 data:
 *                   type: object
 * 
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 404
 
 *        500:
 *         description: Internal server error.  AWS or MongoDB error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   
 *                 data:
 *                   type: object
 * 
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 500

 *         
 */
router.put('/followUser', controller.followUser)
/**
 * @openapi
 * '/dashboard/followUser':
 *  post:
 *     tags:
 *     - Dashboard
 *     summary: It carries out two updates. One in the user´s field following adding an element object with properties userId and userName to the array. It also updates the the friend to be followed in the followers array field with an object with userId and userName
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - userId
 *              - userName
 *              - userToFollowId
 *              - userToFollowName
 *            properties:
 *               userId:
 *                type: string
 *               userName: 
 *                type: string
 *                
 *               userToFollowId : 
 *                type : string
 * 
 *               userToFollowName : 
 *                type : string
 *     responses:
 *      200:
 *         description: field following was updated in the user document and field followers was updated in the userToFollow document.
 *         content:
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
 *                 
 *      404:
 *         description: Not found. The user document or the userTobeFollowed document could not be found by id.Thus, the document not found was not updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                     - could_not_update_followers/could_not_update_following
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 404 
 *        
 *      500:
 *         description: Internal server error.
 *         content:
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
router.get('/getFollowers/:userId', controller.getFollowers)
/**
 * @openapi
 * '/dashboard/getProfilePosts/{userId}':
 *   post:
 *     tags:
 *       - Dashboard
 *     summary: Retrives the users that are following the logged user.
 *     parameters:
 *     - in: path
 *       name: userId
 *       schema:
 *         type: string
 *     responses:
 *        200:
 *         description: Succesfully retrieved the users that are following the logged user. 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                    - succesfully_retrieved_followers
 *                 data:
 *                   type: object
 * 
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 200

 *        404:
 *         description: Not found. The user has no followers yet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                    - user_has_no_followers
 *                 data:
 *                   type: object
 * 
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 404
 
 *        500:
 *         description: Internal server error. MongoDB error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   
 *                 data:
 *                   type: object
 * 
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 500

 *         
 */

module.exports = router