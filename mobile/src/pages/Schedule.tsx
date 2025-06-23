import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import api from '../services/api';

type MarkedDate = {
    selected?: boolean;
    marked?: boolean;
    selectedColor?: string;
    dotColor?: string;
  };

const Schedule = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [tasks, setTasks] = useState<any[]>([]);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [markedDates, setMarkedDates] = useState<Record<string, MarkedDate>>({});

  function getToday() {
    return new Date().toISOString().split('T')[0];
  }

  const fetchTasks = async () => {
    try {
      const response = await api.get('/api/lead-tasks');
      const data = response.data.map((task: any) => ({
        id: task.leadTaskId,
        title: task.contact,
        description: task.feedback,
        date: task.taskBegin.split('T')[0],
        time: new Date(task.taskBegin).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
      setAllTasks(data);
      setTasksForDate(getToday(), data);
      highlightDatesWithTasks(data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  const highlightDatesWithTasks = (data: any[]) => {
    const newMarks: any = {};
    data.forEach(task => {
      if (!newMarks[task.date]) {
        newMarks[task.date] = {
          marked: true,
          dotColor: '#3B82F6',
        };
      }
    });
    setMarkedDates(newMarks);
  };

  const tasksForDate = (date: string) => {
    return allTasks.filter(task => task.date === date);
  };

  const setTasksForDate = (date: string, all: any[]) => {
    setTasks(all.filter(task => task.date === date));
  };

  const handleDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
    setTasksForDate(day.dateString, allTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View
      style={[
        styles.taskCard,
        index === 0 && styles.activeCard,
      ]}
    >
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskTime}>{index === 0 ? 'Agora' : item.time}</Text>
      <Text style={styles.taskDescription} numberOfLines={1}>
        {item.description || 'Reunião sobre...'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Feather name="chevron-left" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.dateText}>
        {new Date(selectedDate).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}
      </Text>
      <Text style={styles.heading}>Hoje</Text>

      <Calendar
        current={selectedDate}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            selected: true,
            selectedColor: '#3B82F6',
            marked: markedDates[selectedDate]?.marked,
            dotColor: '#3B82F6',
          },
        }}
        onDayPress={handleDateSelect}
        theme={{
          todayTextColor: '#3B82F6',
          selectedDayBackgroundColor: '#3B82F6',
          selectedDayTextColor: '#fff',
        }}
      />

      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        style={{ marginTop: 16 }}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  backBtn: {
    marginBottom: 16,
  },
  dateText: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 4,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  taskCard: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  activeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  taskTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#111827',
  },
  taskTime: {
    position: 'absolute',
    right: 12,
    top: 12,
    color: '#6B7280',
    fontSize: 13,
  },
  taskDescription: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280',
  },
});

export default Schedule;
