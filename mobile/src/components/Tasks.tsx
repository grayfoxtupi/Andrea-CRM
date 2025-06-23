import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Animated,
  ScrollView
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TasksNavigationProp, TasksRouteProp } from '../types/navigation';
import api from '../services/api';
import { TouchableWithoutFeedback } from 'react-native';

interface Task {
  id: number;
  title: string;
  status: string;
  contato: string;
  localEncontro: string;
  metodoContato: string;
  localizacao: string;
  feedback: string;
  data: string;
  hora: string;
  leadId: number;
  leadName: string;
}


const getStatusColor = (status: string) => {
  switch (status) {
    case 'progress':
      return '#007BFF';
    case 'done':
      return '#28A745';
    case 'cancelled':
      return '#DC3545';
    default:
      return '#6c757d';
  }
};

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
        

const TaskCard = ({
  item,
  delay = 0,
  onCancel,
  onDone,
  onEdit,
}: {
  item: any;
  delay?: number;
  onCancel: () => void;
  onDone: () => void;
  onEdit: () => void;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);
  const [showEdit, setShowEdit] = useState<number | null>(null);



  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleExpand = () => {
    setExpanded(!expanded);
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <>
      <Animated.View style={[styles.taskItem, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={toggleExpand}>
          <View style={styles.taskHeader}>
            <View
              style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]}
            />
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
              <Feather name="chevron-down" size={20} color="#000" />
            </Animated.View>
          </View>
          <View style={styles.taskFooter}>
          <Image source={{ uri: item.avatarUrl }} style={styles.ownerImage} />
          </View>
        </TouchableOpacity>
      </Animated.View>
      
      {expanded && (
        <View style={styles.extraInfo}>
          {item.status === 'progress' && (
            <>
              <TouchableOpacity onPress={() => setShowEdit(showEdit === item.id ? null : item.id)}
>
                <Feather name="more-vertical" size={20} color="#000" />
              </TouchableOpacity>

              {showEdit && (
                <View style={styles.optionsMenu}>
                  <TouchableOpacity style={styles.optionItem} onPress={onCancel}>
                    <Feather name="x-circle" size={16} color="#ef4444" />
                    <Text style={styles.optionTextCancel}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.optionItem} onPress={onDone}>
                    <Feather name="check-circle" size={16} color="#10b981" />
                    <Text style={styles.optionText}>Concluir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.optionItem} onPress={onEdit}>
                    <Feather name="edit-3" size={16} color="#3b82f6" />
                    <Text style={styles.optionText}>Editar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          <Text style={styles.infoText}>Nome do Contato: {item.contato}</Text>
          <Text style={styles.infoText}>Local do Encontro: {item.localEncontro}</Text>
          <Text style={styles.infoText}>Método de Contato: {item.metodoContato}</Text>
          <Text style={styles.infoText}>Localização: {item.localizacao}</Text>
          <Text style={styles.infoText}>Feedback: {item.feedback}</Text>
          <Text style={styles.infoText}>Data: {item.data}</Text>
          <Text style={styles.infoText}>Hora: {item.hora}</Text>
        </View>
      )}
    </>
  );
};

const Tasks = ({ searchTerm: propSearchTerm }: { searchTerm?: string }) => {
  const navigation = useNavigation<TasksNavigationProp>();
  const route = useRoute<TasksRouteProp>();
  
  const searchTerm = propSearchTerm || route.params?.searchTerm || '';
  const [selectedStatus, setSelectedStatus] = useState('progress');
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [showEdit, setShowEdit] = useState<number | null>(null);


  const fetchTasks = async () => {
    try {
      const response = await api.get('/api/lead-tasks');
      const backendTasks = response.data.map((task: any) => ({
        id: task.leadTaskId,
        title: task.contact,
        status: convertStatus(task.taskStatus),
        contato: task.contact || '',
        localEncontro: task.place || '',
        metodoContato: task.contactMethod || '',
        localizacao: task.place || '',
        feedback: task.feedback || '',
        data: new Date(task.taskBegin).toLocaleDateString('pt-BR'),
        hora: new Date(task.taskBegin).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        leadId: task.lead?.leadId,
        leadName: task.lead?.company?.companyName || 'Lead sem nome',
        avatarUrl: task.createdBy?.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg',
      }));
      setAllTasks(backendTasks);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const tasksToShow =
  selectedStatus === 'done' || selectedStatus === 'cancelled'
    ? allTasks.filter((task) => task.status === selectedStatus)
    : allTasks.filter(
        (task) => task.status !== 'done' && task.status !== 'cancelled'
      );

const tasksByLead = tasksToShow.reduce((acc: any, task: any) => {
  const leadKey = String(task.leadId); // garante que sempre é string
  if (!acc[leadKey]) {
    acc[leadKey] = {
      leadName: task.leadName,
      tasks: [],
    };
  }
  acc[leadKey].tasks.push(task);
  return acc;
}, {});
  
  
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
  const task = allTasks.find((t) => t.id === id);

  if (!task) return;

  try {
    await api.put(`/api/lead-tasks/${id}`, {
      contact: task.title,
      place: task.localEncontro,
      contactMethod: task.metodoContato,
      feedback: task.feedback,
      taskBegin: new Date().toISOString(),
      taskEnd: new Date().toISOString(),
      taskStatus: convertStatusToBackend(newStatus),
      lead: { leadId: task.leadId },
    });

    setAllTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: newStatus } : t
      )
    );
  } catch (error) {
    console.error('Erro ao atualizar status da tarefa:', error);
  }
};

const handleEdit = (id: number) => {
  const taskToEdit = allTasks.find(task => task.id === id);
  if (taskToEdit) {
    navigation.navigate('FormTask', {
      task: {
        id: taskToEdit.id,
        contact: taskToEdit.contato,
        place: taskToEdit.localEncontro,
        contactMethod: taskToEdit.metodoContato,
        feedback: taskToEdit.feedback,
        taskBegin: taskToEdit.data,
        taskEnd: taskToEdit.data,
        taskStatus: convertStatusToBackend(taskToEdit.status),
      },
      isEditing: true,
      leadId: taskToEdit.leadId,
    });
  }
};


  const filteredTasks =
  selectedStatus === 'done' || selectedStatus === 'cancelled'
    ? allTasks.filter((task) => task.status === selectedStatus)
    : allTasks.filter(
        (task) => task.status !== 'done' && task.status !== 'cancelled'
      );

  const tabs = [
    { label: 'Em progresso', value: 'progress' },
    { label: 'Cancelado', value: 'cancelled' },
    { label: 'Concluído', value: 'done' },
  ];

  return (
     <TouchableWithoutFeedback onPress={() => setShowEdit(null)}>
    <View style={styles.container}>
      <Text style={styles.title}>Tarefas ativas</Text>
      <View style={styles.tabs}>
        {tabs.map(tab => (
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
  {Object.entries(tasksByLead as Record<string, { leadName: string; tasks: Task[] }>).map(
    ([leadId, { leadName, tasks }]) => (
      <View key={leadId} style={styles.leadCard}>
        <View style={styles.headerRow}>
          <Text style={styles.leadName}>{leadName}</Text>
        </View>

        <View style={styles.expandedInfo}>
          {tasks.map((task) => (
            <View key={task.id} style={{ zIndex: showEdit === task.id ? 999 : 1 }}>
            <View key={task.id} style={styles.taskCard}>
              <Text style={styles.taskText}>{task.title}</Text>

              <TouchableOpacity
                onPress={() => setShowEdit(showEdit === task.id ? null : task.id)}
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

          <TouchableOpacity
            style={styles.addTaskBtn}
            onPress={() =>
              navigation.navigate('FormTask', { leadId: Number(leadId) })

            }
          >
            
          </TouchableOpacity>
        </View>
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
  taskItem: {
    backgroundColor: '#e5e7eb',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  taskTitle: { fontWeight: '600', fontSize: 14, flex: 1 },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ownerImage: { width: 24, height: 24, borderRadius: 12 },
  emptyText: { textAlign: 'center', color: '#6b7280', marginTop: 20 },
  extraInfo: {
    marginTop: 10,
    marginBottom: 16,
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 8,
    position: 'relative',
  },
  infoText: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
  },
  moreIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    zIndex: 10,
  },
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
  elevation: 10, // 🔥 importante para Android
  zIndex: 999,   // 🔥 importante para sobrepor
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
leadName: {
  fontSize: 14,
  fontWeight: '600',
  flex: 1,
},
expandedInfo: {
  marginTop: 10,
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
  position: 'relative',
},
taskText: {
  fontSize: 13,
  color: '#111827',
},
addTaskBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 8,
},
addTaskText: {
  fontSize: 12,
  color: '#000',
  marginLeft: 4,
},
});

export default Tasks;
