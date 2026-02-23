import { Box, Heading, SimpleGrid, Stat } from '@chakra-ui/react';

export default function Home() {
  return (
    <Box>
      <Heading size="lg" mb={6}>
        Главная
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        <Stat.Root bg="white" p={4} rounded="lg" shadow="sm">
          <Stat.Label>Текущий баланс</Stat.Label>
          <Stat.ValueText>1 234 ₽</Stat.ValueText>
          <Stat.HelpText>к оплате до 10 числа</Stat.HelpText>
        </Stat.Root>
        
        <Stat.Root bg="white" p={4} rounded="lg" shadow="sm">
          <Stat.Label>Последние показания</Stat.Label>
          <Stat.ValueText>01.02.2026</Stat.ValueText>
          <Stat.HelpText>все счётчики переданы</Stat.HelpText>
        </Stat.Root>
        
        <Stat.Root bg="white" p={4} rounded="lg" shadow="sm">
          <Stat.Label>Открытые заявки</Stat.Label>
          <Stat.ValueText>0</Stat.ValueText>
          <Stat.HelpText>все заявки закрыты</Stat.HelpText>
        </Stat.Root>
      </SimpleGrid>
    </Box>
  );
}