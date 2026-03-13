import { Box, Heading, SimpleGrid, Stat, HStack, VStack, Text, Button, Progress, Badge } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/instance';

export default function WorkerDashboard() {
  const [stats, setStats] = useState({
    openRequests: 0,
    pendingReadings: 0,
    unreadMessages: 0,
    todayTasks: 0,
    requestsByStatus: {
      new: 0,
      in_progress: 0,
      completed: 0
    },
    recentRequests: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/worker/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Ошибка загрузки статистики', error);
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
      <Heading size="lg" mb={6}>
        Рабочая панель
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
        <Stat.Root bg="white" p={6} rounded="lg" shadow="sm" borderWidth="1px">
          <Stat.Label fontSize="sm" color="gray.600">Открытые заявки</Stat.Label>
          <Stat.ValueText fontSize="3xl" fontWeight="bold">{stats.openRequests}</Stat.ValueText>
          <Stat.HelpText fontSize="sm">требуют внимания</Stat.HelpText>
          <Progress.Root value={(stats.requestsByStatus.in_progress / stats.openRequests) * 100 || 0} mt={4}>
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
          <Text fontSize="xs" mt={2} color="gray.600">
            {stats.requestsByStatus.in_progress} в работе, {stats.requestsByStatus.new} новых
          </Text>
        </Stat.Root>
        
        <Stat.Root bg="white" p={6} rounded="lg" shadow="sm" borderWidth="1px">
          <Stat.Label fontSize="sm" color="gray.600">Новые показания</Stat.Label>
          <Stat.ValueText fontSize="3xl" fontWeight="bold">{stats.pendingReadings}</Stat.ValueText>
          <Stat.HelpText fontSize="sm">ожидают проверки</Stat.HelpText>
          <Button 
            as={RouterLink} 
            to="/worker/meter-readings" 
            size="sm" 
            colorPalette="teal" 
            mt={4}
            w="full"
          >
            Проверить
          </Button>
        </Stat.Root>
        
        <Stat.Root bg="white" p={6} rounded="lg" shadow="sm" borderWidth="1px">
          <Stat.Label fontSize="sm" color="gray.600">Непрочитанные сообщения</Stat.Label>
          <Stat.ValueText fontSize="3xl" fontWeight="bold">{stats.unreadMessages}</Stat.ValueText>
          <Stat.HelpText fontSize="sm">от жильцов</Stat.HelpText>
          <Button as={RouterLink} to="/worker/messages" size="sm" variant="outline" mt={4} w="full">
            Прочитать
          </Button>
        </Stat.Root>

        <Stat.Root bg="white" p={6} rounded="lg" shadow="sm" borderWidth="1px">
          <Stat.Label fontSize="sm" color="gray.600">Задачи на сегодня</Stat.Label>
          <Stat.ValueText fontSize="3xl" fontWeight="bold">{stats.todayTasks}</Stat.ValueText>
          <Stat.HelpText fontSize="sm">плановые работы</Stat.HelpText>
        </Stat.Root>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
        <Box bg="white" p={6} rounded="lg" shadow="sm" borderWidth="1px">
          <HStack justify="space-between" mb={4}>
            <Heading size="md">Последние заявки</Heading>
            <Button as={RouterLink} to="/worker/requests" size="sm" variant="ghost" colorPalette="teal">
              Все заявки →
            </Button>
          </HStack>
          
          {stats.recentRequests?.length > 0 ? (
            <VStack align="stretch" gap={3}>
              {stats.recentRequests.map((request) => (
                <Box key={request.id} p={4} bg="gray.50" rounded="md" borderWidth="1px">
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="bold">№{request.id} {request.title}</Text>
                    <Badge 
                      colorPalette={
                        request.status === 'new' ? 'blue' : 
                        request.status === 'in_progress' ? 'yellow' : 'green'
                      }
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      {request.status === 'new' ? 'Новая' : 
                       request.status === 'in_progress' ? 'В работе' : 'Выполнена'}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    {request.userName} • кв. {request.apartment}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    {new Date(request.createdAt).toLocaleString('ru-RU')}
                  </Text>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text color="gray.500" textAlign="center" py={4}>
              Нет новых заявок
            </Text>
          )}
        </Box>

        <Box bg="white" p={6} rounded="lg" shadow="sm" borderWidth="1px">
          <Heading size="md" mb={4}>Быстрые действия</Heading>
          <SimpleGrid columns={2} gap={4}>
            <Button 
              as={RouterLink} 
              to="/worker/requests" 
              h="60px" 
              colorPalette="teal"
              variant="solid"
            >
              Все заявки
            </Button>
            <Button 
              as={RouterLink} 
              to="/worker/meter-readings" 
              h="60px" 
              colorPalette="teal"
              variant="solid"
            >
              Показания
            </Button>
            <Button 
              as={RouterLink} 
              to="/worker/users" 
              h="60px" 
              variant="outline"
            >
              Жильцы
            </Button>
            <Button 
              as={RouterLink} 
              to="/worker/reports" 
              h="60px" 
              variant="outline"
            >
              Отчёты
            </Button>
            <Button 
              as={RouterLink} 
              to="/worker/schedule" 
              h="60px" 
              variant="outline"
            >
              График работ
            </Button>
            <Button 
              as={RouterLink} 
              to="/worker/messages" 
              h="60px" 
              variant="outline"
            >
              Сообщения
            </Button>
          </SimpleGrid>
        </Box>
      </SimpleGrid>
    </Box>
  );
}