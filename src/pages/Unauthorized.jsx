import { Box, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { PurpleButton } from '../components/ui/buttons'
export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <Box bg="white" p={8} rounded="xl" shadow="lg" textAlign="center" maxW="md">
        <Heading size="lg" mb={4}>
          Нет доступа
        </Heading>
        <Text mb={6} color="gray.600">
          У вас нет прав для просмотра этой страницы. Если вы считаете, что это ошибка —
          обратитесь к администратору или в управляющую компанию.
        </Text>
        <PurpleButton colorScheme="teal" onClick={() => navigate(-1)}>
          Вернуться назад
        </PurpleButton>
      </Box>
    </Box>
  );
}

