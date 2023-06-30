const {Router} = require('express')
const router = Router()
const controller = require('../controller/chat')

router.post('/createRoom', controller.createRoom)
/**
 * @openapi
 * /chat/createRoom:
 *   post:
 *     tags:
 *       - Chat
 *     summary: Create a new chat room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participants
 *             properties:
 *               participants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     userName:
 *                       type: string                   
 *     responses:
 *       200:
 *         description: New room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - new_room_created
 *                 data:
 *                   type: object
 *                 code:
 *                   type: number
 *                   enum:
 *                     - 200
 *       400:
 *         description: Bad request. Invalid request body or missing participants array.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - missing_participants
 *                 data:
 *                   type: object
 *                 code:
 *                   type: number
 *                   enum:
 *                     - 400
 *       500:
 *         description: Internal server error. MongoDB error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - mongodb_error
 *                 data:
 *                   type: object
 *                 code:
 *                   type: number
 *                   enum:
 *                     - 500
 */

router.get('/getRooms/:participantId', controller.getRooms)
/**
 * @openapi
 * /chat/getRooms/{participantId}:
 *   get:
 *     tags:
 *       - Chat
 *     summary: Get all chat rooms for a participant
 *     parameters:
 *       - in: path
 *         name: participantId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat rooms retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - found_all_rooms
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 code:
 *                   type: number
 *                   enum:
 *                     - 200
 *       400:
 *         description: Bad request. Missing participantId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - missing_participantId
 *                 data:
 *                   type: object
 *                 code:
 *                   type: number
 *                   enum:
 *                     - 400
 *       404:
 *         description: Bad request. The user is not a participant in any chat.Thus no chats were found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - user_has_no_chats
 *                 data:
 *                   type: object
 *                 code:
 *                   type: number
 *                   enum:
 *                     - 404
 *       500:
 *         description: Internal server error. MongoDB error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - mongodb_error
 *                 data:
 *                   type: object
 *                 code:
 *                   type: number
 *                   enum:
 *                     - 500
 */

router.get('openRoom/:roomId',controller.openRoom )
/**
 * @openapi
 * /chat/openRoom/{roomId}:
 *   get:
 *     tags:
 *       - Chat
 *     summary: Open a chat room
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat room found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - room_found
 *                 data:
 *                   type: object
 *                 code:
 *                   type: number
 *                   enum:
 *                     - 200
 *       400:
 *         description: Bad request. The request is missing roomId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - missing_roomId
 *                 data:
 *                   type: object
 *                 code:
 *                   type: number
 *                   enum:
 *                     - 400
 *       404:
 *         description: Resource not found. Could not find the room by roomId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - could_not_find_room
 *                 data:
 *                   type: object
 *                 code:
 *                   type: number
 *                   enum:
 *                     - 404
 *       500:
 *         description: Internal server error. MongoDB error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - mongodb_error
 *                 data:
 *                   type: object
 *                 code:
 *                   type: number
 *                   enum:
 *                     - 500
 */
router.post('/checkIfRoomExists', controller.checkIfRoomExists)
/**
 * @openapi
 * /chat/checkIfRoomExists:
 *   post:
 *     tags:
 *       - Chat
 *     summary: Check if a chat room exists between two participants
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - friendId
 *             properties:
 *               userId:
 *                 type: string
 *               friendId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room exists between the participants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - room_exist
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 code:
 *                   type: number
 *                   enum:
 *                     - 200
 *       400:
 *         description: Bad request. The request is missing the userId or the friendId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - missing_userId/missing_friendId
 *                 data:
 *                   type: object
 *                 code:
 *                   type: number
 *                   enum:
 *                     - 400
 *       404:
 *         description: Resource not found. There is no chat room between the two users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - no_room_found
 *                 data:
 *                   type: object
 *                 code:
 *                   type: number
 *                   enum:
 *                     - 404
 *       500:
 *         description: Internal server error. An error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   enum:
 *                     - an_error_occurred
 *                 data:
 *                   type: object
 *                 code:
 *                   type: number
 *                   enum:
 *                     - 500
 */

module.exports = router