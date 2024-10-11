const { sendMessage, allMessages }  = require("../controllers/messageController")
const { authentication } =  require("../middleware/authMiddleware")

const express = require("express")
const expressAsyncHandler = require("express-async-handler")
const router = express.Router()

// for sending the message
router.route("/").post(authentication, sendMessage)

// for fetching all the messages for one single chat
router.route("/:chatId").get(authentication, allMessages)




module.exports =  router