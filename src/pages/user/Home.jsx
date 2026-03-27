import { Box, Heading, SimpleGrid, Stat, Button, HStack, VStack, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/instance';
import * as Buttons from "../../components/ui/buttons";

export default function Home() {
  const [dashboardData, setDashboardData] = useState({
    lastMeterReading: null,
    openRequests: 0,
    userName: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Получаем данные пользователя из профиля
      let userName = 'жилец';
      try {
        const profileResponse = await api.get('/users/profile');
        const user = profileResponse.data;
        userName = `${user.lastName} ${user.firstName}`.trim() || 'жилец';
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      }
      
      // 2. Получаем заявки пользователя
      let openRequestsCount = 0;
      try {
        const requestsResponse = await api.get('/users/requests');
        const requests = requestsResponse.data || [];
        // Считаем открытые заявки (не Completed и не Rejected)
        openRequestsCount = requests.filter(
          req => req.status !== 'Completed' && req.status !== 'Rejected'
        ).length;
      } catch (error) {
        console.error('Ошибка загрузки заявок:', error);
      }
      
      // 3. Показания счётчиков (пока нет эндпоинта, оставляем мок)
      // TODO: когда появится GET /users/meters, добавить
      const lastMeterReading = null;
      
      setDashboardData({
        lastMeterReading,
        openRequests: openRequestsCount,
        userName
      });
      
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Text>Загрузка...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg" color="black" mb={6}>
        Добро пожаловать, {dashboardData.userName}!
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} mb={8}>
        {/* Показания (мок — нет эндпоинта) */}
        <Stat.Root bg="white" p={4} rounded="lg" shadow="sm">
          <Stat.Label>Последние показания</Stat.Label>
          <Stat.ValueText color="gray.700">
            Не переданы
          </Stat.ValueText>
          <Stat.HelpText>срочно передайте показания</Stat.HelpText>
          <Buttons.DangerButton 
            as={RouterLink} 
            to="/meters" 
            size="sm" 
            color="white"
            colorPalette="red" 
            mt={2}
          >
            Передать показания
          </Buttons.DangerButton>
        </Stat.Root>
        
        {/* Открытые заявки — реальные данные */}
        <Stat.Root bg="white" p={4} rounded="lg" shadow="sm">
          <Stat.Label>Открытые заявки</Stat.Label>
          <Stat.ValueText color="gray.700">{dashboardData.openRequests}</Stat.ValueText>
          <Stat.HelpText>
            {dashboardData.openRequests === 0 
              ? 'все заявки закрыты' 
              : `требуют внимания`}
          </Stat.HelpText>
          <Button 
            as={RouterLink} 
            to="/requests" 
            size="sm" 
            colorPalette="teal"
            variant="outline" 
            mt={2}
          >
            Управлять заявками
          </Button>
        </Stat.Root>
        
        {/* Третий блок временно скрыт (был баланс) */}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
        <Box bg="white" p={4} rounded="lg" shadow="sm">
          <Heading size="md" mb={4} color="black">Последние новости</Heading>
          <VStack align="stretch" gap={3}>
            <Box p={3} bg="gray.50" rounded="md">
              <Text fontWeight="bold" color="black">Плановое отключение воды</Text>
              <Text fontSize="sm" color="gray.600">05.02.2026 с 10:00 до 16:00</Text>
            </Box>
            <Box p={3} bg="gray.50" rounded="md">
              <Text fontWeight="bold" color="black">Собрание жильцов</Text>
              <Text fontSize="sm" color="gray.600">10.02.2026 в 19:00 в актовом зале</Text>
            </Box>
            <Button as={RouterLink} to="/news" size="sm" variant="ghost">
              Все новости →
            </Button>
          </VStack>
        </Box>

        <Box bg="white" p={4} rounded="lg" shadow="sm">
          <Heading size="md" mb={4} color="black">Быстрые действия</Heading>
          <SimpleGrid columns={2} gap={3}>
            <Button as={RouterLink} to="/meters" h="60px" colorPalette="teal" variant="outline">
              Передать показания
            </Button>
            <Button as={RouterLink} to="/requests/new" h="60px" colorPalette="teal" variant="outline">
              Создать заявку
            </Button>
            <Button as={RouterLink} to="/payment" h="60px" colorPalette="teal" variant="outline">
              Оплатить ЖКУ
            </Button>
            <Button as={RouterLink} to="/profile" h="60px" colorPalette="teal" variant="outline">
              Настройки профиля
            </Button>
          </SimpleGrid>
        </Box>
      </SimpleGrid>
    </Box>
  );
}