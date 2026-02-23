import { Box, Heading, Text, Stack, Badge, Button } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

export default function RequestDetails() {
  const { id } = useParams();

  return (
    <Box>
      <Heading size="lg" mb={4}>
        Заявка #{id}
      </Heading>
      <Stack spacing={3} bg="white" p={4} rounded="lg" shadow="sm">
        <Text>
          <strong>Жилец:</strong> Иванов И.И.
        </Text>
        <Text>
          <strong>Адрес:</strong> Примерный дом, кв. 1
        </Text>
        <Text>
          <strong>Статус:</strong> <Badge colorScheme="yellow">В работе</Badge>
        </Text>
        <Text>
          <strong>Описание:</strong> Протечка в подвале, запах сырости.
        </Text>
        <Button alignSelf="flex-start" colorScheme="teal">
          Закрыть заявку
        </Button>
      </Stack>
    </Box>
  );
}

