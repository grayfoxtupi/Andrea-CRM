import AsyncStorage from '@react-native-async-storage/async-storage';

export const addNotification = async (notification: {
  id: number;
  userName: string;
  companyName: string;
  date: string;
  type: 'criada' | 'editada';
}) => {
  try {
    const stored = await AsyncStorage.getItem('notifications');
    const notifications = stored ? JSON.parse(stored) : [];

    notifications.unshift({
      ...notification,
      timestamp: new Date().toISOString(),
    });

    await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Erro ao salvar notificação:', error);
  }
};
