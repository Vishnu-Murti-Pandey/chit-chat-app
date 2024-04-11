import { useContext, useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/SideDrawer'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'

const ChatPage = () => {

    const { user } = ChatState();
    console.log({ user });
    const [fetchAgain, setFetchAgain] = useState();

    return (
        <div style={{ width: '100%' }}>
            {
                user && <SideDrawer />
            }
            <Box display='flex' justifyContent='space-between' width='100%' h='91.5vh'>
                {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}

export default ChatPage;