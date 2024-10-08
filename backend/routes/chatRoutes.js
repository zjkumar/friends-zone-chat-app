const express = require("express")
const { authentication } = require("../middleware/authMiddleware")
const {removeUserFromGroup, accessChat, fetchChats, createGroupChat, renameGroup, addUserToGroup} = require("../controllers/chatController")
const router = express.Router()

router.route('/').post(authentication, accessChat)
router.route('/').get(authentication, fetchChats)
router.route('/group').post(authentication, createGroupChat)
router.route('/rename').put(authentication, renameGroup)
router.route('/addtogroup').put(authentication, addUserToGroup)
router.route('/removefromgroup').put(authentication, removeUserFromGroup)


module.exports = router