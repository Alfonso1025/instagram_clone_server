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
 *     summary: Retrieves all user from database.
 *      
 *     
 *     responses:
 *      200:
 *        description: All users in db are retrieved in an array of user objects. Each object contains the properties:id,name and profilePicture
 *      
 *      500:
 *        description: A mongo db error while quering all users from db. Or an AWS error while fetching the profile image
 */
module.exports = router 