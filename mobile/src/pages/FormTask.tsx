import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import { FormTaskNavigationProp, FormTaskRouteProp } from '../types/navigation';
import { createLeadTask, updateLeadTask } from '../services/leadTaskService';
import { addNotification } from '../services/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FormTask = () => {
  const navigation = useNavigation<FormTaskNavigationProp>();
  const route = useRoute<FormTaskRouteProp>();
  const { task, isEditing, leadId } = route.params || {};

  useEffect(() => {
  if (!leadId) {
    Alert.alert(
      'Erro',
      'Tarefa não pode ser criada. Selecione um Lead.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  }
}, [leadId]);

useEffect(() => {
  if (!leadId) {
    Alert.alert(
      'Erro',
      'Lead não informado. A tarefa precisa estar vinculada a um lead.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  }
}, [leadId]);

useEffect(() => {
  if (isEditing && task) {
    setContato(task.contact || '');
    setLocalEncontro(task.place || '');
    setMetodoContato(task.contactMethod || '');
    setFeedback(task.feedback || '');
  }
}, [isEditing, task]);

  const [contato, setContato] = useState('');
  const [localEncontro, setLocalEncontro] = useState('');
  const [metodoContato, setMetodoContato] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [feedback, setFeedback] = useState('');

  const [data, setData] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [showDataPicker, setShowDataPicker] = useState(false);
  const [showHoraPicker, setShowHoraPicker] = useState(false);

  useEffect(() => {
    if (isEditing && task) {
      setContato(task.contact || '');
      setLocalEncontro(task.place || '');
      setMetodoContato(task.contactMethod || '');
      setFeedback(task.feedback || '');
    }
  }, [isEditing, task]);

  const handleSubmit = async () => {
    if (
      !contato ||
      !localEncontro ||
      !metodoContato ||
      !feedback
    ) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const taskData = {
      contact: contato,
      place: localEncontro,
      contactMethod: metodoContato,
      feedback: feedback,
      taskBegin: data.toISOString(),
      taskEnd: data.toISOString(),
      lead: { leadId: leadId }, 
      taskStatus: isEditing ? task.taskStatus : 'Em processo',
    };
  
    try {
      const userData = await AsyncStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : {};
      const userName = user.fullName || 'Usuário';
  
      if (isEditing && task?.id) {
        await updateLeadTask(task.id, taskData);
  
        await addNotification({
          id: Date.now(),
          userName,
          companyName: localEncontro,
          date: `${data.toLocaleDateString('pt-BR')} às ${hora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
          type: 'editada',
        });
  
        Alert.alert('Sucesso', 'Tarefa atualizada com sucesso!');
      } else {
        await createLeadTask(taskData);
  
        await addNotification({
          id: Date.now(),
          userName,
          companyName: localEncontro,
          date: `${data.toLocaleDateString('pt-BR')} às ${hora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
          type: 'criada',
        });
  
        Alert.alert('Sucesso', 'Tarefa criada com sucesso!');
      }
  
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a tarefa.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Feather name="x" size={24} color="#0F172A" />
      </TouchableOpacity>

      <View style={styles.formWrapper}>
        <Text style={styles.title}>{isEditing ? 'Editar Tarefa' : 'Nova tarefa'}</Text>

        <Input label="Nome do Contato" value={contato} onChangeText={setContato} />
        <Input label="Local de Encontro" value={localEncontro} onChangeText={setLocalEncontro} />
        <Input label="Metodo de Contato" value={metodoContato} onChangeText={setMetodoContato} />
        <Input label="Localização" value={localizacao} onChangeText={setLocalizacao} />

        <View style={styles.dateTimeRow}>
          <TouchableOpacity style={styles.datePicker} onPress={() => setShowDataPicker(true)}>
            <Text style={styles.label}>Escolha uma Data</Text>
            <View style={styles.dateDisplay}>
              <Text style={styles.dateText}>
                {data.toLocaleDateString('pt-BR')}
              </Text>
              <Feather name="calendar" size={16} color="#000" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.datePicker} onPress={() => setShowHoraPicker(true)}>
            <Text style={styles.label}>Hora</Text>
            <View style={styles.dateDisplay}>
              <Text style={styles.dateText}>
                {hora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Feather name="clock" size={16} color="#000" />
            </View>
          </TouchableOpacity>
        </View>

        {showDataPicker && (
          <DateTimePicker
            value={data}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDataPicker(false);
              if (selectedDate) setData(selectedDate);
            }}
          />
        )}

        {showHoraPicker && (
          <DateTimePicker
            value={hora}
            mode="time"
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedTime) => {
              setShowHoraPicker(false);
              if (selectedTime) setHora(selectedTime);
            }}
          />
        )}

        <TextArea label="Feedback" value={feedback} onChangeText={setFeedback} />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isEditing ? 'Salvar' : 'Salvar tarefa'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 8,
    zIndex: 1,
  },
  formWrapper: {
    marginTop: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 24,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePicker: {
    flex: 1,
    marginRight: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 14,
    color: '#111827',
  },
  button: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'flex-end',
    marginTop: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default FormTask;
