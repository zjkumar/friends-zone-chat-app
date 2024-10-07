import React, { useEffect, useState } from 'react'
import axios from 'axios'
const ChatPage = () => {
  // const [chats, setChats] = useState([])
  // const fetchChats = async () => {
  //   const {data} = await axios.get('/api/chat')
  //   console.log(data)
  //   setChats(data)
  // }

  // useEffect(() => {
  //   fetchChats()
  // }, [])

  return (
    <div>
      {/* {chats && chats.map(eachChat => <div key={eachChat._id}>{eachChat.chatName}</div> )} */}
      chats page
    </div>
  )
}

export default ChatPage