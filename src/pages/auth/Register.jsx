import { Box, Button, Input, Stack, Fieldset, Field } from '@chakra-ui/react';

export default function Register() {
  return (

    <Fieldset.Root>
          <Stack spacing={6}>
            <Fieldset.Legend>Регистрация</Fieldset.Legend>        
            <Fieldset.HelperText fontSize="sm" color="gray.300">
               Страница для первичной регистрации жильца или привязки к объекту.
            </Fieldset.HelperText>
            </Stack>
    
          <Fieldset.Content>
            <Field.Root>
              <Field.Label>ФИО</Field.Label>
              <Input name="name" placeholder="Иванов Иван Иванович" />
            </Field.Root>
    
          <Field.Root>
              <Field.Label>Телефон</Field.Label>
              <Input  name="phone" placeholder="+7 (___) ___‑__‑__"/>
            </Field.Root>

          <Field.Root>
              <Field.Label>Адрес</Field.Label>
              <Input  name="address"  placeholder="Город, улица, дом, квартира"/>
            </Field.Root>

          <Button colorScheme="teal">Зарегистрироваться</Button>
    
          </Fieldset.Content>
          <Box fontSize="sm" color="gray.400">
        Здесь же можно будет делать выбор ТСЖ/УК, подтверждение по коду и т.п.
      </Box>
        </Fieldset.Root>

    
  );
}

