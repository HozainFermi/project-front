import { Box, Heading, Table, Button, HStack } from '@chakra-ui/react';

export default function WorkerMeterReadings() {
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
            <Table.ColumnHeader textAlign="end">Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          <Table.Row>
            <Table.Cell>Иванов И.И.</Table.Cell>
            <Table.Cell>ГВС</Table.Cell>
            <Table.Cell>56</Table.Cell>
            <Table.Cell>01.02.2026</Table.Cell>
            <Table.Cell textAlign="end">
              <HStack gap={2} justifyContent="flex-end">
                <Button size="sm" colorPalette="teal">
                  Принять
                </Button>
                <Button size="sm" variant="outline">
                  Отклонить
                </Button>
              </HStack>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </Box>
  );
}