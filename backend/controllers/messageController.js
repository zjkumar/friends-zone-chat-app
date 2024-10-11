const expressAsyncHandler = require("express-async-handler");
const Message = require('../models/messageModel');
const Chat = require("../models/chatModel");
const User = require("../models/userModel");


const sendMessage = expressAsyncHandler(async(req, res) => {
    const {content, chatId} = req.body;

    if (!content || !chatId) {
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    try {
        var message = await Message.create(newMessage);

        
        message = await message.populate("sender", "name pic")

        message = await message.populate("chat")
        
        
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email"
        })

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })
        res.json(message);
    } 
    catch(err) {
        res.status(400)
        throw new Error(err.message)
    }
})


const allMessages = expressAsyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({chat: req.params.chatId}).populate("sender", "name pic email").populate("chat")
        res.status(200)
        res.json(messages)
    }catch(err){
        res.status(400)
        throw new Error('Unable to fetch messages for the chat')
    }
})

module.exports = {sendMessage, allMessages}