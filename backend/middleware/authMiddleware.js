const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

const authentication = asyncHandler(async (req, res, next) => {
    
    console.log('provide token')
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try {
            token = req.headers.authorization.split(" ")[1];

            const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`)

            // assigning the user using the decoded token
            req.user = await User.findById(decodedToken.id).select("password")
            
            next()
        }catch(err) {
            res.status(401);
            throw new Error("Not Authorized, token failed!")
        }
    }

    if (!token) {

        res.status(401);
        throw new Error("Not Authorized, Provide Token!")
    }
})


module.exports = {authentication}