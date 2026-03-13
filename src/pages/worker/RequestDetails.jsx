import { Box, Heading, Text, Stack, Badge, Button, HStack } from '@chakra-ui/react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [request, setRequest] = useState(null);

  useEffect(() => {
    if (location.state?.request) {
      setRequest(location.state.request);
    }
  }, [location.state?.request?.id]);

  const handleCloseRequest = () => {
    if (!request) return;
    const updatedRequest = { ...request, status: 'Выполнено' };
    setRequest(updatedRequest);
  };

  const handleCancel = () => {
    if (!request) return;
    const updatedRequest = { ...request, status: 'В работе' };
    setRequest(updatedRequest);
  };

  const handleGoBack = () => {
    if (!request) return;
    navigate('/worker/requests', { 
      state: { updatedRequest: request }
    });
  };

  const getBadgeColor = () => {
    if (!request) return 'gray';
    return request.status === 'Выполнено' ? 'green' : 'yellow';
  };

  if (!request) {
    return (
      <Box p={8} textAlign="center">
        <Text>Загрузка заявки...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={4}>
        Заявка #{request.id}
      </Heading>
      
      <Stack spacing={3} bg="white" p={4} rounded="lg" shadow="sm">
        <HStack justify="space-between" width="full">
          <Text fontWeight="bold">Детали заявки</Text>
          <Button
            leftIcon={<FaArrowLeft />}
            size="xs"
            variant="ghost"
            colorPalette="teal"
            onClick={handleGoBack}
          >
            Свернуть
          </Button>
        </HStack>

        <Text><strong>Жилец:</strong> {request.resident}</Text>
        <Text><strong>Адрес:</strong> {request.address}</Text>
        <Text><strong>Тема:</strong> {request.topic}</Text>
        <Text>
          <strong>Статус:</strong> <Badge colorScheme={getBadgeColor()}>{request.status}</Badge>
        </Text>
        <Text><strong>Описание:</strong> {request.description}</Text>
        
        {request.status !== 'Выполнено' ? (
          <Button 
            alignSelf="flex-start" 
            colorPalette="teal" 
            color="black"
            leftIcon={<FaCheck />}
            onClick={handleCloseRequest}
          >
            Закрыть заявку
          </Button>
        ) : (
          <HStack justify="space-between" align="center">
            <Text color="green.500" fontWeight="bold">
              ✓ Заявка закрыта
            </Text>
            <Button
              size="sm"
              leftIcon={<FaTimes />}
              variant="outline"
              colorPalette="red"
              onClick={handleCancel}
            >
              Отменить закрытие
            </Button>
          </HStack>
        )}
      </Stack>
    </Box>
  );
}