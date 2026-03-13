import { Box, Heading, Table, Badge, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function WorkerRequests() {
  const navigate = useNavigate();

  return (
    <Box>
      <Heading size="lg" mb={4}>
        Заявки жильцов
      </Heading>
      
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
          <Table.Row>
            <Table.Cell>1</Table.Cell>
            <Table.Cell>Иванов И.И.</Table.Cell>
            <Table.Cell>Протечка в подвале</Table.Cell>
            <Table.Cell>
              <Badge colorPalette="yellow">В работе</Badge>
            </Table.Cell>
            <Table.Cell textAlign="end">
              <Button 
                size="sm"
                colorPalette="teal"
                color="black"
                onClick={() => navigate('/worker/requests/1')}
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