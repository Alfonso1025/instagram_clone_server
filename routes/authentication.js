const {Router} = require('express')
const router = Router()
const controller = require('../controller/authentication')
const validateInput = require('../middleware/validateInput')


router.post('/registerUser',  validateInput, controller.registerUser)
/**
 * @openapi
 * '/authentication/registerUser':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Registers a new user and creates and accout for the new user. 
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - userName
 *              - email
 *              - password
 *            properties:
 *              userName:
 *                type: string
 *                
 *              email: 
 *                type: string
 *                
 *              password : 
 *                type : string
 *     responses:
 *      200:
 *        description: user inserted in database
 *      409:
 *        description: conflict the user already has an account
 *      500:
 *        description: Internal server error. Normally produced by a mongodb connection issue
 */
router.post('/loginUser', validateInput, controller.loginUser )

/**
 * @openapi
 * '/authentication/loginUser':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Finds an existing user in the db by email and validates the password. Over success, returns a token to the client
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              
 *              - email
 *              - password
 *            properties:
 *              
 *                
 *              email: 
 *                type: string
 *                
 *              password : 
 *                type : string
 *     responses:
 *      200:
 *        description: Success - User provided valid credentials. The account was found. A token was produced and returned to the client
 *      400:
 *        description: Bad request - The email provided by the user cannot be found in the db.
 *      401:
 *        description: Unauthorized - The password is invalid
 *      500:
 *        description: Internal server error - Typically caused by a mongodb connection issue. 
 */

module.exports = router