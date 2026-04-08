import { Box, Heading, Table, Button, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/instance';
import { toaster } from '../../components/ui/toaster';

export default function CompanyUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      let companyId = 1;
      try {
        const userRes = await api.get('/api/users/profile');
        companyId = userRes.data.companyId || 1;
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
      }
      
      const companyRes = await api.get(`/api/service/company_profile/${companyId}`);
      setCompanyName(companyRes.data.companyName);
      
      const allMembers = companyRes.data.members || [];
      const residents = allMembers.filter(member => member.role === 'User');
      setUsers(residents);
      
    } catch (error) {
      console.error('Ошибка загрузки жильцов:', error);
      toaster.create({
        title: 'Ошибка',
        description: 'Не удалось загрузить список жильцов',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '—';
    const parts = [];
    if (address.city) parts.push(`г. ${address.city}`);
    if (address.street) parts.push(`ул. ${address.street}`);
    if (address.house) parts.push(`д. ${address.house}`);
    if (address.flat) parts.push(`кв. ${address.flat}`);
    return parts.join(', ') || '—';
  };

  const getFullName = (user) => {
    const lastName = user.lastName || '';
    const firstName = user.firstName || '';
    const fullName = `${lastName} ${firstName}`.trim();
    return fullName || user.email || '—';
  };

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Text>Загрузка жильцов...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={2}>
        Жильцы
      </Heading>
      {companyName && (
        <Text color="gray.500" mb={4}>
          {companyName}
        </Text>
      )}
      
      <Table.Root bg="white" rounded="lg" shadow="sm" overflowX="auto">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ФИО</Table.ColumnHeader>
            <Table.ColumnHeader>Адрес</Table.ColumnHeader>
            <Table.ColumnHeader>Телефон</Table.ColumnHeader>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          {users.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={5} textAlign="center">
                <Text py={4} color="gray.500">Нет жильцов</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            users.map((user) => (
              <Table.Row key={user.id}>
                <Table.Cell>{getFullName(user)}</Table.Cell>
                <Table.Cell>{formatAddress(user.address)}</Table.Cell>
                <Table.Cell>{user.phone || '—'}</Table.Cell>
                <Table.Cell>{user.email || '—'}</Table.Cell>
                <Table.Cell textAlign="end">
                  <Button 
                    size="sm"
                    colorPalette="teal"
                    color="black"
                    onClick={() => navigate(`/worker/users/${user.id}`, { 
                      state: { user } 
                    })}
                  >
                    Открыть
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}