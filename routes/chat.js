const {Router} = require('express')
const router = Router()
const controller = require('../controller/chat')

router.post('/createRoom', controller.createRoom)
router.get('/getRooms/:participantId', controller.getRooms)
router.get('openRoom/:roomId',controller.openRoom )
router.post('/checkIfRoomExists', controller.checkIfRoomExists)

module.exports = router