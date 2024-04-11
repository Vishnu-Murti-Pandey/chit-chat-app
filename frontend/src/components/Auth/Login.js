import React, { useState } from 'react'

import { Input, InputGroup, InputRightElement, Stack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { FormControl, FormLabel, } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";


const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const toast = useToast()

    const handleLogin = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: `Please fill all the Details!`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const { data } = await axios.post('/api/user/login', { email, password }, config);
            toast({
                title: `Login is successful!`,
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });

            localStorage.setItem("UserInfo", JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
        } catch (error) {
            toast({
                title: `Some Error Occured!`,
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
        }

    }

    return (
        <Stack spacing='5px'>
            <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                    placeholder='Enter your email address'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Enter password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button height='1.75rem' size='sm' onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>

                </InputGroup>
            </FormControl>

            <Button
                width='100%'
                colorScheme='blue'
                marginTop='15px'
                isLoading={loading}
                onClick={handleLogin}
            >Login
            </Button>
            <Button
                width='100%'
                colorScheme='red'
                marginTop='15px'
                onClick={() => {
                    setEmail('guest@example.com')
                    setPassword('123456')
                }}
            >Get Guest User Credentials
            </Button>
        </Stack>
    )
}

export default Login