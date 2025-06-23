import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import HamburgerMenu from '../components/HamburgerMenu';
import NotificationIcon from '../components/NotificationIcon';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from '../components/SearchBar';
import SideMenu from '../pages/SideMenu';
import Leads from '../components/Leads';
import Tasks from '../components/Tasks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Clients from '../pages/Clients';
import ClientTasks from '../components/ClientTasks';


const getGreeting = () => {
  const brasiliaHour = new Date().toLocaleString('en-US', {
    timeZone: 'America/Sao_Paulo',
    hour: 'numeric',
    hour12: false,
  });
  const hour = parseInt(brasiliaHour, 10);
  if (hour >= 5 && hour < 12) return 'Bom dia,';
  if (hour >= 12 && hour < 18) return 'Boa tarde,';
  return 'Boa noite,';
};

const Dashboard = () => {

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const greeting = getGreeting();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const animationValue = useRef(new Animated.Value(-300)).current;
  const [selectedScreen, setSelectedScreen] = useState('Leads');
  const [searchTerm, setSearchTerm] = useState('');

  const [userName, setUserName] = useState(''); 
  const [avatarUri, setAvatarUri] = useState('https://randomuser.me/api/portraits/lego/1.jpg'); 

  const handleOpenMenu = () => setMenuVisible(true);
  const handleCloseMenu = () => setMenuVisible(false);

  useFocusEffect(
    useCallback(() => {
      setSelectedScreen('Leads');
      loadUserData();
    }, [])
  );

  const handleNavigate = (screen: string) => {
    setMenuVisible(false);
  
    if (screen === 'Schedule') {
      navigation.navigate(screen as any);
    } else {
      setSelectedScreen(screen);
    }
  };
  
  const handleOpenNotifications = () => {
    navigation.navigate('Notifications');
  };
  

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: isMenuVisible ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isMenuVisible]);

  // Função que lê o usuário salvo no AsyncStorage
  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.fullName || '');
        setAvatarUri(user.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg');
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{uri: avatarUri}}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <View style={styles.greeting}>
          <Text style={styles.greetingText}>{greeting}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        <NotificationIcon onPress={handleOpenNotifications} />
      </View>

      <View style={styles.menuAndSearch}>
        <HamburgerMenu onPress={handleOpenMenu} />
        <View style={{flex: 1, marginLeft: 12}}>
          <SearchBar
            placeholder={
              selectedScreen === 'Leads'
                ? 'Pesquisar leads...'
                : selectedScreen === 'Tasks'
                ? 'Pesquisar tarefas...'
                : 'Pesquisar...'
            }
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      {selectedScreen === 'Leads' && <Leads searchTerm={searchTerm} />}
      {selectedScreen === 'Tasks' && <Tasks searchTerm={searchTerm} />}
      {selectedScreen === 'Clients' && <Clients searchTerm={searchTerm}/>}
      {selectedScreen === 'ClientTasks' && <ClientTasks searchTerm={searchTerm}/>}

      {isMenuVisible && (
        <SideMenu
          onClose={handleCloseMenu}
          animationValue={animationValue}
          onNavigate={handleNavigate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#06d6a0',
  },
  greeting: {
    flex: 1,
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 12,
    color: '#6b7280',
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  menuAndSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default Dashboard;
