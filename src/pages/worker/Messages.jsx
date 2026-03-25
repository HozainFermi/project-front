// src/pages/worker/Messages.jsx
import { Box, Heading, Text, VStack, HStack, Badge, Button } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaCheck, FaTrash } from 'react-icons/fa';
import * as Buttons from "../../components/ui/buttons"
export default function WorkerMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // TODO: заменить на реальный API
      // const response = await api.get('/worker/payment-notifications');
      // setMessages(response.data);
      
      // Временные моковые данные
      const mockMessages = [
        {
          id: 1,
          resident: 'Иванов И.И.',
          apartment: '42',
          amount: 3250.50,
          date: '2026-03-20T10:30:00Z',
          message: 'Оплатил(а) коммунальные услуги на сумму 3 250.50 ₽',
          status: 'unread'
        },
        {
          id: 2,
          resident: 'Загиров П.П.',
          apartment: '15',
          amount: 1850.00,
          date: '2026-03-19T14:20:00Z',
          message: 'Оплатил(а) коммунальные услуги на сумму 1 850.00 ₽',
          status: 'unread'
        },
        {
          id: 3,
          resident: 'Сидорова А.А.',
          apartment: '8',
          amount: 4200.00,
          date: '2026-03-18T09:15:00Z',
          message: 'Оплатил(а) коммунальные услуги на сумму 4 200.00 ₽',
          status: 'read'
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Ошибка загрузки уведомлений', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = (id) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id ? { ...msg, status: 'read' } : msg
      )
    );
    // TODO: api.patch(`/worker/payment-notifications/${id}/read`)
  };

  const handleDelete = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
    // TODO: api.delete(`/worker/payment-notifications/${id}`)
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 1) {
      return `${Math.floor(diff / (1000 * 60))} минут назад`;
    } else if (hours < 24) {
      return `${Math.floor(hours)} часов назад`;
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Text>Загрузка уведомлений...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">
            <Text>Уведомления об оплате</Text>
        </Heading>
        <Badge colorPalette="blue" fontSize="md" px={3} py={1}>
          Непрочитанных: {messages.filter(m => m.status === 'unread').length}
        </Badge>
      </HStack>

      {messages.length === 0 ? (
        <Box bg="white" p={8} rounded="lg" textAlign="center" shadow="sm">
          <Text color="gray.500">Нет новых уведомлений об оплате</Text>
        </Box>
      ) : (
        <VStack gap={4} align="stretch">
          {messages.map((message) => (
            <Box
              key={message.id}
              bg={message.status === 'unread' ? 'blue.50' : 'white'}
              p={4}
              rounded="lg"
              shadow="sm"
              borderWidth="1px"
              borderColor={message.status === 'unread' ? 'blue.200' : 'gray.200'}
              _hover={{ shadow: 'md' }}
              transition="all 0.2s"
            >
              <HStack justify="space-between" mb={3}>
                <HStack gap={3}>
                  <Badge colorPalette="green" px={2} py={1} rounded="full">
                      <Text fontSize="xs">Оплата</Text>
                  </Badge>
                  <Text fontWeight="bold">
                    {message.resident} (кв. {message.apartment})
                  </Text>
                  {message.status === 'unread' && (
                    <Badge colorPalette="blue" size="sm">Новое</Badge>
                  )}
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  {formatDate(message.date)}
                </Text>
              </HStack>

              <Text color="gray.700" mb={4}>
                {message.message}
              </Text>

              <HStack gap={3} justify="flex-end">
                {message.status === 'unread' && (
                  <Buttons.PrimaryButton
                    onClick={() => handleMarkAsRead(message.id)}
                  >
                    Отметить прочитанным
                  </Buttons.PrimaryButton>
                )}
                <Buttons.DangerButton
                  onClick={() => handleDelete(message.id)}
                >
                  Удалить
                </Buttons.DangerButton>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}