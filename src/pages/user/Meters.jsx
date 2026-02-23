import { Box, Heading, Table, Button } from '@chakra-ui/react';

export default function UserMeters() {
  return (
    <Box>
      <Heading size="lg" mb={4}>
        Показания счётчиков
      </Heading>
      
      <Table.Root bg="white" rounded="lg" shadow="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Тип</Table.ColumnHeader>
            <Table.ColumnHeader>Текущие показания</Table.ColumnHeader>
            <Table.ColumnHeader>Дата</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          <Table.Row>
            <Table.Cell>ХВС</Table.Cell>
            <Table.Cell>123</Table.Cell>
            <Table.Cell>01.02.2026</Table.Cell>
            <Table.Cell textAlign="end">
              <Button size="sm" colorPalette="teal">
                Передать
              </Button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Box>
  );
}