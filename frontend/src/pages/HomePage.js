import React, { useEffect, useState } from 'react'
import { Box, Container, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Auth/Login'
import SignUp from '../components/Auth/SignUp'
import { useNavigate } from "react-router-dom";


const HomePage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("UserInfo"));

        if (user) {
            navigate("/chats")
        };
    }, [navigate]);

    return (
        <Container maxW='xl' centerContent>
            <Box
                display='flex'
                justifyContent='center'
                padding='3'
                bgColor='white'
                width='100%'
                margin='40px 0 15px 0'
                borderRadius='lg'
                borderWidth='1px'
            >
                <Text fontSize='4xl' fontFamily='work sans' color='black'>Chit-Chat</Text>
            </Box>
            <Box
                width='100%'
                padding='3'
                bgColor='white'
                borderRadius='lg'
                borderWidth='1px'
            >
                <Tabs isFitted variant='soft-rounded' colorScheme='blue'>
                    <TabList>
                        <Tab fontFamily='work sans' color='black'>Login</Tab>
                        <Tab fontFamily='work sans' color='black'>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage