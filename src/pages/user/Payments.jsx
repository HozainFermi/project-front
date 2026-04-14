import { Box, Heading, VStack, HStack, Text, Input, Button, Field, Card, Tabs, Table, Badge } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { toaster } from '../../components/ui/toaster';

export default function UserPayments() {
  const [activeTab, setActiveTab] = useState('new');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    amount: '',
    period: '',
    accountNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchPaymentHistory = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setPayments([
          {
            id: 1,
            service: 'Водоснабжение',
            amount: 1250.00,
            period: 'Март 2026',
            date: '2026-03-20',
            status: 'paid'
          },
          {
            id: 2,
            service: 'Электричество',
            amount: 980.50,
            period: 'Март 2026',
            date: '2026-03-15',
            status: 'paid'
          },
          {
            id: 3,
            service: 'Отопление',
            amount: 2150.00,
            period: 'Февраль 2026',
            date: '2026-02-28',
            status: 'paid'
          },
          {
            id: 4,
            service: 'Газ',
            amount: 450.00,
            period: 'Февраль 2026',
            date: '2026-02-20',
            status: 'paid'
          }
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Ошибка загрузки истории', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchPaymentHistory();
    }
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.service.trim()) {
      newErrors.service = 'Введите название услуги';
    } else if (formData.service.length > 100) {
      newErrors.service = 'Название услуги не должно превышать 100 символов';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Введите сумму';
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.amount)) {
      newErrors.amount = 'Введите корректную сумму (например, 1000 или 1000.50)';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Сумма должна быть больше 0';
    }
    
    if (!formData.period.trim()) {
      newErrors.period = 'Укажите период оплаты';
    } else if (formData.period.length > 50) {
      newErrors.period = 'Период не должен превышать 50 символов';
    }
    
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Введите номер лицевого счёта';
    } else if (!/^\d{10,12}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Номер должен содержать 10-12 цифр';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toaster.create({
        title: 'Ошибка',
        description: 'Проверьте правильность заполнения полей',
        type: 'error',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toaster.create({
        title: 'Платёж создан',
        description: `${formData.service}: ${formData.amount} ₽ за ${formData.period}`,
        type: 'success',
        duration: 3000,
      });
      
      setFormData({
        service: '',
        amount: '',
        period: '',
        accountNumber: ''
      });
    } catch (error) {
      toaster.create({
        title: 'Ошибка',
        description: 'Не удалось создать платёж',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      service: '',
      amount: '',
      period: '',
      accountNumber: ''
    });
    setErrors({});
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Платежи
      </Heading>

      <Tabs.Root 
        value={activeTab} 
        onValueChange={(e) => setActiveTab(e.value)}
        mb={6}
      >
        <Tabs.List>
          <Tabs.Trigger value="new">
            Внести оплату
          </Tabs.Trigger>
          <Tabs.Trigger value="history">
            История платежей
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="new" pt={6}>
          <Card.Root maxW="600px" mx="auto">
            <Card.Header>
              <Heading size="md">Новый платёж</Heading>
              <Text fontSize="sm" color="gray.500">
                Заполните данные для оплаты
              </Text>
            </Card.Header>
            
            <Card.Body>
              <VStack spacing={5} align="stretch">
                <Field.Root invalid={errors.service}>
                  <Field.Label>Услуга</Field.Label>
                  <Input
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    placeholder="Например: Водоснабжение, Электричество, Отопление"
                  />
                  <Field.ErrorText>{errors.service}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={errors.amount}>
                  <Field.Label>Сумма (₽)</Field.Label>
                  <Input
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="1000"
                  />
                  <Field.ErrorText>{errors.amount}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={errors.period}>
                  <Field.Label>Период оплаты</Field.Label>
                  <Input
                    name="period"
                    value={formData.period}
                    onChange={handleInputChange}
                    placeholder="Март 2026"
                  />
                  <Field.ErrorText>{errors.period}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={errors.accountNumber}>
                  <Field.Label>Номер лицевого счёта</Field.Label>
                  <Input
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    maxLength={12}
                  />
                  <Field.ErrorText>{errors.accountNumber}</Field.ErrorText>
                </Field.Root>
              </VStack>
            </Card.Body>

            <Card.Footer>
              <HStack spacing={3} justify="flex-end" width="full">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  isDisabled={isSubmitting}
                >
                  Очистить
                </Button>
                <Button
                  colorPalette="teal"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  loadingText="Создание..."
                >
                  Создать платёж
                </Button>
              </HStack>
            </Card.Footer>
          </Card.Root>
        </Tabs.Content>

        <Tabs.Content value="history" pt={6}>
          {loading ? (
            <Box textAlign="center" py={8}>
              <Text>Загрузка истории...</Text>
            </Box>
          ) : payments.length === 0 ? (
            <Box textAlign="center" py={8} bg="white" rounded="lg">
              <Text color="gray.500">У вас пока нет платежей</Text>
              <Button 
                mt={4} 
                colorPalette="teal" 
                onClick={() => setActiveTab('new')}
              >
                Внести первый платёж
              </Button>
            </Box>
          ) : (
            <Table.Root bg="white" rounded="lg" shadow="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Услуга</Table.ColumnHeader>
                  <Table.ColumnHeader>Период</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Сумма</Table.ColumnHeader>
                  <Table.ColumnHeader>Дата оплаты</Table.ColumnHeader>
                  <Table.ColumnHeader>Статус</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              
              <Table.Body>
                {payments.map((payment) => (
                  <Table.Row key={payment.id}>
                    <Table.Cell>{payment.service}</Table.Cell>
                    <Table.Cell>{payment.period}</Table.Cell>
                    <Table.Cell textAlign="right" fontWeight="medium">
                      {payment.amount.toFixed(2)} ₽
                    </Table.Cell>
                    <Table.Cell>{formatDate(payment.date)}</Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette="green">Оплачено</Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          )}
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}