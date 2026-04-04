import { useState, useEffect } from 'react';
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
import * as Buttons from "../../components/ui/buttons";
import { toaster } from "../../components/ui/toaster";
import { 
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaMapMarkerAlt,
  FaHome,
  FaBuilding,
  FaCity,
  FaMap
} from 'react-icons/fa';
import YandexMap from '../../components/ui/YandexMap';
import api from '../../api/instance';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    patronymic: '',
    phone: '',
    email: '',
    region: '',
    city: '',
    street: '',
    buildingNumber: '',
    flatNumber: '',
    totalArea: '',
    role: ''
  });
  
  const [originalData, setOriginalData] = useState({ ...formData });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Загрузка данных профиля
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users/profile');
      const user = response.data;
      
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        patronymic: user.middleName || '',
        phone: user.phone || '',
        email: user.email || '',
        region: user.address?.region || '',
        city: user.address?.city || '',
        street: user.address?.street || '',
        buildingNumber: user.address?.house || '',
        flatNumber: user.address?.flat || '',
        totalArea: user.address?.totalArea || '',
        role: user.role || 'User'
      });
      
      setOriginalData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        patronymic: user.middleName || '',
        phone: user.phone || '',
        email: user.email || '',
        region: user.address?.region || '',
        city: user.address?.city || '',
        street: user.address?.street || '',
        buildingNumber: user.address?.house || '',
        flatNumber: user.address?.flat || '',
        totalArea: user.address?.totalArea || '',
        role: user.role || 'User'
      });
      
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
      showToast('Ошибка', 'Не удалось загрузить данные профиля', 'error');
    } finally {
      setLoading(false);
    }
  };

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
      city: addressData.city || prev.city,
      street: addressData.street || prev.street,
      buildingNumber: addressData.house || prev.buildingNumber,
      flatNumber: addressData.flat || prev.flatNumber
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна';
    } else if (!/^[A-Za-zА-Яа-яЁё\-]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Только буквы и дефис';
    } else if (formData.lastName.length > 64) {
      newErrors.lastName = 'Не более 64 символов';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно';
    } else if (!/^[A-Za-zА-Яа-яЁё\-]+$/.test(formData.firstName)) {
      newErrors.firstName = 'Только буквы и дефис';
    } else if (formData.firstName.length > 64) {
      newErrors.firstName = 'Не более 64 символов';
    }
    
    if (formData.patronymic.trim() && !/^[A-Za-zА-Яа-яЁё\-]+$/.test(formData.patronymic)) {
      newErrors.patronymic = 'Только буквы и дефис';
    } else if (formData.patronymic.length > 64) {
      newErrors.patronymic = 'Не более 64 символов';
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
    
    if (!formData.city.trim()) {
      newErrors.city = 'Город обязателен';
    }
    
    if (!formData.street.trim()) {
      newErrors.street = 'Улица обязательна';
    }
    
    if (!formData.buildingNumber.trim()) {
      newErrors.buildingNumber = 'Номер дома обязателен';
    } else if (!/^\d+[а-яА-Я]?$/.test(formData.buildingNumber)) {
      newErrors.buildingNumber = 'Только цифры и буква (например: 15 или 15А)';
    }
    
    if (!formData.flatNumber.trim()) {
      newErrors.flatNumber = 'Номер квартиры обязателен';
    } else if (!/^\d+$/.test(formData.flatNumber)) {
      newErrors.flatNumber = 'Только цифры';
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
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.patronymic || null,
        phone: formData.phone,
        email: formData.email,
        address: {
          region: formData.region || null,
          city: formData.city,
          street: formData.street,
          house: formData.buildingNumber,
          flat: formData.flatNumber,
          totalArea: formData.totalArea || null
        }
      };

      console.log('Отправляем:', payload);

      await api.put('/api/users/profile', payload);
      
      await fetchProfile();
      setIsEditing(false);
      
      showToast('Успешно', 'Данные профиля обновлены', 'success');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      console.error('Статус:', error.response?.status);
      console.error('Ответ сервера:', error.response?.data);
      showToast('Ошибка', error.response?.data?.message || 'Не удалось сохранить изменения', 'error');
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

  const getRoleText = (role) => {
    switch(role) {
      case 'User': return 'Жилец';
      case 'Worker': return 'Сотрудник';
      case 'Admin': return 'Администратор';
      case 'CompanyOwner': return 'Владелец компании';
      default: return 'Жилец';
    }
  };

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Text>Загрузка профиля...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Heading size="lg" color="black">Профиль жильца</Heading>
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
                  {getRoleText(formData.role)}
                </Text>
              </Field.Root>
            </VStack>
          </Card.Body>

          {isEditing && (
            <Card.Footer>
              <HStack spacing={3} justify="flex-end" width="full">
                <Button
                  colorPalette="teal"
                  color="#646cff"
                  variant="outline"
                  isLoading={isLoading}
                  loadingText="Сохранение"
                  leftIcon={<FaTimes />}
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

        {/* Правая колонка - адрес */}
        <Card.Root>
          <Card.Header>
            <Text fontWeight="bold" fontSize="lg">
              Адрес проживания
            </Text>
          </Card.Header>
          
          <Card.Body>
            <VStack spacing={4} align="stretch">
              {/* Регион */}
              <Field.Root>
                <Field.Label>
                  <HStack spacing={1}>
                    <FaMap />
                    <Text>Регион</Text>
                  </HStack>
                </Field.Label>
                {isEditing ? (
                  <Input
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    placeholder="Московская область"
                  />
                ) : (
                  <Text p={2} bg="gray.50" borderRadius="md">
                    {formData.region || '—'}
                  </Text>
                )}
              </Field.Root>

              {/* Город */}
              <Field.Root invalid={errors.city}>
                <Field.Label>
                  <HStack spacing={1}>
                    <FaCity />
                    <Text>Город</Text>
                  </HStack>
                </Field.Label>
                {isEditing ? (
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Москва"
                  />
                ) : (
                  <Text p={2} bg="gray.50" borderRadius="md">
                    {formData.city || '—'}
                  </Text>
                )}
                <Field.ErrorText>{errors.city}</Field.ErrorText>
              </Field.Root>

              {/* Улица */}
              <Field.Root invalid={errors.street}>
                <Field.Label>
                  <HStack spacing={1}>
                    <FaMapMarkerAlt />
                    <Text>Улица</Text>
                  </HStack>
                </Field.Label>
                {isEditing ? (
                  <Input
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="Тверская"
                  />
                ) : (
                  <Text p={2} bg="gray.50" borderRadius="md">
                    {formData.street || '—'}
                  </Text>
                )}
                <Field.ErrorText>{errors.street}</Field.ErrorText>
              </Field.Root>

              {/* Дом и Квартира */}
              <SimpleGrid columns={2} spacing={4}>
                <Field.Root invalid={errors.buildingNumber}>
                  <Field.Label>
                    <HStack spacing={1}>
                      <FaHome />
                      <Text>Дом</Text>
                    </HStack>
                  </Field.Label>
                  {isEditing ? (
                    <Input
                      name="buildingNumber"
                      value={formData.buildingNumber}
                      onChange={handleInputChange}
                      placeholder="10"
                    />
                  ) : (
                    <Text p={2} bg="gray.50" borderRadius="md">
                      {formData.buildingNumber || '—'}
                    </Text>
                  )}
                  <Field.ErrorText>{errors.buildingNumber}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={errors.flatNumber}>
                  <Field.Label>
                    <HStack spacing={1}>
                      <FaBuilding />
                      <Text>Квартира</Text>
                    </HStack>
                  </Field.Label>
                  {isEditing ? (
                    <Input
                      name="flatNumber"
                      value={formData.flatNumber}
                      onChange={handleInputChange}
                      placeholder="5"
                    />
                  ) : (
                    <Text p={2} bg="gray.50" borderRadius="md">
                      {formData.flatNumber || '—'}
                    </Text>
                  )}
                  <Field.ErrorText>{errors.flatNumber}</Field.ErrorText>
                </Field.Root>
              </SimpleGrid>

              {/* Площадь */}
              <Field.Root>
                <Field.Label>Площадь (м²)</Field.Label>
                {isEditing ? (
                  <Input
                    name="totalArea"
                    value={formData.totalArea}
                    onChange={handleInputChange}
                    placeholder="65.5"
                  />
                ) : (
                  <Text p={2} bg="gray.50" borderRadius="md">
                    {formData.totalArea || '—'}
                  </Text>
                )}
              </Field.Root>

              <Box>
                <Text fontWeight="medium" mb={2}>Выберите адрес на карте</Text>
                <YandexMap 
                  address={`${formData.city}, ${formData.street}, ${formData.buildingNumber}, ${formData.flatNumber}`}
                  onAddressSelect={handleAddressSelect}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Нажмите на карте или найдите адрес через поиск
                </Text>
              </Box>
            </VStack>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>
    </Box>
  );
}