import { Box, Heading, Table, Button, Input, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { toaster } from '../../components/ui/toaster';
import api from '../../api/instance';

export default function AdminWorkers() {
  const [companyId, setCompanyId] = useState('');
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!companyId.trim()) {
      toaster.create({
        title: 'Ошибка',
        description: 'Введите ID компании',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    setSearched(true);
    
    try {
      const response = await api.get(`/api/service/company_profile/workers/${companyId}`);
      setWorkers(response.data);
      
      if (response.data.length === 0) {
        toaster.create({
          title: 'Информация',
          description: `Сотрудники для компании ID ${companyId} не найдены`,
          type: 'info',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки сотрудников:', error);
      
      if (error.response?.status === 404) {
        toaster.create({
          title: 'Ошибка',
          description: `Компания с ID ${companyId} не найдена`,
          type: 'error',
          duration: 3000,
        });
      } else {
        toaster.create({
          title: 'Ошибка',
          description: 'Не удалось загрузить список сотрудников',
          type: 'error',
          duration: 3000,
        });
      }
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  const getFullName = (worker) => {
    const lastName = worker.lastName || '';
    const firstName = worker.firstName || '';
    const middleName = worker.middleName || '';
    const fullName = `${lastName} ${firstName} ${middleName}`.trim();
    return fullName || worker.email || '—';
  };

  return (
    <Box>
      <Heading size="lg" mb={4}>
        Сотрудники компании
      </Heading>

      {/* Поиск по ID компании */}
      <HStack mb={6} gap={4}>
        <Input
          placeholder="Введите ID компании"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          maxW="300px"
          type="number"
        />
        <Button 
          colorPalette="teal" 
          onClick={handleSearch}
          isLoading={loading}
          loadingText="Загрузка..."
        >
          Найти
        </Button>
      </HStack>

      {/* Результаты */}
      {searched && (
        <>
          <Heading size="md" mb={4}>
            Результаты (компания ID: {companyId})
          </Heading>
          
          <Table.Root bg="white" rounded="lg" shadow="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>ID</Table.ColumnHeader>
                <Table.ColumnHeader>ФИО</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Телефон</Table.ColumnHeader>
                <Table.ColumnHeader>Роль</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {workers.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} textAlign="center">
                    <Text py={4} color="gray.500">
                      Нет сотрудников в компании ID {companyId}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                workers.map((worker) => (
                  <Table.Row key={worker.id}>
                    <Table.Cell>{worker.id}</Table.Cell>
                    <Table.Cell>{getFullName(worker)}</Table.Cell>
                    <Table.Cell>{worker.email || '—'}</Table.Cell>
                    <Table.Cell>{worker.phone || '—'}</Table.Cell>
                    <Table.Cell>{worker.role === 'Worker' ? 'Сотрудник' : worker.role}</Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </>
      )}
    </Box>
  );
}