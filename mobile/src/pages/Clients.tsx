import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import ClientSearchBar from '../components/ClientSearchBar';
import FilterOverlay from '../components/FilterOverlay';
import api from '../services/api';
import { RootStackParamList } from '../types/navigation';

type ClientsNavigationProp = NavigationProp<RootStackParamList, 'Clients'>;

interface Client {
  id: number;
  companyName: string;
  cnpj: string;
  description: string;
  email: string;
  phone: string;
  businessArea: string;
  status: 'Ativo' | 'Inativo';
}

const getStatusColor = (status: Client['status']) => {
  return status === 'Ativo' ? '#10b981' : '#ef4444';
};

interface ClientCardProps {
  client: Client;
  delay?: number;
  navigation: ClientsNavigationProp;
  onClientChanged: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, delay = 0, navigation, onClientChanged }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);
  const [localStatus, setLocalStatus] = useState<Client['status']>(client.status);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, delay]);

  const handleAddTask = () => {
    navigation.navigate('FormClientTask', { clientId: client.id });
  };

  const handleArchive = async () => {
    try {
      await api.put(`/api/clients/${client.id}`, {
        companyName: client.companyName,
        cnpj: client.cnpj,
        description: client.description,
        companyEmail: client.email,
        companyPhoneNumber: client.phone,
        businessArea: client.businessArea,
        status: 'Inativo',
      });
      setLocalStatus('Inativo');
      onClientChanged();
    } catch (error) {
      console.error('Erro ao arquivar cliente:', error);
    }
  };

  const confirmArchive = () => {
    Alert.alert(
      'Arquivar Cliente',
      'Tem certeza que deseja arquivar este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Arquivar', onPress: handleArchive },
      ]
    );
  };

  return (
    <Animated.View style={[styles.leadCard, { opacity: fadeAnim }]}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <View style={styles.headerRow}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(localStatus) }]} />
          <Text style={styles.leadName}>{client.companyName}</Text>
          <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color="#000" />
        </View>
        <Text style={styles.leadEmail}>{client.email}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedInfo}>
          <Text style={styles.infoText}>CNPJ: {client.cnpj}</Text>
          <Text style={styles.infoText}>Descrição: {client.description}</Text>
          <Text style={styles.infoText}>Área de atuação: {client.businessArea}</Text>
          <Text style={styles.infoText}>Telefone: {client.phone}</Text>

          <TouchableOpacity style={styles.addTaskBtn} onPress={handleAddTask}>
            <Feather name="plus" size={16} color="#000" />
            <Text style={styles.addTaskText}>Adicionar Tarefa</Text>
          </TouchableOpacity>

          {localStatus === 'Ativo' && (
            <TouchableOpacity onPress={confirmArchive}>
              <Text style={{ color: '#000', fontSize: 12, fontWeight: '500' }}>
                Arquivar
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Animated.View>
  );
};

interface ClientsProps {
  searchTerm: string;
}

const Clients: React.FC<ClientsProps> = ({ searchTerm }) => {
  const navigation = useNavigation<ClientsNavigationProp>();
  const [activeTab, setActiveTab] = useState<Client['status']>('Ativo');
  const [clients, setClients] = useState<Client[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      const response = await api.get('/api/clients');
      const backendClients = response.data.map((client: any) => ({
        id: client.clientId,
        companyName: client.companyName || '',
        cnpj: client.cnpj || '',
        description: client.description || '',
        email: client.companyEmail || '',
        phone: client.companyPhoneNumber || '',
        businessArea: client.businessArea || '',
        status: client.status === 'Inativo' ? 'Inativo' : 'Ativo',
      }));
      setClients(backendClients);
    } catch (error) {
      console.error('Erro ao buscar clients:', error);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useFocusEffect(
    useCallback(() => {
      fetchClients();
    }, [fetchClients])
  );

  const filteredClients = clients.filter((client) => {
    if (client.status !== activeTab) return false;
    if (
      searchTerm.trim() !== '' &&
      !(
        client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.cnpj.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) {
      return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes</Text>

      <View style={styles.tabs}>
        {['Ativo', 'Inativo'].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setActiveTab(status as Client['status'])}
            style={[styles.tab, activeTab === status && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === status && styles.activeTabText]}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>
        {filteredClients.map((client, index) => (
          <ClientCard
            key={client.id}
            client={client}
            delay={index * 100}
            navigation={navigation}
            onClientChanged={fetchClients}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 20, flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  tabs: { flexDirection: 'row', marginBottom: 16 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    marginRight: 12,
  },
  activeTab: { backgroundColor: '#000' },
  tabText: { color: '#6b7280', fontWeight: '500' },
  activeTabText: { color: '#fff', fontWeight: '600' },
  leadCard: {
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  leadName: { fontSize: 14, fontWeight: '600', flex: 1 },
  leadEmail: { fontSize: 12, color: '#6b7280' },
  expandedInfo: {
    marginTop: 10,
  },
  infoText: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
  },
  addTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  addTaskText: {
    fontSize: 12,
    color: '#000',
    marginLeft: 4,
  },
});

export default Clients;
