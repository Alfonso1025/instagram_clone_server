const {Router} = require('express')
const router = Router()
const controller = require('../controller/like')


router.put('/addLike', controller.addLike)
router.put('/unLike', controller.unLike)

module.exports = router