import { Box, Heading, Table, Badge, Button } from '@chakra-ui/react';

export default function UserRequests() {
  return (
    <Box>
      <Heading size="lg" mb={4}>
        Заявки
      </Heading>
      
      <Table.Root bg="white" rounded="lg" shadow="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>№</Table.ColumnHeader>
            <Table.ColumnHeader>Тема</Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader>Дата</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          <Table.Row>
            <Table.Cell>1</Table.Cell>
            <Table.Cell>Протечка в подвале</Table.Cell>
            <Table.Cell>
              <Badge colorPalette="green">Закрыта</Badge>
            </Table.Cell>
            <Table.Cell>15.01.2026</Table.Cell>
            <Table.Cell textAlign="end">
              <Button size="sm" variant="outline">
                Открыть
              </Button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Box>
  );
}