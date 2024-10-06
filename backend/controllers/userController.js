const asyncHandler = require('express-async-handler')
const User = require('../models/userModel');
const router = require('../routes/userRoutes');
const generateToken = require('../config/generateToken');
const expressAsyncHandler = require('express-async-handler');


const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password, pic} = req.body

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the Details");
    }

    const userExists = await User.findOne({email})

    if (userExists) {
        res.status(400)
        throw new Error("Email already exists")
    }

    const user = await User.create({
        name, 
        email, 
        password, 
        pic
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error("Failed to create a the user")
    }
    
})

const authUser = expressAsyncHandler(async(req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        res.status(401)
        throw new Error("Provide all the details")
    }

    const user = await User.findOne({email})

    if (user && await (user.matchPassword(password))){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error("Unauthorized")
    }

})


module.exports = {registerUser, authUser}