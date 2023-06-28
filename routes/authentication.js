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
 *     summary: Registers a new user and creates and accout for the new user.Adding the userId and userName of of the friend to be followed. It also updates the field  
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
 *         description: User account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                     - new user inserted
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 200
 *      
 *      400:
 *         description: "Bad request. Two posibilities 1.- Missing credentials. Make sure to include a string email and password in the request. 2.- Invalid email format. An example of a valid email format is jean@gmail.com"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                    - missing credentials
 *                    - invalid email
 *                 data:
 *                   type: string
 *                   enum: 
 *                     - null
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                   - 400
 *                 
 *      409:
 *         description: Conflict- The user already has an account.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                     - existing_user
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 409 
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
 *         description: Succesful login. A jason web token was produced and sent to the client.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                    - user found and token produced
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 200
 *      400:
 *         description: "Bad request. Two posibilities 1.- Missing credentials. Make sure to include a string email and password in the request. 2.- Invalid email format. An example of a valid email format is jean@gmail.com"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                    - missing credentials
 *                    - invalid email
 *                 data:
 *                   type: string
 *                   enum: 
 *                     - null
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                   - 400
 *            
 *      401:
 *         description: Bad request. The email provided cannot be found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum: 
 *                    - user_not_found
 *                 data:
 *                   type: string
 *                   enum: 
 *                     - null
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 401
 *        
 *      500:
 *         description: Internal server error - Typically caused by a mongodb connection issue.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 
 *                 code:
 *                   type: number
 *                   enum:
 *                    - 500 
 */

module.exports = router