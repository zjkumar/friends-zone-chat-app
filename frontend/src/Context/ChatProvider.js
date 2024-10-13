import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


const ChatContext = createContext()

const ChatProvider = ({children}) => {

    const [user, setUser] = useState()
    const [chats, setChats] = useState()
    const [selectedChat, setSelectedChat] = useState();
    const navigate = useNavigate()
    const [notification, setNotification] = useState([])

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))

        setUser(userInfo)
        if (!userInfo) {
            navigate("/")
        }
    }, [navigate])

    return <ChatContext.Provider value={{user, setUser, chats, setChats, selectedChat, setSelectedChat, notification, setNotification}}>{children}</ChatContext.Provider>
}

export const ChatState = () => useContext(ChatContext)

export default ChatProvider