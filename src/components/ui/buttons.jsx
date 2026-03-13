import { Button as ChakraButton } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

// Основная зелёная кнопка (с заливкой)
export const PrimaryButton = ({ children, ...props }) => (
  <ChakraButton
    colorPalette="teal"
    color="white"
    _hover={{ bg: 'teal.600' }}
    {...props}
  >
    {children}
  </ChakraButton>
);

// Зелёная кнопка с обводкой (outline)
export const OutlineButton = ({ children, ...props }) => (
  <ChakraButton
    colorPalette="teal"
    variant="outline"
    color="teal.500"
    borderColor="teal.500"
    _hover={{
      bg: 'teal.50',
      color: 'teal.600',
      borderColor: 'teal.600'
    }}
    {...props}
  >
    {children}
  </ChakraButton>
);

// Красная кнопка 
export const DangerButton = ({ children, ...props }) => (
  <ChakraButton
    colorPalette="red"
    color="white"
    _hover={{ bg: 'red.600' }}
    {...props}
  >
    {children}
  </ChakraButton>
);

// Фиолетовая кнопка (как в дизайне)
export const PurpleButton = ({ children, ...props }) => (
  <ChakraButton
    colorPalette="purple"
    variant="outline"
    color="#646cff"
    borderColor="#646cff"
    _hover={{
      bg: '#f0f0ff',
      color: '#535bf2',
      borderColor: '#535bf2'
    }}
    {...props}
  >
    {children}
  </ChakraButton>
);

// Кнопка-ссылка (как "Все новости →")
export const GhostButton = ({ children, ...props }) => (
  <ChakraButton
    variant="ghost"
    color="gray.600"
    _hover={{ color: 'gray.900', bg: 'gray.50' }}
    {...props}
  >
    {children}
  </ChakraButton>
);

// Большая кнопка для быстрых действий
export const ActionButton = ({ children, ...props }) => (
  <ChakraButton
    h="60px"
    colorPalette="teal"
    variant="outline"
    color="teal.500"
    borderColor="teal.500"
    _hover={{
      bg: 'teal.50',
      color: 'teal.600',
      borderColor: 'teal.600'
    }}
    {...props}
  >
    {children}
  </ChakraButton>
);

// Универсальная кнопка с поддержкой RouterLink
export const LinkButton = ({ to, children, ...props }) => (
  <ChakraButton as={RouterLink} to={to} {...props}>
    {children}
  </ChakraButton>
);