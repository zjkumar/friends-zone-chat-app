import { Button, FormControl, FormLabel, Input, useToast, VStack } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    
    const navigate = useNavigate()
    const toast = useToast()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [loading, setLoading] = useState(false)
    
    const submitHandler = async () => {
        setLoading(true)
        if (!email || !password) {
            toast({
                title: "Please fill all fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom", 
            })
            return;
        }
        try {
            const config = {
                headers:{
                    "Content-Type": "application/json"
                }
            }
            const {data} = await axios.post("/api/user/login", {email, password}, config)
            localStorage.setItem('userInfo', JSON.stringify(data))
            console.log(data)
            setLoading(false)
            navigate('/chatpage')
        }catch(err) {
            toast({
                description: err.response.data.message,
                title: "Unable to login",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
        }
    }

  return (
    <VStack spacing={6}>
        <FormControl id="loginEmail" isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder='Enter Your Email'  onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl id="loginPassword" isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" placeholder='Enter Your Password' onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button
            colorScheme='blue'
            width="100%"
            onClick={submitHandler}
            style={{marginTop: 15}}
            isLoading={loading}
        >
            Login
        </Button>
    </VStack>
  )
}

export default Login