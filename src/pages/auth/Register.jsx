import { Box, Button, Input, Stack, Fieldset, Field, SimpleGrid, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toaster } from '../../components/ui/toaster';
import api from '../../api/instance';

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: '',
    phone: '',
    password: '',
    id_company: '',
    address: {
      region: '',
      city: '',
      street: '',
      house: '',
      flat: '',
      totalArea: ''
    }
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Введите имя';
    }
    if (!formData.surname.trim()) {
      newErrors.surname = 'Введите фамилию';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите телефон';
    }
    
    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    }
    
    if (!formData.id_company.trim()) {
      newErrors.id_company = 'Введите ID управляющей компании';
    }
    
    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'Введите город';
    }
    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Введите улицу';
    }
    if (!formData.address.house.trim()) {
      newErrors['address.house'] = 'Введите номер дома';
    }
    if (!formData.address.flat.trim()) {
      newErrors['address.flat'] = 'Введите номер квартиры';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Точная копия рабочего примера из Postman
      const payload = {
        email: formData.email,
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone,
        password: formData.password,
        id_company: formData.id_company,
        address: {
          region: formData.address.region,
          city: formData.address.city,
          street: formData.address.street,
          house: formData.address.house,
          flat: formData.address.flat,
          totalArea: formData.address.totalArea
        }
      };

      console.log('📤 Отправляем:', payload);

      const response = await api.post('/auth/register', payload);

      toaster.create({
        title: 'Успешно',
        description: response.data.message,
        type: 'success',
        duration: 3000,
      });

      navigate('/auth/login');
    } catch (error) {
      console.error('❌ Ошибка регистрации:', error);
      console.error('📡 Статус:', error.response?.status);
      console.error('📄 Ответ сервера:', error.response?.data);
      toaster.create({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось зарегистрироваться',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset.Root maxW="600px" mx="auto">
        <Stack spacing={6}>
          <Fieldset.Legend color="white">Регистрация</Fieldset.Legend>        
          <Fieldset.HelperText fontSize="sm" color="gray.300">
            Создайте новый аккаунт для доступа к ЖКХ порталу
          </Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
          {/* ФИО — два поля */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Field.Root invalid={errors.surname}>
              <Field.Label>Фамилия</Field.Label>
              <Input 
                name="surname" 
                value={formData.surname}
                onChange={handleChange}
                placeholder="Иванов" 
              />
              <Field.ErrorText>{errors.surname}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={errors.name}>
              <Field.Label>Имя</Field.Label>
              <Input 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                placeholder="Иван" 
              />
              <Field.ErrorText>{errors.name}</Field.ErrorText>
            </Field.Root>
          </SimpleGrid>

          {/* Email */}
          <Field.Root invalid={errors.email}>
            <Field.Label>Email</Field.Label>
            <Input 
              name="email" 
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@test.com" 
            />
            <Field.ErrorText>{errors.email}</Field.ErrorText>
          </Field.Root>

          {/* Телефон */}
          <Field.Root invalid={errors.phone}>
            <Field.Label>Телефон</Field.Label>
            <Input 
              name="phone" 
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7*********" 
            />
            <Field.ErrorText>{errors.phone}</Field.ErrorText>
          </Field.Root>

          {/* Пароль */}
          <Field.Root invalid={errors.password}>
            <Field.Label>Пароль</Field.Label>
            <Input 
              name="password" 
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="*********" 
            />
            <Field.ErrorText>{errors.password}</Field.ErrorText>
          </Field.Root>

          {/* ID компании */}
          <Field.Root invalid={errors.id_company}>
            <Field.Label>ID управляющей компании</Field.Label>
            <Input 
              name="id_company" 
              type="text"
              value={formData.id_company}
              onChange={handleChange}
              placeholder="1" 
            />
            <Field.ErrorText>{errors.id_company}</Field.ErrorText>
          </Field.Root>

          {/* Адрес */}
          <Box>
            <Text fontWeight="bold" mb={2} color="white">Адрес проживания</Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Field.Root invalid={errors['address.region']}>
                <Field.Label>Регион</Field.Label>
                <Input 
                  name="address.region" 
                  value={formData.address.region}
                  onChange={handleChange}
                  placeholder="Московская область" 
                />
                <Field.ErrorText>{errors['address.region']}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={errors['address.city']}>
                <Field.Label>Город</Field.Label>
                <Input 
                  name="address.city" 
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="Москва" 
                />
                <Field.ErrorText>{errors['address.city']}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={errors['address.street']}>
                <Field.Label>Улица</Field.Label>
                <Input 
                  name="address.street" 
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Мясницская" 
                />
                <Field.ErrorText>{errors['address.street']}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={errors['address.house']}>
                <Field.Label>Дом</Field.Label>
                <Input 
                  name="address.house" 
                  value={formData.address.house}
                  onChange={handleChange}
                  placeholder="10" 
                />
                <Field.ErrorText>{errors['address.house']}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={errors['address.flat']}>
                <Field.Label>Квартира</Field.Label>
                <Input 
                  name="address.flat" 
                  value={formData.address.flat}
                  onChange={handleChange}
                  placeholder="1" 
                />
                <Field.ErrorText>{errors['address.flat']}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={errors['address.totalArea']}>
                <Field.Label>Площадь (м²)</Field.Label>
                <Input 
                  name="address.totalArea" 
                  value={formData.address.totalArea}
                  onChange={handleChange}
                  placeholder="100.1" 
                />
                <Field.ErrorText>{errors['address.totalArea']}</Field.ErrorText>
              </Field.Root>
            </SimpleGrid>
          </Box>

          <Button 
            type="submit" 
            colorScheme="teal" 
            isLoading={isLoading}
            loadingText="Регистрация..."
          >
            Зарегистрироваться
          </Button>
        </Fieldset.Content>

        <Box fontSize="sm" color="gray.400" textAlign="center">
          Уже есть аккаунт?{' '}
          <Button variant="link" colorScheme="teal" onClick={() => navigate('/auth/login')}>
            Войти
          </Button>
        </Box>
      </Fieldset.Root>
    </form>
  );
}