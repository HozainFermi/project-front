import { Box, Button, Input, Stack, Fieldset, Field, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toaster } from '../../components/ui/toaster';
import api from '../../api/instance';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Введите email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Неверный формат email';
    if (!formData.password) newErrors.password = 'Введите пароль';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log('🔐 Отправка логина:', { email: formData.email });
      
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      console.log('✅ Ответ логина:', response.data);

      // Сохраняем токен
      localStorage.setItem('token', response.data.token);
      console.log('💾 Токен сохранён:', response.data.token);

      // Получаем профиль
      console.log('👤 Запрос профиля...');
      const profileResponse = await api.get('/api/users/profile');
      const user = profileResponse.data;
      console.log('👤 Профиль получен:', user);

      // Сохраняем данные пользователя
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }));

      toaster.create({
        title: 'Успешно',
        description: response.data.message,
        type: 'success',
        duration: 3000,
      });

      // Редирект по роли
      switch (user.role) {
        case 'User': navigate('/'); break;
        case 'Worker': navigate('/worker/dashboard'); break;
        case 'Admin': navigate('/admin/dashboard'); break;
        default: navigate('/');
      }

    } catch (error) {
      console.error('❌ Ошибка входа:', error);
      console.error('📡 Статус:', error.response?.status);
      console.error('📄 Данные ошибки:', error.response?.data);
      
      toaster.create({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Неверный email или пароль',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset.Root>
        <Stack spacing={6}>
          <Fieldset.Legend color="white">Авторизация</Fieldset.Legend>        
          <Fieldset.HelperText fontSize="sm" color="gray.300">
            Войдите в систему, используя email и пароль
          </Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
          <Field.Root invalid={errors.email}>
            <Field.Label>Email</Field.Label>
            <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="example@mail.ru" />
            <Field.ErrorText>{errors.email}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={errors.password}>
            <Field.Label>Пароль</Field.Label>
            <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
            <Field.ErrorText>{errors.password}</Field.ErrorText>
          </Field.Root>

          <Button type="submit" colorScheme="teal" isLoading={isLoading} loadingText="Вход...">
            Войти
          </Button>
        </Fieldset.Content>

        <Box fontSize="sm" color="gray.400" textAlign="center">
          Нет аккаунта?{' '}
          <Button variant="link" colorScheme="teal" onClick={() => navigate('/auth/register')}>
            Зарегистрироваться
          </Button>
        </Box>
      </Fieldset.Root>
    </form>
  );
}