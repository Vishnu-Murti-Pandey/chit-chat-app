import React, { useEffect, useRef, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Text, Spinner, IconButton, FormControl, Input, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from './ProfileModal';
import { getSender, getSenderFull } from '../config/ChatLogics';
import UpdateGroupChatModal from '../components/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";


const ENDPOINT = process.env.PORT === 5000 ? "http://localhost:5000" : "https://talk-a-tive.herokuapp.com" // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const inputNewMessageRef = useRef();
    const toast = useToast();

    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const fetchMessages = async () => {
        if (!selectedChat) {
            return;
        };

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };


    const sendMessage = async (e) => {
        const newMessage = inputNewMessageRef.current.value;
        if (e.key === 'Enter' && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                setLoading(true);
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    }
                };

                const { data } = await axios.post('api/message',
                    {
                        content: newMessage,
                        chatId: selectedChat._id
                    },
                    config
                );

                inputNewMessageRef.current.value = "";
                socket.emit("new message", data);

                setMessages([...messages, data]);
                setLoading(false);
            } catch (error) {
                toast({
                    title: 'Error Occured!',
                    description: 'Failed to sned the Message',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom-left'
                });
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

    }, []);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (!selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    const typingHandler = () => {
        // const newMessage = inputNewMessageRef.current.value;

        if (!socketConnected) {
            return
        }

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }

    return (
        <>
            {
                selectedChat ?
                    (<>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            pb={3}
                            px={2}
                            width="100%"
                            fontFamily="Work sans"
                            display="flex"
                            justifyContent={{ base: "space-between" }}
                            alignItems="center"
                        >
                            <IconButton
                                display={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setSelectedChat("")}
                            />
                            {
                                messages &&
                                (!selectedChat.isGroupChat ? (
                                    <>
                                        {getSender(user, selectedChat.users)}
                                        <ProfileModal
                                            user={getSenderFull(user, selectedChat.users)}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {selectedChat.chatName.toUpperCase()}
                                        <UpdateGroupChatModal
                                            fetchMessages={fetchMessages}
                                            fetchAgain={fetchAgain}
                                            setFetchAgain={setFetchAgain}
                                        />
                                    </>
                                ))}
                        </Text>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            width="100%"
                            height="100%"
                            borderRadius="lg"
                            overflowY="hidden"
                        >
                            {
                                loading ? (
                                    <Spinner
                                        size='lg'
                                        width={20}
                                        height={20}
                                        alignSelf='center'
                                        margin='auto'
                                    />
                                ) : (
                                    <div style={{
                                        display: 'flex', flexDirection: 'column',
                                        overflowY: 'scroll', scrollbarWidth: 'none'
                                    }}>
                                        <ScrollableChat messages={messages} />
                                    </div>
                                )
                            }

                            <FormControl
                                onKeyDown={sendMessage}
                                id="first-name"
                                isRequired
                                mt={3}
                            >
                                {istyping ? (
                                    <div>
                                        <Lottie
                                            options={defaultOptions}
                                            width={70}
                                            style={{ marginBottom: 15, marginLeft: 0 }}
                                        />
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <Input
                                    variant="filled"
                                    bg="#E0E0E0"
                                    placeholder="Enter a message.."
                                    onChange={typingHandler}
                                    ref={inputNewMessageRef}
                                />
                            </FormControl>
                        </Box>
                    </>
                    ) : (
                        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                                Click on a user to start chatting
                            </Text>
                        </Box>
                    )
            }
        </>
    )
}

export default SingleChat