import { Outlet, NavLink, useNavigate } from 'react-router-dom';  // ← добавил useNavigate
import { Box, Flex, Heading, HStack, IconButton, VStack, Text, Avatar, Badge } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { 
  LuUser,
  LuGauge,
  LuClipboardList,
  LuBellRing,
  LuLogOut,
  LuSettings,
  LuBuilding,
  LuCalendar
} from 'react-icons/lu';
import { 
  FaHome  
} from 'react-icons/fa';
import api from '../api/instance';

export default function MainLayout() {
  const navigate = useNavigate();  // ← добавил
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    { path: '/', label: 'Главная', icon: FaHome },
    { path: '/profile', label: 'Профиль', icon: LuUser },
    { path: '/meters', label: 'Счётчики', icon: LuGauge },
    { path: '/requests', label: 'Заявки', icon: LuClipboardList },
    { path: '/news', label: 'Новости', icon: LuBuilding, badge: 2 },
   // { path: '/payments', label: 'Платежи', icon: LuCalendar }, //платежи скрыты
    { path: '/settings', label: 'Настройки', icon: LuSettings },
  ];

  const getFullName = () => {
    if (!user) return 'Жилец';
    const lastName = user.lastName || '';
    const firstName = user.firstName || '';
    const fullName = `${lastName} ${firstName}`.trim();
    return fullName || 'Жилец';
  };

  const getInitials = () => {
    if (!user) return 'Ж';
    const lastName = user.lastName || '';
    const firstName = user.firstName || '';
    const initials = `${lastName.charAt(0)}${firstName.charAt(0)}`.toUpperCase();
    return initials || 'Ж';
  };

  const getApartment = () => {
    if (user?.address?.flat) {
      return `кв. ${user.address.flat}`;
    }
    return '';
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
              <Text fontSize="xs" color="gray.500">Жилец</Text>
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
              <Text fontSize="xs" color="gray.500">{getApartment() || 'Жилец'}</Text>
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
                  {item.badge && (
                    <Badge
                      bg="teal.500"
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
              Личный кабинет
            </Heading>
            
            <HStack gap={3}>
              <Box position="relative">
                <IconButton
                  variant="ghost"
                  size="sm"
                  fontSize="18px"
                  color="gray.600"
                  _hover={{ bg: 'gray.100' }}
                  onClick={() => navigate('/news')}  // ← добавил onClick
                >
                  <LuBellRing />
                </IconButton>
                <Badge
                  position="absolute"
                  top="-1"
                  right="-1"
                  bg="red.500"
                  color="white"
                  borderRadius="full"
                  px={1}
                  py={0.5}
                  fontSize="2xs"
                  transform="translate(25%, -25%)"
                >
                  3
                </Badge>
              </Box>

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

        {/* Футер */}
        <Box
          as="footer"
          h="56px"
          px={6}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bg="white"
          borderTopWidth="1px"
          borderColor="gray.200"
          fontSize="sm"
          color="gray.600"
        >
          <span>© {new Date().getFullYear()} ЖКХ Портал</span>
          <HStack gap={4}>
            <Text _hover={{ color: 'teal.600', cursor: 'pointer' }}>Помощь</Text>
            <Text _hover={{ color: 'teal.600', cursor: 'pointer' }}>support@example.com</Text>
          </HStack>
        </Box>
      </Box>
    </Flex>
  );
}