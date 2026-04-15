import { Box, Heading, Table, Button, HStack, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toaster } from '../../components/ui/toaster';
import api from '../../api/instance';

export default function WorkersList() {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      // Временно моковые данные
      const mockWorkers = [
        {
          id: 1,
          firstName: 'Иван',
          lastName: 'Иванов',
          email: 'ivan@example.com',
          phone: '+7 (999) 111-22-33',
          address: { city: 'Москва', street: 'Тверская', house: '10', flat: '5' }
        },
        {
          id: 2,
          firstName: 'Петр',
          lastName: 'Петров',
          email: 'petr@example.com',
          phone: '+7 (999) 444-55-66',
          address: { city: 'Москва', street: 'Ленина', house: '15', flat: '42' }
        }
      ];
      setWorkers(mockWorkers);
    } catch (error) {
      console.error('Ошибка загрузки сотрудников:', error);
      toaster.create({
        title: 'Ошибка',
        description: 'Не удалось загрузить список сотрудников',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Удалить сотрудника "${name}"?`);
    if (!confirmed) return;
    
    try {
      await api.delete(`/api/service/workers/${id}`);
      toaster.create({
        title: 'Успешно',
        description: 'Сотрудник удалён',
        type: 'success',
        duration: 3000,
      });
      fetchWorkers();
    } catch (error) {
      toaster.create({
        title: 'Ошибка',
        description: 'Не удалось удалить сотрудника',
        type: 'error',
        duration: 3000,
      });
    }
  };

  const getFullName = (worker) => {
    const lastName = worker.lastName || '';
    const firstName = worker.firstName || '';
    return `${lastName} ${firstName}`.trim() || worker.email || '—';
  };

  if (loading) {
    return <Box p={8} textAlign="center"><Text>Загрузка...</Text></Box>;
  }

  return (
    <Box>
      <Heading size="lg" mb={6}>Сотрудники компании</Heading>
      <Table.Root bg="white" rounded="lg" shadow="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ФИО</Table.ColumnHeader>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Телефон</Table.ColumnHeader>
            <Table.ColumnHeader>Адрес</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {workers.map((worker) => (
            <Table.Row key={worker.id}>
              <Table.Cell>{getFullName(worker)}</Table.Cell>
              <Table.Cell>{worker.email || '—'}</Table.Cell>
              <Table.Cell>{worker.phone || '—'}</Table.Cell>
              <Table.Cell>
                {worker.address?.city && worker.address?.street 
                  ? `${worker.address.city}, ул. ${worker.address.street}, ${worker.address.house}`
                  : '—'}
              </Table.Cell>
              <Table.Cell textAlign="end">
                <HStack gap={2} justify="flex-end">
                  <Button size="sm" variant="ghost" colorPalette="blue" onClick={() => navigate(`/owner/edit-worker/${worker.id}`, { state: { worker } })}>
                    <FaEdit />
                  </Button>
                  <Button size="sm" variant="ghost" colorPalette="red" onClick={() => handleDelete(worker.id, getFullName(worker))}>
                    <FaTrash />
                  </Button>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}