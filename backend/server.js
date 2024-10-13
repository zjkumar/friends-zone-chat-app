const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const { chats } = require('./data/data')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')



const connectDB = require("./config/db")
const notFoundRoute = require('./middleware/notFoundRoute')
connectDB();

const PORT = process.env.PORT || 5000;
const app = express()
app.use(express.json()); // tell the server to accept json data, otherwise many errors like jwt token error as well.

app.get('/', (req, res) => {
    res.send('API is running')
})

// route for user login and signup
app.use("/api/user", userRoutes)

// route for chat functionality
app.use("/api/chat", chatRoutes)

// route for messaging functionality
app.use("/api/message", messageRoutes)


app.use(notFoundRoute)

const server = app.listen(PORT, console.log(`server started on port ${PORT}`))

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors:{
        origin: "http://localhost:3000"
    }
})


io.on("connection", (socket) => {
    console.log("Connected to socket.io")

    // Every time user opens the app, he should be connected to his own personal socket
    
    // creating a new socket where frontend sends userData and this is particular for that one user.
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    })

    // joining a chat, roomId is send from frontend
    socket.on('join chat', (room) => {
        socket.join(room)
        console.log("User Joined Room: " + room + " " )
    })

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat
        if (!chat.users) return "chat.users not defined"

        // if we are in a group and we are sending a message
        // we want to emit the message to all other participants in the group except for the user who sends it.
        
        chat.users.forEach(user => {
            if (user._id !== newMessageReceived.sender._id) {
                // we will be sending the newMessageReceived object to the user.
                // we are targeting specific location or room and emiting 
                socket.in(user._id).emit('message received', newMessageReceived)
            }
        });
    })

    // socket for typing
    socket.on("typing", (room) => socket.in(room).emit("typing"))

    socket.on("stop typing", (room) => socket.in(room).emit("stop typing") )
})