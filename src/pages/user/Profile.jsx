// pages/UserProfile.jsx
import { useState } from 'react';
import { 
  Box, 
  Heading, 
  VStack, 
  HStack, 
  Text, 
  Input, 
  Button,
  Field,
  Card,
  SimpleGrid,
  Badge
} from '@chakra-ui/react';
import { toaster } from "../../components/ui/toaster";
import { 
  FaUser,
  FaPhone,
  FaEnvelope,
  FaPencilAlt,
  FaCheck,
  FaTimes,
  FaMapMarkerAlt,
  FaHome,
  FaBuilding
} from 'react-icons/fa';

// Импортируем вынесенный компонент
import YandexMap from '../../components/ui/YandexMap'; // Путь может отличаться в зависимости от вашей структуры

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Иван',
    lastName: 'Иванов',
    patronymic: 'Иванович',
    phone: '+7 (999) 000-00-00',
    email: 'ivanov@example.com',
    address: 'г. Город, ул. Примерная, д. 1, кв. 1',
    flatNumber: '1',
    buildingNumber: '1',
    street: 'ул. Примерная',
    city: 'Город'
  });
  
  const [originalData, setOriginalData] = useState({ ...formData });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // ... остальной код без изменений
  const showToast = (title, description, type = 'info') => {
    toaster.create({
      title,
      description,
      type,
      duration: 3000,
      closable: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAddressSelect = (addressData) => {
    setFormData(prev => ({ 
      ...prev, 
      address: addressData.address,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен';
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Неверный формат телефона';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Адрес обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      showToast('Ошибка валидации', 'Проверьте правильность заполнения полей', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOriginalData({ ...formData });
      setIsEditing(false);
      
      showToast('Успешно', 'Данные профиля обновлены', 'success');
    } catch (error) {
      showToast('Ошибка', 'Не удалось сохранить изменения', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
    setErrors({});
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Heading size="lg"color="black">Профиль жильца</Heading>
        {!isEditing ? (
          <Button 
            colorPalette="teal"
            color="#646cff"
            variant="outline"
            onClick={handleEdit}
          >
            Редактировать
          </Button>
        ) : null}
      </HStack>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Левая колонка - основная информация */}
        <Card.Root>
          <Card.Header>
            <HStack justify="space-between">
              <Text fontWeight="bold" fontSize="lg">
                Личная информация
              </Text>
              {isEditing && (
                <Badge colorScheme="green">Режим редактирования</Badge>
              )}
            </HStack>
          </Card.Header>
          
          <Card.Body>
            <VStack spacing={4} align="stretch">
              {/* ФИО */}
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Field.Root invalid={errors.lastName}>
                  <Field.Label>
                    <HStack spacing={1}>
                      <FaUser />
                      <Text>Фамилия</Text>
                    </HStack>
                  </Field.Label>
                  {isEditing ? (
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Фамилия"
                    />
                  ) : (
                    <Text p={2} bg="gray.50" borderRadius="md">
                      {formData.lastName}
                    </Text>
                  )}
                  <Field.ErrorText>{errors.lastName}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={errors.firstName}>
                  <Field.Label>
                    <HStack spacing={1}>
                      <FaUser />
                      <Text>Имя</Text>
                    </HStack>
                  </Field.Label>
                  {isEditing ? (
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Имя"
                    />
                  ) : (
                    <Text p={2} bg="gray.50" borderRadius="md">
                      {formData.firstName}
                    </Text>
                  )}
                  <Field.ErrorText>{errors.firstName}</Field.ErrorText>
                </Field.Root>

                <Field.Root>
                  <Field.Label>
                    <HStack spacing={1}>
                      <FaUser />
                      <Text>Отчество</Text>
                    </HStack>
                  </Field.Label>
                  {isEditing ? (
                    <Input
                      name="patronymic"
                      value={formData.patronymic}
                      onChange={handleInputChange}
                      placeholder="Отчество"
                    />
                  ) : (
                    <Text p={2} bg="gray.50" borderRadius="md">
                      {formData.patronymic || '—'}
                    </Text>
                  )}
                </Field.Root>
              </SimpleGrid>

              {/* Контактная информация */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Field.Root invalid={errors.phone}>
                  <Field.Label>
                    <HStack spacing={1}>
                      <FaPhone />
                      <Text>Телефон</Text>
                    </HStack>
                  </Field.Label>
                  {isEditing ? (
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+7 (999) 000-00-00"
                    />
                  ) : (
                    <Text p={2} bg="gray.50" borderRadius="md">
                      {formData.phone}
                    </Text>
                  )}
                  <Field.ErrorText>{errors.phone}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={errors.email}>
                  <Field.Label>
                    <HStack spacing={1}>
                      <FaEnvelope />
                      <Text>Email</Text>
                    </HStack>
                  </Field.Label>
                  {isEditing ? (
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                      type="email"
                    />
                  ) : (
                    <Text p={2} bg="gray.50" borderRadius="md">
                      {formData.email}
                    </Text>
                  )}
                  <Field.ErrorText>{errors.email}</Field.ErrorText>
                </Field.Root>
              </SimpleGrid>

              <Box borderBottom="1px solid" borderColor="gray.200" my={2} />

              <Field.Root>
                <Field.Label>Роль</Field.Label>
                <Text p={2} bg="gray.50" borderRadius="md" fontWeight="bold">
                  Жилец
                </Text>
              </Field.Root>
            </VStack>
          </Card.Body>

          {isEditing && (
            <Card.Footer>
              <HStack spacing={3} justify="flex-end" width="full">
                <Button
                  leftIcon={<FaTimes />}
                  variant="ghost"
                  onClick={handleCancel}
                  isDisabled={isLoading}
                >
                  Отмена
                </Button>
                <Button
                  leftIcon={<FaCheck />}

            colorPalette="teal"
            color="#646cff"
            variant="outline"
            onClick={handleSave}
            isLoading={isLoading}
            loadingText="Сохранение"
                >
                  Сохранить изменения
                </Button>
              </HStack>
            </Card.Footer>
          )}
        </Card.Root>

        {/* Правая колонка - адрес и карты */}
        <Card.Root>
          <Card.Header>
            <Text fontWeight="bold" fontSize="lg">
              Адрес проживания
            </Text>
          </Card.Header>
          
          <Card.Body>
            <VStack spacing={4} align="stretch">
              <Field.Root invalid={errors.address}>
                <Field.Label>
                  <HStack spacing={1}>
                    <FaMapMarkerAlt />
                    <Text>Адрес</Text>
                  </HStack>
                </Field.Label>
                {isEditing ? (
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Полный адрес"
                  />
                ) : (
                  <Text p={2} bg="gray.50" borderRadius="md">
                    {formData.address}
                  </Text>
                )}
                <Field.ErrorText>{errors.address}</Field.ErrorText>
              </Field.Root>

              <Box>
                <Text fontWeight="medium" mb={2}>Выберите адрес на карте</Text>
                <YandexMap 
                  address={formData.address} 
                  onAddressSelect={handleAddressSelect}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Нажмите на карте или найдите адрес через поиск
                </Text>
              </Box>

              <SimpleGrid columns={2} spacing={4} mt={2}>
                <Box>
                  <HStack spacing={1} color="gray.600" mb={1}>
                    <FaBuilding />
                    <Text fontSize="sm">Квартира</Text>
                  </HStack>
                  <Text fontWeight="medium">{formData.flatNumber}</Text>
                </Box>
                <Box>
                  <HStack spacing={1} color="gray.600" mb={1}>
                    <FaHome />
                    <Text fontSize="sm">Дом</Text>
                  </HStack>
                  <Text fontWeight="medium">{formData.buildingNumber}</Text>
                </Box>
              </SimpleGrid>
            </VStack>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>
    </Box>
  );
}