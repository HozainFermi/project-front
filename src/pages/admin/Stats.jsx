import { Box, Heading, SimpleGrid, Stat } from '@chakra-ui/react';

export default function AdminStats() {
  return (
    <Box>
      <Heading size="lg" mb={6}>
        Статистика
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        <Stat.Root bg="white" p={4} rounded="lg" shadow="sm">
          <Stat.Label>Оплата за месяц</Stat.Label>
          <Stat.ValueText>92%</Stat.ValueText>
          <Stat.HelpText>доля оплаченных квитанций</Stat.HelpText>
        </Stat.Root>
        
        <Stat.Root bg="white" p={4} rounded="lg" shadow="sm">
          <Stat.Label>Среднее время закрытия заявки</Stat.Label>
          <Stat.ValueText>1.8 дн</Stat.ValueText>
        </Stat.Root>
        
        <Stat.Root bg="white" p={4} rounded="lg" shadow="sm">
          <Stat.Label>Показаний передано вовремя</Stat.Label>
          <Stat.ValueText>87%</Stat.ValueText>
        </Stat.Root>
      </SimpleGrid>
    </Box>
  );
}