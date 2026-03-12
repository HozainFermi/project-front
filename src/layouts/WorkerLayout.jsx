import { Outlet, NavLink } from 'react-router-dom';
import { Box, Flex, Heading, Stack, Link } from '@chakra-ui/react';

export default function WorkerLayout() {
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
          Панель сотрудника
        </Heading>
        <Stack spacing={3}>
          <Link as={NavLink} to="/worker/dashboard">
            Дашборд
          </Link>
          <Link as={NavLink} to="/worker/requests">
            Заявки
          </Link>
          <Link as={NavLink} to="/worker/meter-readings">
            Показания счётчиков
          </Link>
          <Link as={NavLink} to="/worker/users">
            Жильцы
          </Link>
        </Stack>
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
          <Heading size="md">ЖКХ портал — Сотрудник</Heading>
          {/* сюда потом добавишь переключение дома/объекта, профиль, логаут */}
        </Box>

        <Box as="main" flex="1" p={6}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}

