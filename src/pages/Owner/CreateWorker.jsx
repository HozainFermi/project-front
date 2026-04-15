import { Box, Heading, VStack, HStack, Text, Input, Button, Field, Card, SimpleGrid } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { toaster } from '../../components/ui/toaster';
import api from '../../api/instance';

export default function CreateWorker() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Введите имя';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Введите фамилию';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите телефон';
    }
    
    if (!formData.password) {
      newErrors.password = 'Введите пароль';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        password: formData.password,
        address: {
          region: formData.address.region,
          city: formData.address.city,
          street: formData.address.street,
          house: formData.address.house,
          flat: formData.address.flat,
          totalArea: formData.address.totalArea || '0'
        }
      };

      console.log('📤 Отправка создания работника:', payload);
      
      const response = await api.post('/api/service/workers', payload);
      console.log('✅ Ответ:', response.data);
      
      toaster.create({
        title: 'Успешно',
        description: 'Сотрудник создан',
        type: 'success',
        duration: 3000,
      });
      
      navigate('/owner/workers');
    } catch (error) {
      console.error('❌ Ошибка создания:', error);
      console.error('📡 Статус:', error.response?.status);
      console.error('📄 Ответ сервера:', error.response?.data);
      toaster.create({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось создать сотрудника',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      address: {
        region: '',
        city: '',
        street: '',
        house: '',
        flat: '',
        totalArea: ''
      }
    });
    setErrors({});
  };

  return (
    <Box maxW="600px" mx="auto">
      <Heading size="lg" mb={6}>Добавить сотрудника</Heading>

      <Card.Root>
        <Card.Header>
          <Heading size="md">Данные сотрудника</Heading>
          <Text fontSize="sm" color="gray.500">Заполните все обязательные поля</Text>
        </Card.Header>

        <Card.Body>
          <VStack align="stretch" gap={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Field.Root invalid={errors.lastName}>
                <Field.Label>Фамилия</Field.Label>
                <Input name="lastName" value={formData.lastName} onChange={handleChange} />
                <Field.ErrorText>{errors.lastName}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={errors.firstName}>
                <Field.Label>Имя</Field.Label>
                <Input name="firstName" value={formData.firstName} onChange={handleChange} />
                <Field.ErrorText>{errors.firstName}</Field.ErrorText>
              </Field.Root>
            </SimpleGrid>

            <Field.Root invalid={errors.email}>
              <Field.Label>Email</Field.Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} />
              <Field.ErrorText>{errors.email}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={errors.phone}>
              <Field.Label>Телефон</Field.Label>
              <Input name="phone" value={formData.phone} onChange={handleChange} />
              <Field.ErrorText>{errors.phone}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={errors.password}>
              <Field.Label>Пароль</Field.Label>
              <Input name="password" type="password" value={formData.password} onChange={handleChange} />
              <Field.ErrorText>{errors.password}</Field.ErrorText>
            </Field.Root>

            <Box>
              <Text fontWeight="bold" mb={2}>Адрес</Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Field.Root invalid={errors['address.city']}>
                  <Input name="address.city" value={formData.address.city} onChange={handleChange} placeholder="Город" />
                  <Field.ErrorText>{errors['address.city']}</Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={errors['address.street']}>
                  <Input name="address.street" value={formData.address.street} onChange={handleChange} placeholder="Улица" />
                  <Field.ErrorText>{errors['address.street']}</Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={errors['address.house']}>
                  <Input name="address.house" value={formData.address.house} onChange={handleChange} placeholder="Дом" />
                  <Field.ErrorText>{errors['address.house']}</Field.ErrorText>
                </Field.Root>
                <Input name="address.flat" value={formData.address.flat} onChange={handleChange} placeholder="Квартира" />
                <Input name="address.region" value={formData.address.region} onChange={handleChange} placeholder="Регион" />
                <Input name="address.totalArea" value={formData.address.totalArea} onChange={handleChange} placeholder="Площадь" />
              </SimpleGrid>
            </Box>
          </VStack>
        </Card.Body>

        <Card.Footer>
          <HStack spacing={3} justify="flex-end" width="full">
            <Button variant="outline" onClick={handleReset} isDisabled={isLoading} leftIcon={<FaTimes />}>
              Очистить
            </Button>
            <Button colorPalette="teal" onClick={handleSubmit} isLoading={isLoading} loadingText="Создание..." leftIcon={<FaCheck />}>
              Создать
            </Button>
          </HStack>
        </Card.Footer>
      </Card.Root>
    </Box>
  );
}