import { Box, Heading, Table, Badge, Button, Input, HStack, Text, Dialog, Portal, IconButton, VStack, Field } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import * as Buttons from "../../components/ui/buttons";
import { toaster } from '../../components/ui/toaster';
import api from '../../api/instance';

// ENUM для типов счётчиков (по документации)
const MeterTypes = {
  ColdWater: 'ХВС',
  HotWater: 'ГВС',
  Electricity: 'Электричество'
};

export default function UserMeters() {
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMeter, setEditingMeter] = useState(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newMeter, setNewMeter] = useState({
    name: '',
    value: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createErrors, setCreateErrors] = useState({});

  useEffect(() => {
    fetchMeters();
  }, []);

  const fetchMeters = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users/counters');
      setMeters(response.data);
    } catch (error) {
      console.error('Ошибка загрузки счётчиков:', error);
      toaster.create({
        title: 'Ошибка',
        description: 'Не удалось загрузить показания счётчиков',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (meter) => {
    setEditingMeter({ ...meter });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingMeter(null);
  };

  const handleConfirmEdit = async () => {
    if (!editingMeter) return;

    try {
      await api.put(`/api/users/counters/${editingMeter.id}`, {
        name: editingMeter.name,
        value: editingMeter.value
      });

      toaster.create({
        title: 'Успешно',
        description: 'Показания обновлены',
        type: 'success',
        duration: 3000,
      });

      await fetchMeters();
      setIsEditing(false);
      setEditingMeter(null);
    } catch (error) {
      console.error('Ошибка обновления:', error);
      toaster.create({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось обновить показания',
        type: 'error',
        duration: 3000,
      });
    }
  };

  const handleEditChange = (field, value) => {
    setEditingMeter(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewMeter(prev => ({ ...prev, [name]: value }));
    if (createErrors[name]) {
      setCreateErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateCreate = () => {
    const errors = {};
    if (!newMeter.name) errors.name = 'Выберите тип счётчика';
    if (!newMeter.value) errors.value = 'Введите показания';
    else if (isNaN(newMeter.value) || parseFloat(newMeter.value) <= 0) {
      errors.value = 'Введите корректное значение';
    }
    setCreateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSubmit = async () => {
    if (!validateCreate()) return;

    setIsCreating(true);
    try {
      await api.post('/api/users/counters', {
        name: newMeter.name,
        value: newMeter.value
      });

      toaster.create({
        title: 'Успешно',
        description: 'Показания переданы',
        type: 'success',
        duration: 3000,
      });

      await fetchMeters();
      setIsCreateModalOpen(false);
      setNewMeter({ name: '', value: '' });
    } catch (error) {
      console.error('Ошибка создания:', error);
      toaster.create({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось передать показания',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getMeterTypeText = (type) => {
    return MeterTypes[type] || type;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const getApprovedStatus = (isApproved) => {
    return isApproved ? 'Принято' : 'На проверке';
  };

  const getApprovedColor = (isApproved) => {
    return isApproved ? 'green' : 'yellow';
  };

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Text>Загрузка показаний...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Heading size="lg">Показания счётчиков</Heading>
        <Button 
          colorPalette="teal" 
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<FaPlus />}
        >
          Передать показания
        </Button>
      </HStack>
      
      {meters.length === 0 ? (
        <Box bg="white" p={8} rounded="lg" textAlign="center" shadow="sm">
          <Text color="gray.500">У вас пока нет переданных показаний</Text>
        </Box>
      ) : (
        <Table.Root bg="white" rounded="lg" shadow="sm" overflowX="auto">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Тип</Table.ColumnHeader>
              <Table.ColumnHeader>Показания</Table.ColumnHeader>
              <Table.ColumnHeader>Дата передачи</Table.ColumnHeader>
              <Table.ColumnHeader>Статус</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Действия</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {meters.map((meter) => (
              <Table.Row key={meter.id}>
                <Table.Cell>
                  {isEditing && editingMeter?.id === meter.id ? (
                    <select
                      value={editingMeter.name}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: 'white',
                        fontSize: '14px'
                      }}
                    >
                      {Object.entries(MeterTypes).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    getMeterTypeText(meter.name)
                  )}
                </Table.Cell>
                <Table.Cell>
                  {isEditing && editingMeter?.id === meter.id ? (
                    <Input
                      value={editingMeter.value}
                      onChange={(e) => handleEditChange('value', e.target.value)}
                      size="sm"
                      type="number"
                      step="0.1"
                      bg="white"
                    />
                  ) : (
                    meter.value
                  )}
                </Table.Cell>
                <Table.Cell>{formatDate(meter.createdAt)}</Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={getApprovedColor(meter.isApproved)}>
                    {getApprovedStatus(meter.isApproved)}
                  </Badge>
                </Table.Cell>
                <Table.Cell textAlign="end">
                  {isEditing && editingMeter?.id === meter.id ? (
                    <HStack gap={2} justify="flex-end">
                      <Buttons.PrimaryButton onClick={handleConfirmEdit}>
                        Сохранить
                      </Buttons.PrimaryButton>
                      <Buttons.DangerButton onClick={handleCancel}>
                        Отмена
                      </Buttons.DangerButton>
                    </HStack>
                  ) : (
                    <Buttons.PurpleButton onClick={() => handleEdit(meter)}>
                      Редактировать
                    </Buttons.PurpleButton>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}

      {/* Модальное окно для передачи показаний */}
      <Dialog.Root open={isCreateModalOpen} onOpenChange={() => setIsCreateModalOpen(false)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="400px">
              <Dialog.Header>
                <Dialog.Title>Передать показания</Dialog.Title>
                <Dialog.CloseTrigger as={IconButton} variant="ghost" size="sm">
                  <FaTimes />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <VStack align="stretch" gap={4}>
                  <Field.Root invalid={createErrors.name}>
                    <Field.Label>Тип счётчика</Field.Label>
                    <select
                      name="name"
                      value={newMeter.name}
                      onChange={handleCreateChange}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: 'white',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Выберите тип</option>
                      {Object.entries(MeterTypes).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <Field.ErrorText>{createErrors.name}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={createErrors.value}>
                    <Field.Label>Показания</Field.Label>
                    <Input
                      name="value"
                      type="number"
                      step="0.1"
                      value={newMeter.value}
                      onChange={handleCreateChange}
                      placeholder="0.0"
                      bg="white"
                    />
                    <Field.ErrorText>{createErrors.value}</Field.ErrorText>
                  </Field.Root>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Отмена
                </Button>
                <Buttons.PrimaryButton 
                  onClick={handleCreateSubmit} 
                  isLoading={isCreating}
                  loadingText="Отправка..."
                >
                  Передать
                </Buttons.PrimaryButton>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}