import { Box, Button, Input, Stack, Fieldset, Field } from '@chakra-ui/react';

export default function Login() {
  return (
    <Fieldset.Root>
      <Stack spacing={6}>
        <Fieldset.Legend color="white">Авторизация</Fieldset.Legend>        
        <Fieldset.HelperText fontSize="sm" color="gray.300">
          Здесь можно сделать вход по телефону/коду или по логину/паролю
        </Fieldset.HelperText>
        </Stack>

      <Fieldset.Content>
        <Field.Root>
          <Field.Label>Телефон</Field.Label>
          <Input name="phone" placeholder="+7 (___) ___‑__‑__" />
        </Field.Root>

      <Field.Root>
          <Field.Label>Код из SMS</Field.Label>
          <Input placeholder="1234"/>
        </Field.Root>

      <Button colorScheme="teal">Войти</Button>

      </Fieldset.Content>
      <Box fontSize="sm" color="gray.400">
        Позже сюда можно добавить «запросить код», «отправить ещё раз», выбор роли и пр.
      </Box>
    </Fieldset.Root>
    
  );
}

