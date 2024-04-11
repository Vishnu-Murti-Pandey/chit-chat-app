import React, { useRef, useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    FormControl,
    Box
} from '@chakra-ui/react'
import { useToast, useDisclosure } from '@chakra-ui/react'
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import UserListItem from './userAvatar/UserListItem';
import UserBadgeItem from './userAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {

    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const inputSearchRef = useRef();

    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    const handleSearch = async () => {
        const query = inputSearchRef.current.value;
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get(`/api/user?search=${query}`, config);
            setLoading(false);
            setSearchResults(data);
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: 'Failed to load Search Results',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            });
            setLoading(false);
        }
    }

    const handleSumbit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                `/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );
            setChats([data, ...chats]);
            onClose();
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } catch (error) {
            toast({
                title: "Failed to Create the Chat!",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    }

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((selUser) => selUser._id !== delUser._id));
    }

    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize='35px'
                        fontFamily='Work Sans'
                        display='flex'
                        justifyContent='center'
                    >
                        Create Group Chats
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                    >
                        <FormControl>
                            <Input
                                placeholder='Chat Name' mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add users eg: John, Vishnu, Jane' mb={1}
                                onChange={handleSearch}
                                ref={inputSearchRef}
                            />
                        </FormControl>

                        <Box width="100%" display="flex" flexWrap="wrap">
                            {
                                selectedUsers.map((user) => (
                                    <UserBadgeItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleDelete(user)}
                                    />
                                ))
                            }
                        </Box>
                        {
                            loading ? <div>loading...</div> : (
                                searchResults.slice(0, 4).map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleGroup(user)}
                                    />
                                ))
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSumbit}>
                            Create Chat
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal