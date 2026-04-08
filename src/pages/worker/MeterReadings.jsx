import { Box, Heading, Table, Button, HStack, Badge, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { toaster } from '../../components/ui/toaster';
import api from '../../api/instance';

export default function WorkerMeterReadings() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users/counters');
      setReadings(response.data);
    } catch (error) {
      console.error('Ошибка загрузки показаний:', error);
      toaster.create({
        title: 'Ошибка',
        description: 'Не удалось загрузить показания',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
  try {
    await api.put(`/api/service/counters/${id}`);
    
    toaster.create({
      title: 'Показания приняты',
      description: 'Показания счётчика успешно приняты',
      type: 'success',
      duration: 3000,
    });
    
    await fetchReadings();
  } catch (error) {
    console.error('Ошибка принятия показаний:', error);
    toaster.create({
      title: 'Ошибка',
      description: error.response?.data?.message || 'Не удалось принять показания',
      type: 'error',
      duration: 3000,
    });
  }
};

  const handleReject = async (id) => {
    try {
      await api.delete(`/api/users/counters/${id}`);
      
      toaster.create({
        title: 'Показания отклонены',
        description: 'Показания счётчика отклонены и удалены',
        type: 'error',
        duration: 3000,
      });
      
      await fetchReadings();
    } catch (error) {
      console.error('Ошибка отклонения показаний:', error);
      toaster.create({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось отклонить показания',
        type: 'error',
        duration: 3000,
      });
    }
  };

  const getStatusBadge = (isApproved) => {
    if (isApproved === true) {
      return <Badge colorPalette="green">Принято</Badge>;
    } else if (isApproved === false) {
      return <Badge colorPalette="yellow">На проверке</Badge>;
    }
    return <Badge colorPalette="gray">Неизвестно</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const getMeterTypeText = (type) => {
    switch(type) {
      case 'ColdWater': return 'ХВС';
      case 'HotWater': return 'ГВС';
      case 'Electricity': return 'Электричество';
      default: return type;
    }
  };

  const getOwnerName = (owner) => {
    if (!owner) return '—';
    const lastName = owner.lastName || '';
    const firstName = owner.firstName || '';
    return `${lastName} ${firstName}`.trim() || owner.email || '—';
  };

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Text>Загрузка показаний...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={4}>
        Показания счётчиков (проверка)
      </Heading>
      
      <Table.Root bg="white" rounded="lg" shadow="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Жилец</Table.ColumnHeader>
            <Table.ColumnHeader>Тип</Table.ColumnHeader>
            <Table.ColumnHeader>Показания</Table.ColumnHeader>
            <Table.ColumnHeader>Дата</Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          {readings.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={6} textAlign="center">
                <Text py={4} color="gray.500">Нет показаний для проверки</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            readings.map((reading) => (
              <Table.Row key={reading.id}>
                <Table.Cell>{getOwnerName(reading.owner)}</Table.Cell>
                <Table.Cell>{getMeterTypeText(reading.name)}</Table.Cell>
                <Table.Cell>{reading.value}</Table.Cell>
                <Table.Cell>{formatDate(reading.createdAt)}</Table.Cell>
                <Table.Cell>{getStatusBadge(reading.isApproved)}</Table.Cell>
                <Table.Cell textAlign="end">
                  {reading.isApproved === false ? (
                    <HStack gap={2} justifyContent="flex-end">
                      <Button 
                        size="sm" 
                        colorPalette="teal" 
                        color="black"
                        onClick={() => handleAccept(reading.id)}
                      >
                        Принять
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        color="black"
                        onClick={() => handleReject(reading.id)}
                      >
                        Отклонить
                      </Button>
                    </HStack>
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      {reading.isApproved === true ? 'Принято' : 'Обработано'}
                    </Text>
                  )}
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}