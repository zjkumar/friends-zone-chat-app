import { Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const Login = () => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const submitHandler = () => {}

  return (
    <VStack spacing={6}>
        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" placeholder='Enter Your Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button
            colorScheme='blue'
            width="100%"
            onClick={submitHandler}
            style={{marginTop: 15}}
        >
            Login
        </Button>
    </VStack>
  )
}

export default Login