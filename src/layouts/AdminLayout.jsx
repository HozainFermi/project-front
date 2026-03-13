import { Outlet, NavLink } from 'react-router-dom';
import { Box, Flex, Heading, Stack, Link } from '@chakra-ui/react';

export default function AdminLayout() {
  return (
    <Flex minH="100vh" minW="100vw" bg="gray.50">
      <Box
        as="aside"
        w={{ base: '0', md: '260px' }}
        bg="white"
        borderRightWidth={{ base: 0, md: '1px' }}
        display={{ base: 'none', md: 'block' }}
        p={4}
      >
        <Heading size="md" mb={4}>
          Админ‑панель
        </Heading>
        <Stack spacing={2}>
          <Link as={NavLink} to="/admin/dashboard">
            Дашборд
          </Link>
          <Link as={NavLink} to="/admin/company/profile">
            Профиль компании
          </Link>
          <Link as={NavLink} to="/admin/workers">
            Сотрудники
          </Link>
          <Link as={NavLink} to="/admin/stats">
            Статистика
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
          <Heading size="md">ЖКХ портал — Администратор</Heading>
          {/* место под выбор организации, профиль, логаут */}
        </Box>

        <Box as="main" flex="1" p={6}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}

