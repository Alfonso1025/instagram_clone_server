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
 *     summary: Save user info to database
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
 *      400:
 *        description: bad request
 *      500:
 *        description: server error
 */
router.post('/loginUser', validateInput, controller.loginUser )

/**
 * @openapi
 * '/authentication/loginUser':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Find user by email and produce a token 
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
 *        description: user provided valid credentials. User was found in db. A token was produced
 *      400:
 *        description: bad request
 *      401:
 *        description: user unauthorizedcd 
 *      500:
 *        description: server error
 */

module.exports = router