import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Box, Flex, Heading, HStack, VStack, Text, Avatar } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { LuUsers, LuUserPlus, LuSettings, LuLogOut } from 'react-icons/lu';
import { FaHome } from 'react-icons/fa';
import { toaster } from '../components/ui/toaster';
import api from '../api/instance';

export default function OwnerLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toaster.create({
      title: 'Выход',
      description: 'Вы вышли из системы',
      type: 'success',
      duration: 3000,
    });
    navigate('/auth/login');
  };

  const menuItems = [
    { path: '/owner/workers', label: 'Сотрудники', icon: LuUsers },
    { path: '/owner/create-worker', label: 'Создать сотрудника', icon: LuUserPlus },
    { path: '/owner/settings', label: 'Настройки', icon: LuSettings },
  ];

  const getFullName = () => {
    if (!user) return 'Владелец';
    const lastName = user.lastName || '';
    const firstName = user.firstName || '';
    return `${lastName} ${firstName}`.trim() || 'Владелец';
  };

  const getInitials = () => {
    if (!user) return 'В';
    const lastName = user.lastName || '';
    const firstName = user.firstName || '';
    return `${lastName.charAt(0)}${firstName.charAt(0)}`.toUpperCase() || 'В';
  };

  if (loading) {
    return (
      <Flex minH="100vh" bg="gray.50" align="center" justify="center">
        <Text>Загрузка...</Text>
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" minW="100vw" bg="gray.50">
      <Box
        w="260px"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        display={{ base: 'none', md: 'flex' }}
        flexDirection="column"
        position="fixed"
        h="100vh"
        shadow="sm"
      >
        <Box p={5} borderBottomWidth="1px" borderColor="gray.100">
          <HStack gap={3}>
            <Box
              w="36px"
              h="36px"
              bg="teal.500"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FaHome size={18} color="white" />
            </Box>
            <VStack align="start" gap={0}>
              <Heading size="sm" color="teal.700">ЖКХ Портал</Heading>
              <Text fontSize="xs" color="gray.500">Владелец</Text>
            </VStack>
          </HStack>
        </Box>

        <Box p={4} borderBottomWidth="1px" borderColor="gray.100">
          <HStack gap={3}>
            <Avatar.Root size="sm">
              <Avatar.Fallback name={getFullName()}>
                {getInitials()}
              </Avatar.Fallback>
            </Avatar.Root>
            <VStack align="start" gap={0}>
              <Text fontSize="sm" fontWeight="medium">{getFullName()}</Text>
              <Text fontSize="xs" color="gray.500">Владелец компании</Text>
            </VStack>
          </HStack>
        </Box>

        <VStack as="nav" align="stretch" flex="1" p={3} gap={1}>
          {menuItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              style={({ isActive }) => ({
                textDecoration: 'none',
                width: '100%'
              })}
            >
              {({ isActive }) => (
                <Flex
                  align="center"
                  justify="space-between"
                  px={3}
                  py={2.5}
                  borderRadius="md"
                  bg={isActive ? 'teal.50' : 'transparent'}
                  color={isActive ? 'teal.700' : 'gray.700'}
                  fontWeight={isActive ? 'medium' : 'normal'}
                  borderLeft={isActive ? '3px solid' : 'none'}
                  borderColor="teal.500"
                  _hover={{
                    bg: isActive ? 'teal.50' : 'gray.100',
                  }}
                  transition="all 0.2s"
                >
                  <HStack gap={3}>
                    <Box as={item.icon} size={18} />
                    <Text fontSize="sm">{item.label}</Text>
                  </HStack>
                </Flex>
              )}
            </NavLink>
          ))}
        </VStack>

        <Box p={3} borderTopWidth="1px" borderColor="gray.100">
          <Flex
            align="center"
            px={3}
            py={2.5}
            borderRadius="md"
            color="gray.600"
            _hover={{ bg: 'red.50', color: 'red.600', cursor: 'pointer' }}
            transition="all 0.2s"
            onClick={handleLogout}
          >
            <HStack gap={3}>
              <LuLogOut size={18} />
              <Text fontSize="sm">Выйти</Text>
            </HStack>
          </Flex>
        </Box>
      </Box>

      <Box
        flex="1"
        ml={{ base: 0, md: '260px' }}
        display="flex"
        flexDirection="column"
        minH="100vh"
      >
        <Box
          as="header"
          h="64px"
          px={6}
          bg="white"
          borderBottomWidth="1px"
          borderColor="gray.200"
          position="sticky"
          top={0}
          zIndex={10}
        >
          <Flex h="full" align="center" justify="space-between">
            <Heading size="md" color="gray.800">
              Панель управления
            </Heading>
            <Avatar.Root size="sm">
              <Avatar.Fallback name={getFullName()}>
                {getInitials()}
              </Avatar.Fallback>
            </Avatar.Root>
          </Flex>
        </Box>

        <Box as="main" flex="1" p={6}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}