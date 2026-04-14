import { Box, Heading, Stack, Text } from '@chakra-ui/react';

export default function UserNews() {
  return (
    <Box>
      <Heading size="lg" mb={4}>
        Новости дома
      </Heading>
      <Stack spacing={4}>
        <Box bg="white" p={4} rounded="lg" shadow="sm">
          <Heading size="sm" mb={2}>
            Плановое отключение воды
          </Heading>
          <Text fontSize="sm" color="gray.600">
            05.02.2026 с 10:00 до 16:00 будет проводиться плановое обслуживание. Просим отнестись с
            пониманием.
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}

