import { 
  Box, Heading, Table, Badge, Button, Input, HStack, Text, 
  VStack, Textarea, Dialog, Portal, IconButton 
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import * as Buttons from "../../components/ui/buttons";
import api from '../../api/instance';
import { toaster } from "../../components/ui/toaster";

export default function UserRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Состояния для модального окна деталей
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Состояния для модального окна создания заявки
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users/requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
      toaster.create({
        title: 'Ошибка',
        description: 'Не удалось загрузить заявки',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (status) => {
    switch(status) {
      case 'Completed': return 'green';
      case 'Rejected': return 'red';
      case 'InProgress': return 'yellow';
      case 'Accepted': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'Completed': return 'Выполнена';
      case 'Rejected': return 'Отклонена';
      case 'InProgress': return 'В работе';
      case 'Accepted': return 'Принята';
      default: return 'Создана';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const handleOpenDetails = (request) => {
    setSelectedRequest(request);
    setEditForm({
      title: request.title,
      description: request.description || ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    if (!selectedRequest) return;
    
    setIsSubmitting(true);
    try {
      await api.put(`/api/users/requests/${selectedRequest.id}`, {
        title: editForm.title,
        description: editForm.description
      });
      
      setRequests(prev => prev.map(req =>
        req.id === selectedRequest.id
          ? { ...req, title: editForm.title, description: editForm.description }
          : req
      ));
      setSelectedRequest(prev => ({
        ...prev,
        title: editForm.title,
        description: editForm.description
      }));
      
      toaster.create({
        title: 'Успешно',
        description: 'Заявка обновлена',
        type: 'success',
        duration: 3000,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      toaster.create({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось сохранить изменения',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функция удаления заявки
  const handleDelete = async () => {
    if (!selectedRequest) return;
    
    const confirmed = window.confirm(`Удалить заявку #${selectedRequest.id}? Это действие необратимо.`);
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await api.delete(`/api/users/requests/${selectedRequest.id}`);
      
      // Удаляем из локального списка
      setRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
      
      toaster.create({
        title: 'Успешно',
        description: 'Заявка удалена',
        type: 'success',
        duration: 3000,
      });
      
      handleCloseModal();
    } catch (error) {
      console.error('Ошибка удаления:', error);
      toaster.create({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось удалить заявку',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async () => {
    if (!createForm.title.trim()) {
      toaster.create({
        title: 'Ошибка',
        description: 'Введите тему заявки',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await api.post('/api/users/requests', {
        title: createForm.title,
        description: createForm.description || ''
      });
      
      setRequests(prev => [response.data, ...prev]);
      
      toaster.create({
        title: 'Успешно',
        description: 'Заявка создана',
        type: 'success',
        duration: 3000,
      });
      
      setIsCreateModalOpen(false);
      setCreateForm({ title: '', description: '' });
    } catch (error) {
      console.error('Ошибка создания заявки:', error);
      toaster.create({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось создать заявку',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Text>Загрузка заявок...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Heading size="lg">Мои заявки</Heading>
        <Buttons.PurpleButton onClick={() => setIsCreateModalOpen(true)}>
          + Новая заявка
        </Buttons.PurpleButton>
      </HStack>
      
      <Table.Root bg="white" rounded="lg" shadow="sm" overflowX="auto">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>№</Table.ColumnHeader>
            <Table.ColumnHeader>Тема</Table.ColumnHeader>
            <Table.ColumnHeader>Описание</Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader>Дата</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          {requests.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={6} textAlign="center">
                <Text py={4} color="gray.500">У вас пока нет заявок</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            requests.map((request) => (
              <Table.Row key={request.id}>
                <Table.Cell>{request.id}</Table.Cell>
                <Table.Cell>{request.title}</Table.Cell>
                <Table.Cell>
                  <Text noOfLines={1} maxW="250px">
                    {request.description || '—'}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={getBadgeColor(request.status)}>
                    {getStatusText(request.status)}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{formatDate(request.createdAt || request.date)}</Table.Cell>
                <Table.Cell textAlign="end">
                  <Buttons.PurpleButton 
                    size="sm" 
                    onClick={() => handleOpenDetails(request)}
                  >
                    Открыть
                  </Buttons.PurpleButton>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {/* Модальное окно создания заявки */}
      <Dialog.Root open={isCreateModalOpen} onOpenChange={() => setIsCreateModalOpen(false)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Новая заявка</Dialog.Title>
                <Dialog.CloseTrigger as={IconButton} variant="ghost" size="sm">
                  <FaTimes />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <VStack align="stretch" gap={4}>
                  <Box>
                    <Text fontWeight="bold" mb={1}>Тема</Text>
                    <Input
                      name="title"
                      value={createForm.title}
                      onChange={handleCreateChange}
                      placeholder="Краткое описание проблемы"
                    />
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={1}>Описание</Text>
                    <Textarea
                      name="description"
                      value={createForm.description}
                      onChange={handleCreateChange}
                      placeholder="Подробное описание проблемы"
                      rows={4}
                    />
                  </Box>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <HStack gap={3}>
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Отмена
                  </Button>
                  <Buttons.PrimaryButton 
                    onClick={handleCreateSubmit} 
                    isLoading={isCreating}
                    loadingText="Создание..."
                  >
                    Создать
                  </Buttons.PrimaryButton>
                </HStack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Модальное окно деталей заявки */}
      <Dialog.Root open={isModalOpen} onOpenChange={handleCloseModal}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Заявка #{selectedRequest?.id}</Dialog.Title>
                <Dialog.CloseTrigger as={IconButton} variant="ghost" size="sm">
                  <FaTimes />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <VStack align="stretch" gap={4}>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Тема</Text>
                    {isEditing ? (
                      <Input
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        size="sm"
                        mt={1}
                      />
                    ) : (
                      <Text mt={1}>{selectedRequest?.title}</Text>
                    )}
                  </Box>

                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Описание</Text>
                    {isEditing ? (
                      <Textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        size="sm"
                        rows={4}
                        mt={1}
                      />
                    ) : (
                      <Text mt={1} whiteSpace="pre-wrap">
                        {selectedRequest?.description || 'Нет описания'}
                      </Text>
                    )}
                  </Box>

                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Статус</Text>
                    <Badge colorPalette={getBadgeColor(selectedRequest?.status)} mt={1}>
                      {getStatusText(selectedRequest?.status)}
                    </Badge>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Дата создания</Text>
                    <Text mt={1}>{formatDate(selectedRequest?.createdAt || selectedRequest?.date)}</Text>
                  </Box>

                  {selectedRequest?.assigneeName && (
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.500">Исполнитель</Text>
                      <Text mt={1}>{selectedRequest.assigneeName}</Text>
                    </Box>
                  )}
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <HStack gap={3} justify="space-between" width="full">
                  <Button 
                    colorPalette="red" 
                    variant="outline" 
                    leftIcon={<FaTrash />}
                    onClick={handleDelete}
                    isLoading={isDeleting}
                    loadingText="Удаление..."
                  >
                    Удалить
                  </Button>
                  <HStack gap={3}>
                    {!isEditing ? (
                      <>
                        <Button variant="outline" onClick={handleCloseModal}>
                          Закрыть
                        </Button>
                        <Buttons.PurpleButton onClick={handleEdit}>
                          Редактировать
                        </Buttons.PurpleButton>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Отмена
                        </Button>
                        <Buttons.PrimaryButton 
                          onClick={handleSaveEdit} 
                          isLoading={isSubmitting}
                          loadingText="Сохранение"
                        >
                          Сохранить
                        </Buttons.PrimaryButton>
                      </>
                    )}
                  </HStack>
                </HStack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}