import { Box, Heading, Stack, Text, Button, HStack } from '@chakra-ui/react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/instance';
import { toaster } from '../../components/ui/toaster';

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      
      if (location.state?.user) {
        setUser(location.state.user);
      } else {
        const response = await api.get(`/api/service/workers/${id}`);
        setUser(response.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных жильца:', error);
      toaster.create({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные жильца',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/worker/users');
  };

  const getFullName = () => {
    if (!user) return '—';
    const lastName = user.lastName || '';
    const firstName = user.firstName || '';
    const middleName = user.middleName || '';
    return `${lastName} ${firstName} ${middleName}`.trim() || user.email || '—';
  };

  const getAddress = () => {
    if (!user?.address) return '—';
    const parts = [];
    if (user.address.city) parts.push(`г. ${user.address.city}`);
    if (user.address.street) parts.push(`ул. ${user.address.street}`);
    if (user.address.house) parts.push(`д. ${user.address.house}`);
    if (user.address.flat) parts.push(`кв. ${user.address.flat}`);
    return parts.join(', ') || '—';
  };

  const getStatus = () => {
    if (!user) return '—';
    switch(user.role) {
      case 'User': return 'Активен';
      case 'Worker': return 'Сотрудник';
      case 'Admin': return 'Администратор';
      default: return 'Активен';
    }
  };

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Text>Загрузка...</Text>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={8} textAlign="center">
        <Text>Пользователь не найден</Text>
        <Button mt={4} onClick={handleBack} colorPalette="teal">
          Вернуться к списку
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={4}>
        Карточка жильца #{user.id}
      </Heading>
      
      <Stack spacing={3} bg="white" p={4} rounded="lg" shadow="sm">
        <HStack justify="space-between">
          <Text fontWeight="bold">Данные жильца</Text>
          <Button
            size="xs"
            variant="ghost"
            colorPalette="teal"
            onClick={handleBack}
          >
            Свернуть
          </Button>
        </HStack>

        <Text>
          <strong>ФИО:</strong> {getFullName()}
        </Text>
        <Text>
          <strong>Email:</strong> {user.email || '—'}
        </Text>
        <Text>
          <strong>Телефон:</strong> {user.phone || '—'}
        </Text>
        <Text>
          <strong>Адрес:</strong> {getAddress()}
        </Text>
        <Text>
          <strong>Статус:</strong> {getStatus()}
        </Text>
      </Stack>
    </Box>
  );
}