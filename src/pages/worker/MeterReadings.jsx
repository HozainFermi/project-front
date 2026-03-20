import { Box, Heading, Table, Button, HStack, Badge, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { toaster } from '../../components/ui/toaster';

export default function WorkerMeterReadings() {
  const [readings, setReadings] = useState([
    {
      id: 1,
      resident: 'Иванов И.И.',
      type: 'ГВС',
      value: 56,
      date: '01.02.2026',
      status: 'pending'
    }
  ]);

  const handleAccept = (id) => {
    setReadings(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: 'accepted' } : r
      )
    );
    toaster.create({
      title: 'Показания приняты',
      description: 'Показания счётчика успешно приняты',
      type: 'success',
      duration: 3000,
    });
  };

  const handleReject = (id) => {
    setReadings(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status: 'rejected' } : r
      )
    );
    toaster.create({
      title: 'Показания отклонены',
      description: 'Показания счётчика отклонены',
      type: 'error',
      duration: 3000,
    });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'accepted':
        return <Badge colorPalette="green">Принято</Badge>;
      case 'rejected':
        return <Badge colorPalette="red">Отклонено</Badge>;
      default:
        return <Badge colorPalette="yellow">На проверке</Badge>;
    }
  };

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
          {readings.map((reading) => (
            <Table.Row key={reading.id}>
              <Table.Cell>{reading.resident}</Table.Cell>
              <Table.Cell>{reading.type}</Table.Cell>
              <Table.Cell>{reading.value}</Table.Cell>
              <Table.Cell>{reading.date}</Table.Cell>
              <Table.Cell>{getStatusBadge(reading.status)}</Table.Cell>
              <Table.Cell textAlign="end">
                {reading.status === 'pending' ? (
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
                    {reading.status === 'accepted' ? 'Обработано' : 'Отклонено'}
                  </Text>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}