import { Box, Button, MenuDivider, Text, Tooltip, useDisclosure } from '@chakra-ui/react';
import React, { useRef, useState } from 'react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Badge
} from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'
import { ChatState } from '../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from "react-router-dom";
import DrawerModal from './DrawerModal';
import { getSender } from '../config/ChatLogics';

const SideDrawer = () => {

    const { user, setSelectedChat, notification, setNotification } = ChatState();

    const navigate = useNavigate();

    const btnRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const logoutHandler = () => {
        localStorage.removeItem("UserInfo");
        navigate("/");
    };

    return (
        <Box width='100%' display='flex' padding='5px 10px' borderWidth='5px'
            justifyContent='space-between' alignItems='center' bg='white'
        >
            <Tooltip label='Search Users to chat' hasArrow placement='bottom-end'>
                <Button
                    variant='ghost'
                    display='flex'
                    gap='6px'
                    ref={btnRef}
                    onClick={onOpen}
                >
                    <i class='fas fa-search'></i>
                    <Text display={{ base: 'none', md: 'flex' }}>
                        Search User
                    </Text>
                </Button>

            </Tooltip>
            {
                isOpen && (
                    <DrawerModal
                        ref={btnRef}
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                    </DrawerModal>
                )
            }
            <Text fontSize='2xl' fontFamily='Work sans'>Chit-Chat</Text>
            <div display='flex' justifyContent='space-between'>
                <Menu>
                    <MenuButton p={1} >
                        <BellIcon fontSize='2xl' />
                        <Badge m={1} colorScheme='purple'>{notification.length}</Badge>
                    </MenuButton>
                    <MenuList pl={2}>
                        {!notification.length && "No New Messages"}
                        {
                            notification.map((notif) => (
                                <MenuItem key={notif._id} onClick={() => {
                                    setSelectedChat(notif.chat);
                                    setNotification(notification.filter((n) => n !== notif))
                                }}>
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))
                        }
                    </MenuList>
                </Menu>

                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
                        <Avatar size='sm' name={user.name} src={user.pic} />
                    </MenuButton>
                    <MenuList>
                        <ProfileModal user={user}>
                            <MenuItem>My Profile</MenuItem>
                        </ProfileModal>
                        <MenuDivider />
                        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </Box>
    )
}

export default SideDrawer;