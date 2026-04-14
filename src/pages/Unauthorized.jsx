import { Box, Heading, Text, Button, HStack, Image, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import * as Buttons from "../components/ui/buttons";
export default function Unauthorized() {
  return (
    <Box minH="100vh" bg="gray.50">
      {/* Шапка */}
      <Box as="header" bg="white" py={4} px={8} borderBottom="1px solid" borderColor="gray.200">
        <HStack justify="space-between">
          <Heading size="lg" color="teal.600">ЖКХ Портал</Heading>
          <HStack gap={4}>
            <Buttons.PrimaryButton as={RouterLink} to="/auth/login">
              Вход
            </Buttons.PrimaryButton>
            <Buttons.PrimaryButton as={RouterLink} to="/auth/register">
              Регистрация
            </Buttons.PrimaryButton>
          </HStack>
        </HStack>
      </Box>

      {/* Основной контент */}
      <Box maxW="1200px" mx="auto" px={4} py={12}>
        <VStack gap={6} textAlign="center">
          <Heading size="2xl" color="gray.800">Портал ЖКХ</Heading>
          <Text fontSize="xl" color="gray.600">
            Добро пожаловать в единый личный кабинет плательщика!
          </Text>
          <Text color="gray.500" maxW="600px">
            Управляйте услугами ЖКХ, передавайте показания, оплачивайте онлайн и создавайте заявки. Все данные шифруются.
          </Text>
          <Image 
            src="src/assets/house1.avif" 
            alt="Дом" 
            borderRadius="lg" 
            maxH="400px"
            objectFit="cover"
          />
        </VStack>
      </Box>

      {/* Футер */}
      <Box as="footer" bg="white" py={4} textAlign="center" borderTop="1px solid" borderColor="gray.200">
        <Text fontSize="sm" color="gray.500">
          © 2026 ООО «Портал ЖКХ»
        </Text>
      </Box>
    </Box>
  );
}