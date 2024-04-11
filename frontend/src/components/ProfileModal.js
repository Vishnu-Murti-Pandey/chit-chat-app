import React from 'react'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Image,
    Text,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'

const ProfileModal = ({ user, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {
                children ? (
                    <span onClick={onOpen}>{children}</span>
                ) : (
                    <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
                )
            }
            <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent height='330px'>
                    <ModalHeader
                        fontSize='40px'
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent='center'
                    >{user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display='flex' flexDirection='column'
                        alignItems='center' justifyContent='space-between'
                    >
                        <Image
                            borderRadius='full'
                            boxSize='150px'
                            alt={user.name}
                            src={user.pic}
                        >
                        </Image>
                        <Text
                            fontSize={{ base: '28px', md: '30px' }}
                            fontFamily='Work sans'
                        >
                            Email : {user.email}
                        </Text>
                    </ModalBody>

                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal