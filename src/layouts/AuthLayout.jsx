import { Outlet } from 'react-router-dom';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';

export default function AuthLayout() {
  return (
    <Flex minH="100vh" bg="gray.900" color="white">
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={{ base: 6, md: 12 }}
      >
        <Box w="100%" maxW="650px" bg="gray.800" rounded="xl" p={8} shadow="2xl">
          <Heading size="lg" mb={2}>
            Вход в ЖКХ портал
          </Heading>
          <Text mb={6} color="gray.300">
            Для жильцов, сотрудников и администраторов управляющей компании.
          </Text>
          <Outlet />
        </Box>
      </Box>

      {/* Правая часть под 3D‑сцену */}
      <Box
        flex="1"
        display={{ base: 'none', lg: 'block' }}
        position="relative"
        overflow="hidden"
      >
        <Text>
            hello
        </Text>
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-br, teal.500, blue.600, purple.600)"
          opacity={0.9}
        />
        {/* сюда потом можно будет встроить <Canvas> с 3D‑сценой */}
        <Box
          position="absolute"
          inset={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={16}
        >

          <Box textAlign="center">
            <Heading size="3xl" mb={6}>
              Дом, двор, город — в одном окне
            </Heading>
            <Text fontSize="lg" maxW="550px" mx="auto" color="whiteAlpha.900">
              Здесь можно передавать показания, смотреть новости дома и быстро
              общаться с управляющей компанией.
            </Text>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}

