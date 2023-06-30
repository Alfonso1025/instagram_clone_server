const {Router} = require('express')
const router = Router()
const controller = require('../controller/userSearch')

router.get('/allUsers', controller.allUsers)
/**
 * @openapi
 * '/userSearch/allUsers':
 *  get:
 *     tags:
 *     - UserSearch
 *     summary: Retrieves all user from database For each user a request s made to s3 bucket to retrieve the profile picture of each user.
 *      
 *     
 *     responses:
 *      200:
 *        description: All users in db are retrieved in an array of user objects. Each object contains the properties:id,name and profilePicture
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                     - all_users_retrieved
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 200
 *      404:
 *        description: Not found. No users were found
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                     - could_not_find_users
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 404
 *      
 *      500:
 *        description: Internal server error. A mongo db error while quering all users from db. Or an AWS error while fetching the profile image
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
module.exports = router 