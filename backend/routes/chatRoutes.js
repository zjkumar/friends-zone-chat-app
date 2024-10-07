const express = require("express")
const { authentication } = require("../middleware/authMiddleware")
const {accessChat} = require("../controllers/chatController")
const router = express.Router()

router.route('/').post(authentication, accessChat)
// router.route('/').get(authentication, fetchChats)
// router.route('/group').post(authentication, createGroupChat)
// router.route('/rename').put(authentication, renameGroup)
// router.route('/removefromgroup').put(authentication, removeUserFromGroup)
// router.route('./addtogroup').put(authentication, addUserToGroup)

module.exports = router