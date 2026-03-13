import { Box, Heading, Table, Badge, Button, HStack } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Начальные данные
const initialRequests = [
  { 
    id: 1, 
    resident: 'Иванов И.И.', 
    topic: 'Протечка в подвале', 
    status: 'В работе',
    address: 'ул. Примерная, д. 1, кв. 1',
    description: 'Протечка в подвале, запах сырости.'
  },
  { 
    id: 2, 
    resident: 'Петров П.П.', 
    topic: 'Нет отопления', 
    status: 'В работе',
    address: 'ул. Примерная, д. 2, кв. 5',
    description: 'Батареи холодные третий день'
  },
  { 
    id: 3, 
    resident: 'Сидоров С.С.', 
    topic: 'Замок сломался', 
    status: 'В работе',
    address: 'ул. Примерная, д. 3, кв. 10',
    description: 'Дверь не закрывается'
  },
];

export default function WorkerRequests() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Загружаем из localStorage или используем начальные
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('requests');
    return saved ? JSON.parse(saved) : initialRequests;
  });

  // Сохраняем в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('requests', JSON.stringify(requests));
  }, [requests]);

  // Получаем обновления из RequestDetails
  useEffect(() => {
    if (location.state?.updatedRequest) {
      const updated = location.state.updatedRequest;
      
      setRequests(prev => 
        prev.map(req => req.id === updated.id ? updated : req)
      );
    }
  }, [location.state]);

  const getBadgeColor = (status) => {
    return status === 'Выполнено' ? 'green' : 'yellow';
  };

  const handleOpenRequest = (request) => {
    navigate(`/worker/requests/${request.id}`, { 
      state: { request }
    });
  };

  // Кнопка сброса (для тестирования)
  const handleReset = () => {
    setRequests(initialRequests);
    localStorage.setItem('requests', JSON.stringify(initialRequests));
  };

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Heading size="lg">Заявки жильцов</Heading>
      </HStack>
      
      <Table.Root bg="white" rounded="lg" shadow="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>№</Table.ColumnHeader>
            <Table.ColumnHeader>Жилец</Table.ColumnHeader>
            <Table.ColumnHeader>Тема</Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          {requests.map((request) => (
            <Table.Row key={request.id}>
              <Table.Cell>{request.id}</Table.Cell>
              <Table.Cell>{request.resident}</Table.Cell>
              <Table.Cell>{request.topic}</Table.Cell>
              <Table.Cell>
                <Badge colorPalette={getBadgeColor(request.status)}>
                  {request.status}
                </Badge>
              </Table.Cell>
              <Table.Cell textAlign="end">
                <Button 
                  size="sm"
                  colorPalette="teal"
                  color="black"
                  onClick={() => handleOpenRequest(request)}
                >
                  Открыть
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}