import React, { useEffect, useRef, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from './config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import Lottie from 'react-lottie'
import './styles.css'
import ScrollableChat from './miscellaneous/ScrollableChat'
import animationData from "../animations/typing.json"
import io from 'socket.io-client'


const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

const ENDPOINT = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
    const {user, selectedChat, setSelectedChat, notification, setNotification} = ChatState()

    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const typingRef = useRef(false)
    const typingTimeoutRef = useRef(null); // Ref to store the timeout id

    const toast = useToast()


    // this useEffect should be at the top, so socket gets initialized first.
    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true))
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false))
    }, [])



    const fetchMessages = async() => {
        if (!selectedChat) {
            return
        }
        try {
            const config = {
                headers : {
                    "Authorization" : `Bearer ${user.token}`
                }
            }
    
            setLoading(true)
            const {data} = await axios.get(`/api/message/${selectedChat._id}`, config)

            // console.log(data)
            setMessages(data)
            setLoading(false)

            // joining the room and sending the room id
            socket.emit("join chat", selectedChat._id)
        }
        catch(err) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type" : "application/json",
                        "Authorization": `Bearer ${user.token}`
                    }
                }

                
                setNewMessage("");
                const {data} = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)

                // console.log(data)
                socket.emit("new message", data)
                setMessages([...messages, data])

            } 
            catch(err) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
            }
        }
    }

    const typingHandler = async (e) => {
        setNewMessage(e.target.value);
        // console.log(typing, "status of typing before function return");
      
        if (!socketConnected) return;
      
        // Clear any existing timeout before setting a new one
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      
        // Emit stop typing and reset typing state if already typing
        if (!typingRef.current) {
        //   console.log("inside if - starting typing");
          setTyping(true); // Set typing state
          typingRef.current = true; // Ref updated immediately
          socket.emit("typing", selectedChat._id); // Emit typing event
        }
      
        // Set a new timeout to stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
        //   console.log("setTimeout triggered");
          socket.emit("stop typing", selectedChat._id);
          setTyping(false); // Set typing state to false
          typingRef.current = false; // Ref updated to reflect typing stopped
        //   console.log("stop typing emitted");
        }, 2000); // Timeout of 2 seconds
      };

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat
    
        // eslint-disable-next-line
      }, [selectedChat]);

    
    

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            // if none of the chat is selected or if the selected chat is different from the newMessageReceivedChat,
            // we are not going 2 display message, we giv notification
            if ( !selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification])
                    setFetchAgain(!fetchAgain)
                }
            }else{
                setMessages([...messages, newMessageReceived])
            }
        })
    })

    // console.log(notification, "----------------")

  return (
    <>
        {selectedChat ? (
            <>
                <Text
                    fontSize={{ base: "28px", md: "30px" }}
                    pb={3}
                    px={2}
                    w="100%"
                    fontFamily="Roboto"
                    display="flex"
                    justifyContent={{ base: "space-between" }}
                    alignItems="center"
                >
                    
                    <IconButton
                        display={{ base: "flex", md: "none" }}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat("")}
                    />
                    {!selectedChat.isGroupChat ? (
                        <>
                            {getSender(user, selectedChat.users)}
                            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                        </>
                    ) : (
                        <>
                            {selectedChat.chatName.toUpperCase()}
                            <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                        </>
                    )}
                </Text>
                <Box
                    display="flex"
                    flexDirection={"column"}
                    justifyContent={"flex-end"}
                    p={3}
                    backgroundColor="#E8E8E8"
                    width="100%"
                    height="100%"
                    borderRadius={"lg"}
                    overflowY={"hidden"}
                >
                    {
                        loading ? 
                        <Spinner 
                            size="xl"
                            w={20}
                            h={20}
                            alignSelf="center"
                            margin="auto"
                        /> : 
                        
                        <div className="messages">
                            <ScrollableChat messages={messages} />
                        </div>
                    }

                    <FormControl onKeyDown={sendMessage} isRequired marginTop={3}>
                        {
                            isTyping ? 
                            
                            <Lottie 
                                width={70}
                                options={defaultOptions}
                                
                            />
                            : 
                            
                            <></>
                        
                        }
                        <Input
                            variant="filled"
                            bg="#E0E0E0"
                            placeholder="Enter a message.."
                            value={newMessage}
                            onChange={typingHandler}
                            borderRadius={"25px"}
                        />

                    </FormControl>
                </Box>
            </>
        ) : (
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} h="100%">
                <Text fontSize={"3xl"} pb={3} fontFamily={"Roboto"} >
                    Click on a user to start chatting
                </Text>
            </Box>
        )}
    </>
  )
}

export default SingleChat

