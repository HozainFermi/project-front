import { Box, Heading, Table, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function CompanyUsers() {
  const navigate = useNavigate();

  return (
    <Box>
      <Heading size="lg" mb={4}>
        Жильцы
      </Heading>
      
      <Table.Root bg="white" rounded="lg" shadow="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ФИО</Table.ColumnHeader>
            <Table.ColumnHeader>Адрес</Table.ColumnHeader>
            <Table.ColumnHeader>Телефон</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          <Table.Row>
            <Table.Cell>Иванов И.И.</Table.Cell>
            <Table.Cell>ул. Примерная, д. 1, кв. 1</Table.Cell>
            <Table.Cell>+7 (999) 000-00-00</Table.Cell>
            <Table.Cell textAlign="end">
              <Button 
                size="sm" 
                onClick={() => navigate('/worker/users/1')}
              >
                Открыть
              </Button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Box>
  );
}