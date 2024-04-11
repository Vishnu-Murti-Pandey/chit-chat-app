import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import GroupChatModal from '../components/GroupChatModal'
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';

const MyChats = ({ fetchAgain }) => {

    const toast = useToast();
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

    const [loggedUser, setLoggedUser] = useState();

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };
                const { data } = await axios.get('/api/chat', config);
                setChats(data);
            } catch (error) {
                toast({
                    title: 'Error Occured!',
                    description: 'Failed to load chats',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-left'
                });
            }
        }

        setLoggedUser(JSON.parse(localStorage.getItem("UserInfo")));
        fetchChats();
    }, [fetchAgain]);


    return (
        <Box
            display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
            flexDirection='column'
            alignItems='center'
            padding={3}
            margin='10px'
            bg='white'
            width={{ base: '100%', md: '31%' }}
            borderRadius='lg'
            borderWidth='1px'
        >
            <Box
                paddingBottom={3}
                paddingX={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                display="flex"
                width="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display="flex"
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                padding={3}
                bg="#F8F8F8"
                width="100%"
                height="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {chats ? (
                    <Stack overflowY='scroll'>
                        {
                            chats.map((chat) => (
                                <Box
                                    onClick={() => setSelectedChat(chat)}
                                    cursor="pointer"
                                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}
                                    paddingX={3}
                                    paddingY={2}
                                    borderRadius="lg"
                                    key={chat._id}
                                >
                                    <Text>
                                        {!chat.isGroupChat
                                            ? getSender(loggedUser, chat.users)
                                            : chat.chatName}
                                    </Text>
                                    {chat.latestMessage && (
                                        <Text fontSize="xs">
                                            <b>{chat.latestMessage.sender.name} : </b>
                                            {chat.latestMessage.content.length > 50
                                                ? chat.latestMessage.content.substring(0, 51) + "..."
                                                : chat.latestMessage.content}
                                        </Text>
                                    )}
                                </Box>
                            ))
                        }
                    </Stack>
                ) : (
                    <ChatLoading />
                )
                }
            </Box>
        </Box>
    )
}

export default MyChats;