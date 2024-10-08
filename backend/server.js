const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const { chats } = require('./data/data')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')



const connectDB = require("./config/db")
const notFoundRoute = require('./middleware/notFoundRoute')
connectDB();

const PORT = process.env.PORT || 5000;
const app = express()
app.use(express.json()); // tell the server to accept json data, otherwise many errors like jwt token error as well.

app.get('/', (req, res) => {
    res.send('API is running')
})

app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)

app.use(notFoundRoute)

app.listen(PORT, console.log(`server started on port ${PORT}`))