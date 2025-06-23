import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { TouchableWithoutFeedback } from 'react-native';

const convertStatus = (backendStatus: string) => {
  switch (backendStatus) {
    case 'Em processo':
      return 'progress';
    case 'Concluído':
      return 'done';
    case 'Cancelado':
      return 'cancelled';
    default:
      return 'progress';
  }
};

const convertStatusToBackend = (status: string) => {
  switch (status) {
    case 'progress':
      return 'Em processo';
    case 'done':
      return 'Concluído';
    case 'cancelled':
      return 'Cancelado';
    default:
      return 'Em processo';
  }
};

interface ClientTasksProps {
  searchTerm: string;
}

const ClientTasks: React.FC<ClientTasksProps> = ({ searchTerm }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('progress');
  const [showEdit, setShowEdit] = useState<number | null>(null);

  const fetchClientTasks = async () => {
    try {
      const response = await api.get('/api/client-tasks');
      const data = response.data.map((task: any) => ({
        id: task.taskId,
        title: task.meetingTopic,
        status: convertStatus(task.taskStatus),
        descricao: task.projectDescription,
        notas: task.notes,
        data: new Date(task.taskBegin).toLocaleDateString('pt-BR'),
        hora: new Date(task.taskBegin).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        clientId: task.client.clientId,
        clientName: task.client.companyName,
      }));
      setTasks(data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      await api.put(`/api/client-tasks/${id}`, {
        meetingTopic: task.title,
        taskBegin: new Date().toISOString(),
        taskEnd: new Date().toISOString(),
        projectDescription: task.descricao,
        notes: task.notas,
        taskStatus: convertStatusToBackend(newStatus),
        client: { clientId: task.clientId },
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
    }
  };

  const handleEdit = (id: number) => {
  const taskToEdit = tasks.find(task => task.id === id);
  if (taskToEdit) {
    navigation.navigate('FormClientTask', {
      task: {
        id: taskToEdit.id,
        meetingTopic: taskToEdit.title,
        projectDescription: taskToEdit.descricao,
        notes: taskToEdit.notas,
        taskBegin: taskToEdit.data,
        taskEnd: taskToEdit.data,
      },
      isEditing: true,
      clientId: taskToEdit.clientId,
    });
  }
};

  useEffect(() => {
    fetchClientTasks();
  }, []);

  const tasksToShow =
    selectedStatus === 'done' || selectedStatus === 'cancelled'
      ? tasks.filter((task) => task.status === selectedStatus)
      : tasks.filter(
          (task) => task.status !== 'done' && task.status !== 'cancelled'
        );

  const tasksByClient = tasksToShow.reduce((acc: any, task: any) => {
    const clientKey = String(task.clientId);
    if (!acc[clientKey]) {
      acc[clientKey] = {
        clientName: task.clientName,
        tasks: [],
      };
    }
    acc[clientKey].tasks.push(task);
    return acc;
  }, {});

  const tabs = [
    { label: 'Em progresso', value: 'progress' },
    { label: 'Cancelado', value: 'cancelled' },
    { label: 'Concluído', value: 'done' },
  ];

  return (
     <TouchableWithoutFeedback onPress={() => setShowEdit(null)}>
    <View style={styles.container}>
      <Text style={styles.title}>Tarefas de Clientes</Text>

      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            onPress={() => setSelectedStatus(tab.value)}
            style={[styles.tab, selectedStatus === tab.value && styles.activeTab]}
          >
            <Text
              style={[styles.tabText, selectedStatus === tab.value && styles.activeTabText]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>
        {Object.entries(tasksByClient).map(
          ([clientId, { clientName, tasks }]: any) => (
            <View key={clientId} style={styles.clientCard}>
              <Text style={styles.clientName}>{clientName}</Text>
              {tasks.map((task: any) => (
                <View key={task.id} style={{ zIndex: showEdit === task.id ? 999 : 1 }}>
                <View key={task.id} style={styles.taskCard}>
                  <Text style={styles.taskText}>{task.title}</Text>

                  <TouchableOpacity
                    onPress={() =>
                      setShowEdit(showEdit === task.id ? null : task.id)
                    }
                  >
                    <Feather name="more-vertical" size={18} color="#4b5563" />
                  </TouchableOpacity>

                  {showEdit === task.id && (
                    <View style={styles.optionsMenu}>
                      <TouchableOpacity
                        style={styles.optionItem}
                        onPress={() => {
                          handleStatusUpdate(task.id, 'cancelled');
                          setShowEdit(null);
                        }}
                      >
                        <Feather name="x-circle" size={16} color="#ef4444" />
                        <Text style={styles.optionTextCancel}>Cancelar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.optionItem}
                        onPress={() => {
                          handleStatusUpdate(task.id, 'done');
                          setShowEdit(null);
                        }}
                      >
                        <Feather name="check-circle" size={16} color="#10b981" />
                        <Text style={styles.optionText}>Concluir</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.optionItem}
                        onPress={() => {
                          handleEdit(task.id);
                          setShowEdit(null);
                        }}
                      >
                        <Feather name="edit-3" size={16} color="#3b82f6" />
                        <Text style={styles.optionText}>Editar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                </View>
              ))}
            </View>
          )
        )}
      </ScrollView>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 20, flex: 1 },
  title: { fontWeight: '700', fontSize: 16, marginBottom: 12 },
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
  clientCard: {
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  clientName: { fontWeight: '600', fontSize: 14, marginBottom: 8 },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
     position: 'relative',
  },
  taskText: { fontSize: 13, color: '#111827' },
  optionsMenu: {
  position: 'absolute',
  top: 36,
  right: 8,
  minWidth: 100,
  paddingVertical: 8,
  paddingHorizontal: 12,
  backgroundColor: 'black',
  borderRadius: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 10,
  zIndex: 999,
},
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 14,
  },
  optionTextCancel: {
    marginLeft: 8,
    color: '#ef4444',
    fontSize: 14,
  },
});

export default ClientTasks;
