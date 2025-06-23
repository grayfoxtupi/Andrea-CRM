import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const Notifications = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<any[]>([]);

  const loadNotifications = async () => {
    try {
      const storedData = await AsyncStorage.getItem('notifications');
      const parsed = storedData ? JSON.parse(storedData) : [];
      setNotifications(parsed);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.notificationRow}>
      <Image source={require('../images/avatar1.png')} style={styles.avatar} />
      <View style={styles.textContent}>
        <Text style={styles.textMain}>
          <Text style={styles.bold}>{item.userName}</Text>{' '}
          {item.type === 'criada'
            ? 'marcou uma reunião com'
            : 'alterou a reunião com'}{' '}
          <Text style={styles.bold}>{item.companyName}</Text> para{' '}
          <Text style={styles.bold}>{item.date}</Text>
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notificações</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}>
          <Feather name="x" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 20}}>
            Nenhuma notificação encontrada.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  textMain: {
    fontSize: 14,
    color: '#111827',
  },
  bold: {
    fontWeight: '700',
  },
  timestamp: {
    marginTop: 4,
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default Notifications;
