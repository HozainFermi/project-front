import { Box, Heading, Stack, Text, Button, HStack, Table, Dialog, Portal, IconButton, Input, Field, VStack, SimpleGrid } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { toaster } from '../../components/ui/toaster';
import api from '../../api/instance';

export default function CompanyProfile() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    inn: '',
    kpp: '',
    email: '',
    description: '',
    address: {
      region: '',
      city: '',
      street: '',
      house: '',
      flat: '',
      totalArea: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      // ✅ НОВЫЙ ЭНДПОИНТ — получаем все компании
      const response = await api.get('/api/service/company_profile');
      setCompanies(response.data);
    } catch (error) {
      console.error('Ошибка загрузки компаний:', error);
      if (error.response?.status === 403) {
        toaster.create({
          title: 'Доступ запрещён',
          description: 'Только администратор может просматривать список компаний',
          type: 'error',
          duration: 3000,
        });
      } else {
        toaster.create({
          title: 'Ошибка',
          description: 'Не удалось загрузить список компаний',
          type: 'error',
          duration: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedCompany(null);
    setFormData({
      companyName: '',
      inn: '',
      kpp: '',
      email: '',
      description: '',
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
    setIsModalOpen(true);
  };

  const handleOpenEdit = (company) => {
    setIsEditing(true);
    setSelectedCompany(company);
    setFormData({
      companyName: company.companyName,
      inn: company.inn,
      kpp: company.kpp || '',
      email: company.email,
      description: company.descriprion || '',
      address: {
        region: company.address?.region || '',
        city: company.address?.city || '',
        street: company.address?.street || '',
        house: company.address?.house || '',
        flat: company.address?.flat || '',
        totalArea: company.address?.totalArea || ''
      }
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Удалить компанию "${name}"? Это действие необратимо!`);
    if (!confirmed) return;
    
    try {
      // TODO: если есть эндпоинт для удаления, заменить
      setCompanies(prev => prev.filter(c => c.id !== id));
      toaster.create({
        title: 'Успешно',
        description: `Компания "${name}" удалена`,
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      toaster.create({
        title: 'Ошибка',
        description: 'Не удалось удалить компанию',
        type: 'error',
        duration: 3000,
      });
    }
  };

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
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Название компании обязательно';
    } else if (formData.companyName.length < 3) {
      newErrors.companyName = 'Название должно содержать минимум 3 символа';
    } else if (formData.companyName.length > 100) {
      newErrors.companyName = 'Название не должно превышать 100 символов';
    }
    
    if (!formData.inn.trim()) {
      newErrors.inn = 'ИНН обязателен';
    } else if (!/^\d{10,12}$/.test(formData.inn)) {
      newErrors.inn = 'ИНН должен содержать 10-12 цифр';
    }
    
    if (formData.kpp && !/^\d{9}$/.test(formData.kpp)) {
      newErrors.kpp = 'КПП должен содержать 9 цифр';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }
    
    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'Город обязателен';
    }
    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Улица обязательна';
    }
    if (!formData.address.house.trim()) {
      newErrors['address.house'] = 'Номер дома обязателен';
    }
    
    if (formData.address.totalArea && (isNaN(formData.address.totalArea) || parseFloat(formData.address.totalArea) <= 0)) {
      newErrors['address.totalArea'] = 'Площадь должна быть положительным числом';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toaster.create({
        title: 'Ошибка валидации',
        description: 'Проверьте правильность заполнения полей',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        companyName: formData.companyName,
        inn: formData.inn,
        kpp: formData.kpp,
        email: formData.email,
        descriprion: formData.description,
        address: {
          region: formData.address.region,
          city: formData.address.city,
          street: formData.address.street,
          house: formData.address.house,
          flat: formData.address.flat,
          totalArea: parseFloat(formData.address.totalArea) || 0
        }
      };

      if (isEditing) {
        // TODO: если есть эндпоинт для обновления, заменить
        setCompanies(prev => prev.map(c => 
          c.id === selectedCompany.id ? { ...c, ...payload } : c
        ));
        toaster.create({
          title: 'Успешно',
          description: 'Компания обновлена',
          type: 'success',
          duration: 3000,
        });
      } else {
        const response = await api.post('/api/service/company_profile/register', payload);
        
        // Обновляем список после создания
        await fetchCompanies();
        
        toaster.create({
          title: 'Успешно',
          description: response.data.message || 'Компания создана',
          type: 'success',
          duration: 3000,
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Ошибка:', error);
      toaster.create({
        title: 'Ошибка',
        description: error.response?.data?.message || (isEditing ? 'Не удалось обновить компанию' : 'Не удалось создать компанию'),
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '—';
    const parts = [];
    if (address.city) parts.push(`г. ${address.city}`);
    if (address.street) parts.push(`ул. ${address.street}`);
    if (address.house) parts.push(`д. ${address.house}`);
    if (address.flat) parts.push(`кв. ${address.flat}`);
    return parts.join(', ') || '—';
  };

  if (loading) {
    return <Box p={8} textAlign="center">Загрузка...</Box>;
  }

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Управляющие компании</Heading>
        <Button 
          colorPalette="teal" 
          onClick={handleOpenCreate}
          leftIcon={<FaPlus />}
        >
          Добавить компанию
        </Button>
      </HStack>

      <Table.Root bg="white" rounded="lg" shadow="sm" overflowX="auto">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Название</Table.ColumnHeader>
            <Table.ColumnHeader>ИНН</Table.ColumnHeader>
            <Table.ColumnHeader>КПП</Table.ColumnHeader>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Адрес</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          {companies.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={6} textAlign="center">
                <Text py={4} color="gray.500">Нет компаний</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            companies.map((company) => (
              <Table.Row key={company.id}>
                <Table.Cell>{company.companyName}</Table.Cell>
                <Table.Cell>{company.inn}</Table.Cell>
                <Table.Cell>{company.kpp || '—'}</Table.Cell>
                <Table.Cell>{company.email}</Table.Cell>
                <Table.Cell>{formatAddress(company.address)}</Table.Cell>
                <Table.Cell textAlign="end">
                  <HStack gap={2} justify="flex-end">
                    <IconButton
                      size="sm"
                      variant="ghost"
                      colorPalette="blue"
                      onClick={() => handleOpenEdit(company)}
                    >
                      <FaEdit />
                    </IconButton>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      colorPalette="red"
                      onClick={() => handleDelete(company.id, company.companyName)}
                    >
                      <FaTrash />
                    </IconButton>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {/* Модальное окно для создания/редактирования */}
      <Dialog.Root open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="600px">
              <Dialog.Header>
                <Dialog.Title>
                  {isEditing ? 'Редактировать компанию' : 'Новая компания'}
                </Dialog.Title>
                <Dialog.CloseTrigger as={IconButton} variant="ghost" size="sm">
                  <FaTimes />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <VStack align="stretch" gap={4}>
                  <Field.Root invalid={errors.companyName}>
                    <Field.Label>Название компании <Text as="span" color="red.500">*</Text></Field.Label>
                    <Input
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="ООО УК Ромашка"
                    />
                    <Field.ErrorText>{errors.companyName}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={errors.inn}>
                    <Field.Label>ИНН <Text as="span" color="red.500">*</Text></Field.Label>
                    <Input
                      name="inn"
                      value={formData.inn}
                      onChange={handleChange}
                      maxLength={12}
                      placeholder="1234567890"
                    />
                    <Field.ErrorText>{errors.inn}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={errors.kpp}>
                    <Field.Label>КПП</Field.Label>
                    <Input
                      name="kpp"
                      value={formData.kpp}
                      onChange={handleChange}
                      maxLength={9}
                      placeholder="123456789"
                    />
                    <Field.ErrorText>{errors.kpp}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={errors.email}>
                    <Field.Label>Email <Text as="span" color="red.500">*</Text></Field.Label>
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="info@example.com"
                    />
                    <Field.ErrorText>{errors.email}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Описание</Field.Label>
                    <Input
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Краткое описание компании"
                    />
                  </Field.Root>

                  <Box>
                    <Text fontWeight="bold" mb={2}>Адрес</Text>
                    <SimpleGrid columns={2} gap={3}>
                      <Input
                        name="address.region"
                        value={formData.address.region}
                        onChange={handleChange}
                        placeholder="Регион/Область"
                      />
                      <Field.Root invalid={errors['address.city']}>
                        <Input
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          placeholder="Город *"
                        />
                        <Field.ErrorText>{errors['address.city']}</Field.ErrorText>
                      </Field.Root>
                      <Field.Root invalid={errors['address.street']}>
                        <Input
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleChange}
                          placeholder="Улица *"
                        />
                        <Field.ErrorText>{errors['address.street']}</Field.ErrorText>
                      </Field.Root>
                      <Field.Root invalid={errors['address.house']}>
                        <Input
                          name="address.house"
                          value={formData.address.house}
                          onChange={handleChange}
                          placeholder="Дом *"
                        />
                        <Field.ErrorText>{errors['address.house']}</Field.ErrorText>
                      </Field.Root>
                      <Input
                        name="address.flat"
                        value={formData.address.flat}
                        onChange={handleChange}
                        placeholder="Квартира/Офис"
                      />
                      <Field.Root invalid={errors['address.totalArea']}>
                        <Input
                          name="address.totalArea"
                          value={formData.address.totalArea}
                          onChange={handleChange}
                        />
                        <Field.ErrorText>{errors['address.totalArea']}</Field.ErrorText>
                      </Field.Root>
                    </SimpleGrid>
                  </Box>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Отмена
                </Button>
                <Button 
                  colorPalette="teal" 
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  loadingText={isEditing ? "Сохранение..." : "Создание..."}
                >
                  {isEditing ? 'Сохранить' : 'Создать'}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}