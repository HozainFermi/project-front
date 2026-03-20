import { Box, Heading, Stack, Text, Button, HStack } from '@chakra-ui/react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const user = location.state?.user || {
    id: id,
    name: 'Иванов Иван Иванович',
    address: 'ул. Примерная, д. 1, кв. 1',
    phone: '+7 (999) 000‑00‑00',
    status: 'Активен'
  };

  const handleBack = () => {
    navigate('/worker/users');
  };

  return (
    <Box>
      <Heading size="lg" mb={4}>
        Карточка жильца #{id}
      </Heading>
      
      <Stack spacing={3} bg="white" p={4} rounded="lg" shadow="sm">
        <HStack justify="space-between">
          <Text fontWeight="bold">Данные жильца</Text>
          <Button
            size="xs"
            variant="ghost"
            colorPalette="teal"
            onClick={handleBack}
          >
            Свернуть
          </Button>
        </HStack>

        <Text>
          <strong>ФИО:</strong> {user.name}
        </Text>
        <Text>
          <strong>Адрес:</strong> {user.address}
        </Text>
        <Text>
          <strong>Телефон:</strong> {user.phone}
        </Text>
        <Text>
          <strong>Статус:</strong> {user.status}
        </Text>
      </Stack>
    </Box>
  );
}