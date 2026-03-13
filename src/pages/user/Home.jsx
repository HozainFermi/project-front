import { Box, Heading, SimpleGrid, Stat, Button, HStack, VStack, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/instance';
import * as Buttons from "../../components/ui/buttons";


export default function Home() {
  const [dashboardData, setDashboardData] = useState({
    balance: 1234.56,
    lastMeterReading: null,
    openRequests: 0,
    hasDebt: false
  });

  useEffect(() => {
    // Загрузка данных с сервера
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/user/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Ошибка загрузки данных', error);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <Box>
      <Heading size="lg"color="black" mb={6}>
        Добро пожаловать!
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} mb={8}>
        <Stat.Root bg="white" p={4} rounded="lg" shadow="sm">
          <Stat.Label>Текущий баланс</Stat.Label>
          <Stat.ValueText color={dashboardData.hasDebt ? 'red.500' : 'green.500'}>
            {dashboardData.balance.toFixed(2)} ₽
          </Stat.ValueText>
          <Stat.HelpText>к оплате до 10 числа</Stat.HelpText>
          {dashboardData.hasDebt && (
            <Button as={RouterLink} to="/payment" size="sm" colorPalette="red" mt={2}>
              Оплатить задолженность
            </Button>
          )}
        </Stat.Root>
        
        <Stat.Root bg="white" p={4} rounded="lg" shadow="sm">
          <Stat.Label>Последние показания</Stat.Label>
          <Stat.ValueText color="gray.700">
            {dashboardData.lastMeterReading 
              ? new Date(dashboardData.lastMeterReading).toLocaleDateString('ru-RU')
              : 'Не переданы'}
          </Stat.ValueText>
          <Stat.HelpText>
            {dashboardData.lastMeterReading 
              ? 'счётчики переданы' 
              : 'срочно передайте показания'}
          </Stat.HelpText>
          <Buttons.DangerButton 
            as={RouterLink} 
            to="/meters" 
            size="sm" 
            color="white"
            colorPalette={dashboardData.lastMeterReading ? 'teal' : 'red'} 
            mt={2}
            _hover={{
              bg:'red',
              color:'black'
            }}
          >
            {dashboardData.lastMeterReading ? 'Передать снова' : 'Передать показания'}
          </Buttons.DangerButton>
        </Stat.Root>
        
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
              <Text fontWeight="bold"color="black">Собрание жильцов</Text>
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