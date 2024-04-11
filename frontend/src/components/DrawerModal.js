import React, { useState } from 'react'
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Input,
    Button,
    Box,
    Spinner,
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from './userAvatar/UserListItem';
import { ChatState } from '../Context/ChatProvider';


const DrawerModal = ({ ref, isOpen, onClose }) => {

    const { user, setSelectedChat, chats, setChats } = ChatState();

    const toast = useToast();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please Enter something to search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);

        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: 'Failed to load search results',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            });
            setLoading(false);
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.post('/api/chat', { userId }, config);

            // if we find the chat already in the chat list just appned the chat inside of it
            if (!chats.find((chat) => chat._id === data._id)) {
                setChats([data, ...chats]);
            }

            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: 'Failed to fetch the chat',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            });
            setLoadingChat(false);
        }
    }

    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={ref}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>Search Users</DrawerHeader>
                    <DrawerCloseButton />
                    <DrawerBody>
                        <Box display='flex' pb={2}>
                            <Input
                                mr={2}
                                value={search}
                                placeholder='Search by name or email...'
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button
                                onClick={handleSearch}
                            >
                                Go
                            </Button>
                        </Box>
                        {
                            loading ? (
                                <ChatLoading />
                            ) : (
                                searchResult?.map((user) => (
                                    <UserListItem
                                        user={user}
                                        key={user._id}
                                        handleFunction={() => accessChat(user._id)}
                                    />
                                ))
                            )
                        }
                        {loadingChat && <Spinner ml='auto' display='flex' />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default DrawerModal