import { Box, Heading, Stack, Text } from '@chakra-ui/react';

export default function CompanyProfile() {
  return (
    <Box>
      <Heading size="lg" mb={4}>
        Профиль управляющей компании
      </Heading>
      <Stack spacing={2} bg="white" p={4} rounded="lg" shadow="sm">
        <Text>
          <strong>Название:</strong> ООО «УК Пример»
        </Text>
        <Text>
          <strong>ИНН:</strong> 0000000000
        </Text>
        <Text>
          <strong>Юр. адрес:</strong> г. Город, ул. Офисная, д. 1
        </Text>
        <Text>
          <strong>Контакты:</strong> +7 (999) 000‑00‑00, info@example.com
        </Text>
      </Stack>
    </Box>
  );
}

