import { Outlet, NavLink } from 'react-router-dom';
import { Box, Flex, Heading, HStack, IconButton, VStack, Text, Avatar, Badge } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { 
  LuLayoutDashboard, 
  LuClipboardList, 
  LuGauge, 
  LuUsers, 
  LuBellRing, 
  LuLogOut,
  LuSettings,
  LuMessageSquare
} from 'react-icons/lu';
import { 
  FaHome
} from 'react-icons/fa';
import api from '../api/instance';

export default function WorkerLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const unreadCount = 3; // TODO: заменить на реальное количество

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { path: '/worker/dashboard', label: 'Дашборд', icon: LuLayoutDashboard },
    { path: '/worker/requests', label: 'Заявки', icon: LuClipboardList },
    { path: '/worker/meter-readings', label: 'Показания счётчиков', icon: LuGauge },
    { path: '/worker/users', label: 'Жильцы', icon: LuUsers },
    { path: '/worker/messages', label: 'Сообщения', icon: LuMessageSquare, badge: unreadCount },
  ];

  const getFullName = () => {
    if (!user) return 'Сотрудник';
    const lastName = user.lastName || '';
    const firstName = user.firstName || '';
    const fullName = `${lastName} ${firstName}`.trim();
    return fullName || 'Сотрудник';
  };

  const getInitials = () => {
    if (!user) return 'С';
    const lastName = user.lastName || '';
    const firstName = user.firstName || '';
    const initials = `${lastName.charAt(0)}${firstName.charAt(0)}`.toUpperCase();
    return initials || 'С';
  };

  const getRole = () => {
    if (!user) return 'Сотрудник';
    switch(user.role) {
      case 'Worker': return 'Сотрудник';
      case 'Admin': return 'Администратор';
      case 'CompanyOwner': return 'Владелец компании';
      default: return 'Сотрудник';
    }
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
      {/* Левая панель */}
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
        {/* Логотип и название */}
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
              <Text fontSize="xs" color="gray.500">{getRole()}</Text>
            </VStack>
          </HStack>
        </Box>

        {/* Профиль пользователя */}
        <Box p={4} borderBottomWidth="1px" borderColor="gray.100">
          <HStack gap={3}>
            <Avatar.Root size="sm">
              <Avatar.Fallback name={getFullName()}>
                {getInitials()}
              </Avatar.Fallback>
            </Avatar.Root>
            <VStack align="start" gap={0}>
              <Text fontSize="sm" fontWeight="medium">{getFullName()}</Text>
              <Text fontSize="xs" color="gray.500">{getRole()}</Text>
            </VStack>
          </HStack>
        </Box>

        {/* Навигационное меню */}
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
                  {item.badge > 0 && (
                    <Badge
                      bg="red.500"
                      color="white"
                      borderRadius="full"
                      px={1.5}
                      py={0.5}
                      fontSize="2xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Flex>
              )}
            </NavLink>
          ))}

          {/* Настройки */}
          <NavLink 
            to="/worker/settings"
            style={{ textDecoration: 'none', width: '100%' }}
          >
            {({ isActive }) => (
              <Flex
                align="center"
                px={3}
                py={2.5}
                borderRadius="md"
                bg={isActive ? 'teal.50' : 'transparent'}
                color={isActive ? 'teal.700' : 'gray.700'}
                _hover={{ bg: isActive ? 'teal.50' : 'gray.100' }}
              >
                <HStack gap={3}>
                  <LuSettings size={18} />
                  <Text fontSize="sm">Настройки</Text>
                </HStack>
              </Flex>
            )}
          </NavLink>
        </VStack>

        {/* Кнопка выхода */}
        <Box p={3} borderTopWidth="1px" borderColor="gray.100">
          <Flex
            align="center"
            px={3}
            py={2.5}
            borderRadius="md"
            color="gray.600"
            _hover={{ bg: 'red.50', color: 'red.600', cursor: 'pointer' }}
            transition="all 0.2s"
          >
            <HStack gap={3}>
              <LuLogOut size={18} />
              <Text fontSize="sm">Выйти</Text>
            </HStack>
          </Flex>
        </Box>
      </Box>

      {/* Основной контент */}
      <Box
        flex="1"
        ml={{ base: 0, md: '260px' }}
        display="flex"
        flexDirection="column"
        minH="100vh"
      >
        {/* Хедер */}
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
              Рабочая панель
            </Heading>
            
            <HStack gap={3}>
              {/* Колокольчик удалён */}

              <Avatar.Root size="sm">
                <Avatar.Fallback name={getFullName()}>
                  {getInitials()}
                </Avatar.Fallback>
              </Avatar.Root>
            </HStack>
          </Flex>
        </Box>

        {/* Контент */}
        <Box as="main" flex="1" p={6}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}