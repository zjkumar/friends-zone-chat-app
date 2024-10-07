import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
const Signup = () => {
    const navigate = useNavigate()
    const toast = useToast()

    const [show, setShow] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [email, setEmail] = useState()
    const [name, setName] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [pic, setPic] = useState()

    const [loading, setLoading] = useState(false)

    const handleShowPassword = () => setShow(!show)

    const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

    const postDetails = async (pics) => {
        setLoading(true)
        if (pics === undefined) {
            toast({
                title: "PLease Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData()
            data.append("file", pics)
            data.append("upload_preset", "friendsZoneChatApp") // to which folder, file should be saved in the cloudinary.
            data.append("cloud_name", "n0ta10sear")

            const options = {
                method: "POST",
                body: data
            }

            const url = "https://api.cloudinary.com/v1_1/n0ta10sear/image/upload"

            try {
                const response = await fetch(url, options)
                const responseData = await response.json()
                setPic(responseData.url.toString())
                setLoading(false)
                console.log(responseData)

            }catch(err) {
                console.log(err)
                setLoading(false)
            }  
        }else {
            toast({
                title: "PLease Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        }

    }

    const submitHandler = async () => {
        setLoading(true)
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: "Please enter all fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false)
            return;
        }
        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoading(false)
            return;
        }

        try {
            const options = {
                headers : {
                    "Content-Type" : "application/json"
                }
            }
            const {data} = await axios.post("/api/user/register", {name, email, password, pic}, options)
            toast({
                title: "SignUp Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            localStorage.setItem('userInfo', JSON.stringify(data))
            setLoading(false)
            navigate('/')

        }catch(err) {
            toast({
                title: "Unable to Signup",
                status: "warning",
                description: err.response.data.message,
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            console.log(err)
            setLoading(false)
        }
    }

    return (
        <VStack spacing={6}>
            <FormControl id="firstName" isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter Your Name" onChange={(e) => setName(e.target.value)}  />
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>    
                    <Input placeholder="Enter New Password" onChange={(e) => setPassword(e.target.value)}  type={show ? "text" : "password"} />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="confirmPassword" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>    
                        <Input placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)}  type={showConfirmPassword ? "text" : "password"}/>
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" onClick={handleShowConfirmPassword}>
                                {showConfirmPassword ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                
            </FormControl>
            <FormControl id="pic">
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])} 
                />

            </FormControl>
            <Button
                colorScheme='blue'
                width="100%"
                style={{marginTop: 15}}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
)
}

export default Signup