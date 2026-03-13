import { Box, Heading, Stack, Text, Button } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

export default function UserDetails() {
  const { id } = useParams();

  return (
    <Box>
      <Heading size="lg" mb={4}>
        Карточка жильца #{id}
      </Heading>
      <Stack spacing={3} bg="white" p={4} rounded="lg" shadow="sm">
        <Text>
          <strong>ФИО:</strong> Иванов Иван Иванович
        </Text>
        <Text>
          <strong>Адрес:</strong> ул. Примерная, д. 1, кв. 1
        </Text>
        <Text>
          <strong>Телефон:</strong> +7 (999) 000‑00‑00
        </Text>
        <Text>
          <strong>Статус:</strong> Активен
        </Text>
        <Button alignSelf="flex-start" colorPalette="teal" variant="outline">
          История заявок
        </Button>
      </Stack>
    </Box>
  );
}

