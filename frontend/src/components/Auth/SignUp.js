import React, { useState } from 'react'

import { Input, InputGroup, InputRightElement, Stack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { FormControl, FormLabel, } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const SignUp = () => {

    const navigate = useNavigate();

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmPassword] = useState();
    const [pic, setPic] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfiermPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const toast = useToast()

    const postFile = (file) => {
        setLoading(true);
        if (file === undefined) {
            toast({
                title: `Please Select an Image!`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }

        if (file.type === 'image/jpeg' || file.type === 'image/png') {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "chat-app");
            formData.append("cloud_name", "dovtabo9o");

            axios.post('https://api.cloudinary.com/v1_1/dovtabo9o/image/upload', formData)
                .then((res) => {
                    setPic(res.data.url.toString());
                    setLoading(false);
                }).catch((err) => {
                    console.log(err);
                    setLoading(false);
                })
        } else {
            toast({
                title: `Please Select an Image!`,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            });
            setLoading(false);
            return;
        }
    }

    const handleSignUp = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
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
        if (password !== confirmpassword) {
            toast({
                title: `Passwords do not match!`,
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

            const { data } = await axios.post('/api/user', { name, email, password }, config);
            toast({
                title: `Registration is successful!`,
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
            <FormControl id='name' isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter your name'
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id='email' isRequired>
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
            <FormControl id='confirmPassword' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={showConfiermPassword ? 'text' : 'password'}
                        placeholder='Confirm password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button height='1.75rem' size='sm' onClick={() => setShowConfirmPassword(!showConfiermPassword)}>
                            {showConfiermPassword ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>

                </InputGroup>
            </FormControl>

            <FormControl id='pic'>
                <FormLabel>Upload Your Picture</FormLabel>
                <Input
                    type='file'
                    padding={1.5}
                    accept='image/*'
                    onChange={(e) => postFile(e.target.files[0])}
                />
            </FormControl>

            <Button
                width='100%'
                colorScheme='blue'
                marginTop='15px'
                onClick={handleSignUp}
                isLoading={loading}
            >Sign Up
            </Button>
        </Stack >
    )
}

export default SignUp