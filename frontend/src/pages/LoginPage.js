import React from 'react'

import { Container, Box, Text, Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
// import "./styles.css"
const LoginPage = () => {
  return (
    <Container maxW="xl" color="black" centerContent  >
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        background={"white"} 
        borderRadius="lg"
        borderWidth="2px" 
        width="100%"
        m="40px 0 15px 0"
        fontSize={"x-large"}
      >
        <Text fontFamily={"Roboto"}>Friends Zone</Text>
      </Box>
      <Box
        bg="white"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="2px"
      >
        <Tabs variant='soft-rounded' >
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>

      </Box>

    </Container>
  )
}

export default LoginPage