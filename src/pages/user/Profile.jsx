import { Box, Heading, Stack, Text } from '@chakra-ui/react';

export default function UserProfile() {
  return (
    <Box>
      <Heading size="lg" mb={4}>
        Профиль жильца
      </Heading>
      <Stack spacing={2} bg="white" p={4} rounded="lg" shadow="sm">
        <Text>ФИО: Иванов Иван Иванович</Text>
        <Text>Телефон: +7 (999) 000‑00‑00</Text>
        <Text>Адрес: г. Город, ул. Примерная, д. 1, кв. 1</Text>
        <Text>Роль: Жилец</Text>
      </Stack>
    </Box>
  );
}

