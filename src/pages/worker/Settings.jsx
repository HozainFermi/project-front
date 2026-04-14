import { Box, Heading, VStack, HStack, Text, Button, Card, Separator } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaSignOutAlt, FaTrashAlt } from 'react-icons/fa';
import { toaster } from '../../components/ui/toaster';
import api from '../../api/instance';

export default function WorkerSettings() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Выход
  const handleLogout = () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      toaster.create({
        title: 'Выход',
        description: 'Вы вышли из системы',
        type: 'success',
        duration: 3000,
      });
      
      navigate('/auth/login');
    } catch (error) {
      toaster.create({
        title: 'Ошибка',
        description: 'Не удалось выйти',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Удаление аккаунта
  const handleDelete = async () => {
    const confirmed = window.confirm('Вы уверены? Это действие необратимо!');
    if (!confirmed) return;
    
    setIsDeleting(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user?.id) {
        throw new Error('Не удалось получить ID пользователя');
      }
      
      await api.delete(`/profile/${user.id}`);
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      toaster.create({
        title: 'Аккаунт удалён',
        description: 'Ваш аккаунт успешно удалён',
        type: 'success',
        duration: 3000,
      });
      
      navigate('/auth/register');
    } catch (error) {
      console.error('Ошибка удаления:', error);
      toaster.create({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось удалить аккаунт',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box maxW="500px" mx="auto">
      <Heading size="lg" mb={6}>
        Настройки
      </Heading>

      <Card.Root>
        <Card.Body>
          <VStack align="stretch" gap={4}>
            {/* Выход */}
            <HStack justify="space-between">
              <Box>
                <Text fontWeight="medium">Выход из системы</Text>
                <Text fontSize="sm" color="gray.500">Завершить текущую сессию</Text>
              </Box>
              <Button
                colorPalette="teal"
                variant="outline"
                leftIcon={<FaSignOutAlt />}
                onClick={handleLogout}
                isLoading={isLoggingOut}
                loadingText="Выход..."
              >
                Выйти
              </Button>
            </HStack>

            <Separator />

            {/* Удаление аккаунта */}
            <HStack justify="space-between">
              <Box>
                <Text fontWeight="medium" color="red.600">Удалить аккаунт</Text>
                <Text fontSize="sm" color="gray.500">Все данные будут удалены безвозвратно</Text>
              </Box>
              <Button
                colorPalette="red"
                variant="outline"
                leftIcon={<FaTrashAlt />}
                onClick={handleDelete}
                isLoading={isDeleting}
                loadingText="Удаление..."
              >
                Удалить
              </Button>
            </HStack>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}