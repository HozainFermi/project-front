import { Box, Heading, SimpleGrid, Stat, HStack, VStack, Text, Button, Progress, Badge } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/instance';

export default function WorkerDashboard() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    openRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    rejectedRequests: 0,
    recentRequests: []
  });
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      let companyId = 1;
      try {
        const userRes = await api.get('/api/users/profile');
        companyId = userRes.data.companyId || 1;
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      }
      
      try {
        const companyResponse = await api.get(`/api/service/company_profile/${companyId}`);
        setCompanyName(companyResponse.data.companyName);
      } catch (error) {
        console.error('Ошибка загрузки компании:', error);
      }
      
      const requestsResponse = await api.get('/api/service/requests');
      const allRequests = requestsResponse.data || [];
      
      const total = allRequests.length;
      const open = allRequests.filter(r => r.status === 'Created' || r.status === 'Accepted').length;
      const inProgress = allRequests.filter(r => r.status === 'InProgress').length;
      const completed = allRequests.filter(r => r.status === 'Completed').length;
      const rejected = allRequests.filter(r => r.status === 'Rejected').length;
      
      const recent = [...allRequests]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      setStats({
        totalRequests: total,
        openRequests: open,
        inProgressRequests: inProgress,
        completedRequests: completed,
        rejectedRequests: rejected,
        recentRequests: recent
      });
      
    } catch (error) {
      console.error('Ошибка загрузки дашборда:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'green';
      case 'Rejected': return 'red';
      case 'InProgress': return 'yellow';
      case 'Accepted': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'Completed': return 'Выполнена';
      case 'Rejected': return 'Отклонена';
      case 'InProgress': return 'В работе';
      case 'Accepted': return 'Принята';
      default: return 'Создана';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Text>Загрузка данных...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={2}>
        Рабочая панель
      </Heading>
      {companyName && (
        <Text color="gray.500" mb={6}>
          {companyName}
        </Text>
      )}
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} mb={8}>
        <Stat.Root bg="white" p={6} rounded="lg" shadow="sm" borderWidth="1px">
          <Stat.Label fontSize="sm" color="gray.600">Всего заявок</Stat.Label>
          <Stat.ValueText fontSize="3xl" fontWeight="bold">
            {stats.totalRequests}
          </Stat.ValueText>
          <Stat.HelpText fontSize="sm">за всё время</Stat.HelpText>
        </Stat.Root>
        
        <Stat.Root bg="white" p={6} rounded="lg" shadow="sm" borderWidth="1px">
          <Stat.Label fontSize="sm" color="gray.600">Открытые заявки</Stat.Label>
          <Stat.ValueText fontSize="3xl" fontWeight="bold">
            {stats.openRequests}
          </Stat.ValueText>
          <Stat.HelpText fontSize="sm">требуют внимания</Stat.HelpText>
        </Stat.Root>
        
        <Stat.Root bg="white" p={6} rounded="lg" shadow="sm" borderWidth="1px">
          <Stat.Label fontSize="sm" color="gray.600">В работе</Stat.Label>
          <Stat.ValueText fontSize="3xl" fontWeight="bold">
            {stats.inProgressRequests}
          </Stat.ValueText>
          <Stat.HelpText fontSize="sm">активные заявки</Stat.HelpText>
        </Stat.Root>
        
        <Stat.Root bg="white" p={6} rounded="lg" shadow="sm" borderWidth="1px">
          <Stat.Label fontSize="sm" color="gray.600">Выполнено</Stat.Label>
          <Stat.ValueText fontSize="3xl" fontWeight="bold">
            {stats.completedRequests}
          </Stat.ValueText>
          <Stat.HelpText fontSize="sm">закрытые заявки</Stat.HelpText>
        </Stat.Root>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
        <Box bg="white" p={6} rounded="lg" shadow="sm" borderWidth="1px">
          <Heading size="md" mb={4}>Статусы заявок</Heading>
          <VStack align="stretch" gap={3}>
            <Box>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="sm">Открытые</Text>
                <Text fontSize="sm" fontWeight="bold">{stats.openRequests}</Text>
              </HStack>
              <Progress.Root value={(stats.openRequests / stats.totalRequests) * 100 || 0}>
                <Progress.Track>
                  <Progress.Range bg="blue.500" />
                </Progress.Track>
              </Progress.Root>
            </Box>
            <Box>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="sm">В работе</Text>
                <Text fontSize="sm" fontWeight="bold">{stats.inProgressRequests}</Text>
              </HStack>
              <Progress.Root value={(stats.inProgressRequests / stats.totalRequests) * 100 || 0}>
                <Progress.Track>
                  <Progress.Range bg="yellow.500" />
                </Progress.Track>
              </Progress.Root>
            </Box>
            <Box>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="sm">Выполнено</Text>
                <Text fontSize="sm" fontWeight="bold">{stats.completedRequests}</Text>
              </HStack>
              <Progress.Root value={(stats.completedRequests / stats.totalRequests) * 100 || 0}>
                <Progress.Track>
                  <Progress.Range bg="green.500" />
                </Progress.Track>
              </Progress.Root>
            </Box>
            <Box>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="sm">Отклонено</Text>
                <Text fontSize="sm" fontWeight="bold">{stats.rejectedRequests}</Text>
              </HStack>
              <Progress.Root value={(stats.rejectedRequests / stats.totalRequests) * 100 || 0}>
                <Progress.Track>
                  <Progress.Range bg="red.500" />
                </Progress.Track>
              </Progress.Root>
            </Box>
          </VStack>
        </Box>

        <Box bg="white" p={6} rounded="lg" shadow="sm" borderWidth="1px">
          <HStack justify="space-between" mb={4}>
            <Heading size="md">Последние заявки</Heading>
            <Button as={RouterLink} to="/worker/requests" size="sm" variant="ghost" colorPalette="teal">
              Все заявки →
            </Button>
          </HStack>
          
          {stats.recentRequests.length > 0 ? (
            <VStack align="stretch" gap={3}>
              {stats.recentRequests.map((request) => (
                <Box key={request.id} p={3} bg="gray.50" rounded="md" borderWidth="1px">
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="bold">№{request.id} {request.title}</Text>
                    <Badge colorPalette={getStatusColor(request.status)} px={2} py={1} borderRadius="full">
                      {getStatusText(request.status)}
                    </Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    {request.creator} • {formatDate(request.createdAt)}
                  </Text>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text color="gray.500" textAlign="center" py={4}>
              Нет заявок
            </Text>
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
}