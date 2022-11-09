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
 *     summary: Verify that the client sends an authentication token in the request header
 *     parameters:
 *     - in : header
 *       name: token
 *       schema: 
 *          type: string
 *     responses:
 *      200:
 *        description: authentication token was sent in header
 *      401:
 *        description: unauthorized
 *      
 *      
 *        
 */
router.get('/getUser', authorization, controller.getUser)
/**
 * @openapi
 * '/dashboard/getUser':
 *  get:
 *     tags:
 *     - Dashboard
 *     summary: Retrieve user from database
 *     parameters: 
 *     - in:  header
 *       name: token
 *       schema: 
 *         type: string 
 *     
 *     responses:
 *      200:
 *        description: user retrievd by id from database
 *      400:
 *        description: bad request
 *      401:
 *        description: user unauthorizedcd 
 *      500:
 *        description: server error
 */
router.post('/chooseProfilePic', upload.single('file') , controller.chooseProfilePicture)
router.get('/getProfilePosts/:userId', controller.getProfileUserPosts)
router.put('/followUser', controller.followUser)
router.get('/getFollowers/:userId', controller.getFollowers)
module.exports = router