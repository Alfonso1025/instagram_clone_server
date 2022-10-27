const {Router} = require('express')
const router = Router()
const controller = require('../controller/chat')

router.post('/createRoom', controller.createRoom)
router.get('/getRooms', controller.getRooms)
router.get('openRoom/:roomId',controller.openRoom )

module.exports = router