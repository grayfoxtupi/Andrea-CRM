import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import api from '../services/api';

type LeadsNavigationProp = NavigationProp<RootStackParamList, 'Leads'>;

interface Lead {
  id: number;
  companyId: number | null;
  date: string;
  razaoSocial: string;
  cnpj: string;
  descricao: string;
  email: string;
  telefone: string;
  areaAtuacao: string;
  meioContato: string;
  localContato: string;
  proposta: string;
  status: 'Ativo' | 'Inativo';
  tarefas: string[];
}

const getStatusColor = (status: Lead['status']) => {
  return status === 'Ativo' ? '#10b981' : '#ef4444';
};

interface LeadCardProps {
  lead: Lead;
  delay?: number;
  navigation: LeadsNavigationProp;
  onLeadChanged: () => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, delay = 0, navigation, onLeadChanged }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);
  const [localStatus, setLocalStatus] = useState<Lead['status']>(lead.status);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, delay]);

  const matchedTarefas = lead.tarefas.map((id) => ({
    id,
    title: `Tarefa ${id}`,
  }));

  const handleAddTask = async () => {
    if (localStatus === 'Inativo') {
      try {
        await api.patch(`/api/leads/${lead.id}`, { isLead: true });
        setLocalStatus('Ativo');
        onLeadChanged();
      } catch (error) {
        console.error('Erro ao reativar lead:', error);
      }
    }
    // navigation.navigate('FormTask', { leadId: lead.id } as any);
    navigation.navigate('FormTask', { leadId: lead.id })

  };

  const handlePromoteClient = async () => {
    try {
      await api.post(`/api/leads/${lead.id}/promote`);
      onLeadChanged();
    } catch (error) {
      console.error('Erro ao promover cliente:', error);
    }
  };

  const confirmPromoteClient = () => {
    Alert.alert(
      'Promover Cliente',
      'Tem certeza que deseja promover este lead para cliente? Essa ação não poderá ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: handlePromoteClient },
      ]
    );
  };

  // const handlePromoteClient = async () => {
  //   try {
  //     await api.post('/api/clients', {
  //       companyName: lead.razaoSocial,
  //       companyCnpj: lead.cnpj,
  //     });
  //     await api.delete(`/api/leads/${lead.id}`);
  //     onLeadChanged();
  //   } catch (error) {
  //     console.error('Erro ao promover cliente:', error);
  //   }
  // };


  const handleArchive = async () => {
  try {
    await api.put(`/api/leads/${lead.id}`, {
      company: {
        companyId: lead.companyId, // enviar o ID da empresa
      },
      date: lead.date,
      communicationChannel: lead.meioContato,
      location: lead.localContato,
      offer: lead.proposta,
      isLead: false, // arquiva o lead
    });
    setLocalStatus('Inativo');
    onLeadChanged();
  } catch (error) {
    console.error('Erro ao arquivar lead:', error);
  }
};
  return (
    <Animated.View style={[styles.leadCard, { opacity: fadeAnim }]}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <View style={styles.headerRow}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(localStatus) }]} />
          <Text style={styles.leadName}>{lead.razaoSocial}</Text>
          <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color="#000" />
        </View>
        <Text style={styles.leadEmail}>{lead.email}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedInfo}>
          <Text style={styles.infoText}>CNPJ/CPF: {lead.cnpj}</Text>
          <Text style={styles.infoText}>Descrição: {lead.descricao}</Text>
          <Text style={styles.infoText}>Área de atuação: {lead.areaAtuacao}</Text>
          <Text style={styles.infoText}>Telefone: {lead.telefone}</Text>
          <Text style={styles.infoText}>Local de Contato: {lead.localContato}</Text>
          <Text style={styles.infoText}>Meio de Contato: {lead.meioContato}</Text>
          <Text style={styles.infoText}>Proposta: {lead.proposta}</Text>

          <TouchableOpacity style={styles.addTaskBtn} onPress={handleAddTask}>
            <Feather name="plus" size={16} color="#000" />
            <Text style={styles.addTaskText}>Adicionar Tarefa</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <TouchableOpacity onPress={confirmPromoteClient}>
              <Text style={{ color: '#3b82f6', fontSize: 12, fontWeight: '500', marginRight: 16 }}>
                Promover a cliente
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleArchive}>
              <Text style={{ color: '#000', fontSize: 12, fontWeight: '500' }}>Arquivar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

interface LeadsProps {
  searchTerm: string;
}

const Leads: React.FC<LeadsProps> = ({ searchTerm }) => {
  const navigation = useNavigation<LeadsNavigationProp>();
  const [activeFilter, setActiveFilter] = useState<Lead['status']>('Ativo');
  const [leads, setLeads] = useState<Lead[]>([]);

  const fetchLeads = useCallback(async () => {
    try {
      const response = await api.get('/api/leads');
      const backendLeads = response.data.map((lead: any) => ({
        id: lead.leadId,
        companyId: lead.company?.companyId || null,
        razaoSocial: lead.company?.companyName || '',
        cnpj: lead.company?.cnpj || '',
        descricao: lead.company?.description || '',
        email: lead.company?.companyEmail || '',
        telefone: lead.company?.companyPhoneNumber || '',
        areaAtuacao: lead.company?.businessArea || '',
        meioContato: lead.communicationChannel || '',
        localContato: lead.location || '',
        proposta: lead.offer || '',
        status: lead.isLead ? 'Ativo' : 'Inativo',
        tarefas: [], // ajustar quando implementar tarefas
      }));
      setLeads(backendLeads);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useFocusEffect(
    useCallback(() => {
      fetchLeads();
    }, [fetchLeads])
  );

  const filteredLeads = leads.filter((lead) => {
    if (lead.status !== activeFilter) return false;
    if (
      searchTerm.trim() !== '' &&
      !(
        lead.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.cnpj.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.meioContato.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.localContato.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ) {
      return false;
    }
    return true;
  });

  const handleNewLead = () => {
    navigation.navigate('FormLead' as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leads</Text>

      <View style={styles.tabs}>
        {['Ativo', 'Inativo'].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setActiveFilter(status as Lead['status'])}
            style={[styles.tab, activeFilter === status && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeFilter === status && styles.activeTabText]}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>
        {filteredLeads.map((lead, index) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            delay={index * 100}
            navigation={navigation}
            onLeadChanged={fetchLeads}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.buttonLead} onPress={handleNewLead}>
        <Text style={styles.buttonLeadText}>+ Novo Lead</Text>
      </TouchableOpacity>
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
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  addTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16, // espaçamento em cima e embaixo
  },
  addTaskText: {
    fontSize: 12,
    color: '#000',
    marginLeft: 4,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskText: {
    fontSize: 13,
    color: '#111827',
  },
  buttonLead: {
    marginTop: 'auto',
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    marginBottom: 24,
  },
  buttonLeadText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Leads;
