import { Box, Heading, Table, Badge, Button, Input, HStack, VStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import * as Buttons from "../../components/ui/buttons";

export default function UserRequests() {
  const [activeActionId, setActiveActionId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);

  const [requests, setRequests] = useState([
    {
      id: 1,
      title: 'Протечка в подвале',
      status: 'closed',
      date: '15.01.2026',
      description: 'Протечка в подвале, нужен сантехник'
    }
  ]);

  const handleEdit = (id) => {
    const request = requests.find(r => r.id === id);
    setEditingRequest({ ...request });
    setActiveActionId(id);
    setActionType('edit');
  };

  const handleOpen = (id) => {
    setActiveActionId(id);
    setActionType('open');
  };

  const handleCancel = () => {
    setActiveActionId(null);
    setActionType(null);
    setEditingRequest(null);
  };

  const handleConfirmEdit = () => {
    setRequests(prev => prev.map(req => 
      req.id === editingRequest.id ? editingRequest : req
    ));
    handleCancel();
  };

  const handleEditChange = (field, value) => {
    setEditingRequest(prev => ({ ...prev, [field]: value }));
  };

  const isActive = (id, type) => {
    return activeActionId === id && actionType === type;
  };

  const getBadgeColor = (status) => {
    return status === 'closed' ? 'green' : 'yellow';
  };

  const getStatusText = (status) => {
    return status === 'closed' ? 'Закрыта' : 'В работе';
  };

  return (
    <Box>
      <Heading size="lg" mb={4}>
        Заявки
      </Heading>
      
      <Table.Root bg="white" rounded="lg" shadow="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>№</Table.ColumnHeader>
            <Table.ColumnHeader>Тема</Table.ColumnHeader>
            <Table.ColumnHeader>Статус</Table.ColumnHeader>
            <Table.ColumnHeader>Дата</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          {requests.map((request) => {
            const isEditing = isActive(request.id, 'edit');
            const isOpening = isActive(request.id, 'open');
            
            return (
              <Table.Row key={request.id}>
                <Table.Cell>{request.id}</Table.Cell>
                <Table.Cell>
                  {isEditing ? (
                    <Input
                      value={editingRequest?.title || ''}
                      onChange={(e) => handleEditChange('title', e.target.value)}
                      size="sm"
                    />
                  ) : (
                    request.title
                  )}
                </Table.Cell>
                <Table.Cell>
                  {/* Статус — только для чтения, без поля ввода */}
                  <Badge colorPalette={getBadgeColor(request.status)}>
                    {getStatusText(request.status)}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {isEditing ? (
                    <Input
                      value={editingRequest?.date || ''}
                      onChange={(e) => handleEditChange('date', e.target.value)}
                      size="sm"
                    />
                  ) : (
                    request.date
                  )}
                </Table.Cell>
                <Table.Cell textAlign="end">
                  {!isEditing && !isOpening ? (
                    <HStack gap={2} justify="flex-end">
                      <Buttons.PurpleButton onClick={() => handleEdit(request.id)}>
                        Редактировать
                      </Buttons.PurpleButton>
                      <Buttons.PurpleButton onClick={() => handleOpen(request.id)}>
                        Открыть
                      </Buttons.PurpleButton>
                    </HStack>
                  ) : isEditing ? (
                    <HStack gap={2} justify="flex-end">
                      <Buttons.PrimaryButton onClick={handleConfirmEdit}>
                        Подтвердить
                      </Buttons.PrimaryButton>
                      <Buttons.DangerButton onClick={handleCancel}>
                        Отмена
                      </Buttons.DangerButton>
                    </HStack>
                  ) : (
                    <Buttons.DangerButton onClick={handleCancel}>
                      Отмена
                    </Buttons.DangerButton>
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}