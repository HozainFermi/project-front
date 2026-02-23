import { Box, Heading, SimpleGrid, Stat } from '@chakra-ui/react';

export default function WorkerDashboard() {
  return (
    <Box>
      <Heading size="lg" mb={6}>
        Дашборд сотрудника
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        <Stat.Root bg="white" p={4} rounded="lg" shadow="sm">
          <Stat.Label>Открытые заявки</Stat.Label>
          <Stat.ValueText>5</Stat.ValueText>
          <Stat.HelpText>в работе</Stat.HelpText>
        </Stat.Root>
        
        <Stat.Root bg="white" p={4} rounded="lg" shadow="sm">
          <Stat.Label>Новые показания</Stat.Label>
          <Stat.ValueText>12</Stat.ValueText>
          <Stat.HelpText>ожидают проверки</Stat.HelpText>
        </Stat.Root>
        
        <Stat.Root bg="white" p={4} rounded="lg" shadow="sm">
          <Stat.Label>Сообщения жильцов</Stat.Label>
          <Stat.ValueText>3</Stat.ValueText>
          <Stat.HelpText>непрочитанных</Stat.HelpText>
        </Stat.Root>
      </SimpleGrid>
    </Box>
  );
}