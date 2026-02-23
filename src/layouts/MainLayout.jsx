import { Outlet } from 'react-router-dom';
import { Box, Flex, Heading } from '@chakra-ui/react';

export default function MainLayout() {
  return (
    <Flex minH="100vh" bg="gray.50">
      <Box
        as="aside"
        w={{ base: '0', md: '260px' }}
        bg="white"
        borderRightWidth={{ base: 0, md: '1px' }}
        display={{ base: 'none', md: 'block' }}
        p={4}
      >
        <Heading size="md" mb={4}>
          Личный кабинет
        </Heading>
        {/* сюда потом добавишь меню навигации пользователя */}
      </Box>

      <Box flex="1" display="flex" flexDirection="column">
        <Box
          as="header"
          h="64px"
          px={6}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bg="white"
          borderBottomWidth="1px"
        >
          <Heading size="md">ЖКХ портал — Жилец</Heading>
          {/* тут будет профиль, логАут, переключалка темы и т.п. */}
        </Box>

        <Box as="main" flex="1" p={6}>
          <Outlet />
        </Box>

        <Box
          as="footer"
          h="56px"
          px={6}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bg="gray.100"
          borderTopWidth="1px"
          fontSize="sm"
          color="gray.600"
        >
          <span>© {new Date().getFullYear()} ЖКХ портал</span>
          <span>Поддержка: support@example.com</span>
        </Box>
      </Box>
    </Flex>
  );
}