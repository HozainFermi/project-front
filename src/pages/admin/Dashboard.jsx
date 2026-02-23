import { Box, Heading, SimpleGrid, Stat } from '@chakra-ui/react';

export default function AdminDashboard() {
  return (
    <Box>
      <Heading size="lg" mb={6}>
        Админ‑дашборд
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 4 }} gap={6}>
        <Stat.Root bg="white" p={4} rounded="lg" shadow="sm">
          <Stat.Label>Дома в управлении</Stat.Label>
          <Stat.ValueText>24</Stat.ValueText>
        </Stat.Root>
        
        <Stat.Root bg="white" p={4} rounded="lg" shadow="sm">
          <Stat.Label>Активных жильцов</Stat.Label>
          <Stat.ValueText>1 250</Stat.ValueText>
        </Stat.Root>
        
        <Stat.Root bg="white" p={4} rounded="lg" shadow="sm">
          <Stat.Label>Сотрудников</Stat.Label>
          <Stat.ValueText>32</Stat.ValueText>
        </Stat.Root>
        
        <Stat.Root bg="white" p={4} rounded="lg" shadow="sm">
          <Stat.Label>Открытых заявок</Stat.Label>
          <Stat.ValueText>7</Stat.ValueText>
          <Stat.HelpText>по всем домам</Stat.HelpText>
        </Stat.Root>
      </SimpleGrid>
    </Box>
  );
}