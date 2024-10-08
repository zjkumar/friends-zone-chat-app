const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = expressAsyncHandler(async(req, res) => {
    const {userId} = req.body;

    if (!userId) {
        console.log('UserId param not sent with request')
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false, 
        $and: [
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId}}}
        ]
    }).populate("users", "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email pic"
    })

    if (isChat.length > 0) {
        res.send(isChat[0])
    }else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
          };

        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({_id: createdChat._id}).populate("users", "-password")
            res.status(200).send(fullChat)
        }catch(error){
            res.status(400)
            throw new Error(error.message)
        }
    }
})


const fetchChats = expressAsyncHandler(async (req, res) => {
    try {
        // iterates through all the documents in the Chat collection
        // and fetches the chats where the user is part of that chat.
        const result = await Chat.find({users: { $elemMatch : { $eq: req.user._id }}})
        .populate("users", "-password")
        .populate("latestMessage")
        .populate("groupAdmin")
        .sort({updatedAt: -1})
        
        res.status(200).send(result)
    }catch(err) {
        throw new Error(err.message)
    }
})


const createGroupChat = expressAsyncHandler(async(req, res) => {
    // if the body doesn't have list of users or if it doesn't have a name for the group
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({message: "Please fill all the details"})
    }

    let users = JSON.parse(req.body.users);

    // group should be more than 1 user
    if (users.length < 2) {
        return res.status(400).send({message: "A group must have more than 1 user"})
    }

    // current logged in user is the one who is sending request to create the group
    // so he is also part of the users list of the group
    // so we add him to the list

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })

        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users", "-password")
        .populate("latestMessage")
        .populate("groupAdmin", "-password")
        
        res.status(200).send(fullGroupChat)

    }catch(err) {
        res.status(400).send({message: err.message})
    }
})

module.exports = {accessChat, fetchChats, createGroupChat}