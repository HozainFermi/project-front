import { Box, Heading, Table, Button, Select } from '@chakra-ui/react';

export default function AdminWorkers() {
  return (
    <Box>
      <Heading size="lg" mb={4}>
        Сотрудники
      </Heading>
      
      <Table.Root bg="white" rounded="lg" shadow="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ФИО</Table.ColumnHeader>
            <Table.ColumnHeader>Роль</Table.ColumnHeader>
            <Table.ColumnHeader>Телефон</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          <Table.Row>
            <Table.Cell>Петров П.П.</Table.Cell>
            <Table.Cell>
              <Select.Root size="sm" defaultValue="worker" width="120px">
                <Select.Trigger>
                  <Select.ValueText placeholder="Выберите роль" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="worker">Сотрудник</Select.Item>
                  <Select.Item value="admin">Админ</Select.Item>
                </Select.Content>
              </Select.Root>
            </Table.Cell>
            <Table.Cell>+7 (999) 111-11-11</Table.Cell>
            <Table.Cell textAlign="end">
              <Button size="sm" variant="outline">
                Сохранить
              </Button>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Box>
  );
}