import { Box, Heading, Table, Badge, Button, Input, HStack } from '@chakra-ui/react';
import { useState } from 'react';
import * as Buttons from "../../components/ui/buttons";

export default function UserMeters() {
  const [activeActionId, setActiveActionId] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [editingMeter, setEditingMeter] = useState(null);

  const [meters, setMeters] = useState([
    {
      id: 1,
      type: 'ХВС',
      value: 123,
      date: '01.02.2026'
    }
  ]);

  const handleEdit = (id) => {
    const meter = meters.find(m => m.id === id);
    setEditingMeter({ ...meter });
    setActiveActionId(id);
    setActionType('edit');
  };

  const handleSubmit = (id) => {
    setActiveActionId(id);
    setActionType('submit');
  };

  const handleCancel = () => {
    setActiveActionId(null);
    setActionType(null);
    setEditingMeter(null);
  };

  const handleConfirmEdit = () => {
    setMeters(prev => prev.map(m => 
      m.id === editingMeter.id ? editingMeter : m
    ));
    handleCancel();
  };

  const handleEditChange = (field, value) => {
    setEditingMeter(prev => ({ ...prev, [field]: value }));
  };

  const isActive = (id, type) => {
    return activeActionId === id && actionType === type;
  };

  return (
    <Box>
      <Heading size="lg" mb={4}>
        Показания счётчиков
      </Heading>
      
      <Table.Root bg="white" rounded="lg" shadow="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Тип</Table.ColumnHeader>
            <Table.ColumnHeader>Текущие показания</Table.ColumnHeader>
            <Table.ColumnHeader>Дата</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          {meters.map((meter) => {
            const isEditing = isActive(meter.id, 'edit');
            const isSubmitting = isActive(meter.id, 'submit');
            
            return (
              <Table.Row key={meter.id}>
                <Table.Cell>
                  {isEditing ? (
                    <Input
                      value={editingMeter?.type || ''}
                      onChange={(e) => handleEditChange('type', e.target.value)}
                      size="sm"
                    />
                  ) : (
                    meter.type
                  )}
                </Table.Cell>
                <Table.Cell>
                  {isEditing ? (
                    <Input
                      value={editingMeter?.value || ''}
                      onChange={(e) => handleEditChange('value', e.target.value)}
                      size="sm"
                    />
                  ) : (
                    meter.value
                  )}
                </Table.Cell>
                <Table.Cell>
                  {isEditing ? (
                    <Input
                      value={editingMeter?.date || ''}
                      onChange={(e) => handleEditChange('date', e.target.value)}
                      size="sm"
                    />
                  ) : (
                    meter.date
                  )}
                </Table.Cell>
                <Table.Cell textAlign="end">
                  {!isEditing && !isSubmitting ? (
                    <HStack gap={2} justify="flex-end">
                      <Buttons.PurpleButton onClick={() => handleEdit(meter.id)}>
                        Редактировать
                      </Buttons.PurpleButton>
                      <Buttons.PurpleButton onClick={() => handleSubmit(meter.id)}>
                        Передать
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