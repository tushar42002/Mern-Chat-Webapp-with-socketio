import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

    const [show, setShow] = useState(false);

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoding] = useState(false);
    const toast = useToast();
    const history = useNavigate();

    const handleClick = () => setShow(!show);

    const postDetails = (pics) => {
        setLoding(true)

        if (pics === undefined) {
            toast({
                title: "Please Select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "first-chat-app");
            data.append("cloud_name", "tusharrao");
            fetch("https://api.cloudinary.com/v1_1/tusharrao/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    setLoding(false);
                })
                .catch((err) => {
                    setLoding(false);
                });
        } else {
            toast({
                title: "Please Select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            })
            setLoding(false);
            return;
        }

    };

    const submitHandler = async () => {
        setLoding(true);
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoding(false);
            return;
        }
        if (password !== confirmpassword) {
            toast({
                title: "Password Do NOt Match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post("/api/user",
                { name, email, password, pic },
                config
            );

            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            localStorage.setItem("userInfo", JSON.stringify(data));

            setLoding(false);
            history("/chats");

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoding(false);
        }



    };

    return <VStack spacing='5px' >
        <FormControl id='first-name' isRequired >
            <FormLabel>Name</FormLabel>
            <Input
                placeholder='Enter Your Name'
                onChange={(e) => setName(e.target.value)}
            />
        </FormControl>
        <FormControl id='email' isRequired >
            <FormLabel>Email</FormLabel>
            <Input
                placeholder='Enter Your Email'
                onChange={(e) => setEmail(e.target.value)}
            />
        </FormControl>

        <FormControl id='password' isRequired >
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input
                    type={show ? 'text' : 'password'}
                    placeholder='Enter Your Password'
                    onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem" >
                    <Button h="1.75rem" size="sm" onClick={handleClick} >
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='password' isRequired >
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input
                    type={show ? 'text' : 'password'}
                    placeholder='Confirm Password'
                    onChange={(e) => setConfirmpassword(e.target.value)}
                />
                <InputRightElement width="4.5rem" >
                    <Button h="1.75rem" size="sm" onClick={handleClick} >
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id='pic' isRequired >
            <FormLabel>Upload your Picture</FormLabel>
            <Input
                type='file'
                p={1.5}
                accept='image/*'
                onChange={(e) => postDetails(e.target.files[0])}
            />
        </FormControl>

        <Button
            colorScheme='blue'
            width='100%'
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={loading}
        >
            Sign Up
        </Button>


    </VStack>


}

export default Signup