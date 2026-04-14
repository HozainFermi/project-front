import { 
  Box, 
  Heading, 
  Table, 
  Badge, 
  Button, 
  HStack, 
  Text, 
  VStack,
  Dialog,
  Portal,
  IconButton
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import api from '../../api/instance';
import { toaster } from '../../components/ui/toaster';

export default function WorkerRequests() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (location.state?.updatedRequest) {
      const updated = location.state.updatedRequest;
      setRequests(prev => 
        prev.map(req => req.id === updated.id ? updated : req)
      );
    }
  }, [location.state]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // ✅ GET /api/service/requests — получает заявки в зависимости от роли
      const response = await api.get('/api/service/requests');
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
    setNewStatus(request.status);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    setNewStatus('');
  };

const handleStatusChange = async () => {
  if (!selectedRequest || newStatus === selectedRequest.status) return;
  
  setIsUpdatingStatus(true);
  try {
    await api.put(`/api/service/requests/${selectedRequest.id}/status`, newStatus, {
      headers: { 'Content-Type': 'text/plain' }
    });
    
    const updatedRequest = { ...selectedRequest, status: newStatus };
    setRequests(prev => 
      prev.map(req => req.id === updatedRequest.id ? updatedRequest : req)
    );
    setSelectedRequest(updatedRequest);
    
    toaster.create({
      title: 'Успешно',
      description: `Статус изменён на "${getStatusText(newStatus)}"`,
      type: 'success',
      duration: 3000,
    });
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    toaster.create({
      title: 'Ошибка',
      description: error.response?.data?.message || 'Не удалось изменить статус',
      type: 'error',
      duration: 3000,
    });
  } finally {
    setIsUpdatingStatus(false);
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
        <Heading size="lg">Заявки</Heading>
      </HStack>
      
      <Table.Root bg="white" rounded="lg" shadow="sm" overflowX="auto">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>№</Table.ColumnHeader>
            <Table.ColumnHeader>Заявитель</Table.ColumnHeader>
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
              <Table.Cell colSpan={7} textAlign="center">
                <Text py={4} color="gray.500">Нет заявок</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            requests.map((request) => (
              <Table.Row key={request.id}>
                <Table.Cell>{request.id}</Table.Cell>
                <Table.Cell>{request.creator}</Table.Cell>
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
                <Table.Cell>{formatDate(request.createdAt)}</Table.Cell>
                <Table.Cell textAlign="end">
                  <Button 
                    size="sm"
                    colorPalette="teal"
                    color="black"
                    onClick={() => handleOpenDetails(request)}
                  >
                    Открыть
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {/* Диалоговое окно с деталями заявки */}
      <Dialog.Root open={isModalOpen} onOpenChange={handleCloseModal}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="500px">
              <Dialog.Header>
                <Dialog.Title>Заявка #{selectedRequest?.id}</Dialog.Title>
                <Dialog.CloseTrigger as={IconButton} variant="ghost" size="sm">
                  <FaTimes />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <VStack align="stretch" gap={4}>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Заявитель</Text>
                    <Text>{selectedRequest?.creator}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Исполнитель</Text>
                    <Text>{selectedRequest?.assigner || 'Не назначен'}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Тема</Text>
                    <Text>{selectedRequest?.title}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Описание</Text>
                    <Text whiteSpace="pre-wrap">
                      {selectedRequest?.description || 'Нет описания'}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Статус</Text>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      disabled={isUpdatingStatus}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: 'white',
                        marginTop: '4px'
                      }}
                    >
                      <option value="Created">Создана</option>
                      <option value="Accepted">Принята</option>
                      <option value="InProgress">В работе</option>
                      <option value="Completed">Выполнена</option>
                      <option value="Rejected">Отклонена</option>
                    </select>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">Дата создания</Text>
                    <Text>{formatDate(selectedRequest?.createdAt)}</Text>
                  </Box>
                  {selectedRequest?.resolutionComment && (
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" color="gray.500">Комментарий</Text>
                      <Text>{selectedRequest.resolutionComment}</Text>
                    </Box>
                  )}
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <HStack gap={3}>
                  <Button variant="outline" onClick={handleCloseModal}>
                    Закрыть
                  </Button>
                  {newStatus !== selectedRequest?.status && (
                    <Button 
                      colorPalette="teal" 
                      onClick={handleStatusChange}
                      isLoading={isUpdatingStatus}
                      loadingText="Сохранение..."
                    >
                      Сохранить статус
                    </Button>
                  )}
                </HStack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
}