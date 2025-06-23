import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { createClientTask, updateClientTask } from '../services/clientTaskService';



const FormTaskClient = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'FormClientTask'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'FormClientTask'>>();
  const { task, isEditing, clientId } = route.params;

  const [tema, setTema] = useState('');
  const [descricao, setDescricao] = useState('');
  const [notas, setNotas] = useState('');
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());

  const [showDateInicio, setShowDateInicio] = useState(false);
  const [showDateFim, setShowDateFim] = useState(false);

  useEffect(() => {
    if (isEditing && task) {
      setTema(task.meetingTopic || '');
      setDescricao(task.projectDescription || '');
      setNotas(task.notes || '');
      setDataInicio(new Date(task.taskBegin));
      setDataFim(new Date(task.taskEnd));
    }
  }, [isEditing, task]);

  const handleSubmit = async () => {
    if (!tema || !descricao || !notas) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const taskData = {
        meetingTopic: tema,
        taskBegin: dataInicio.toISOString().split('T')[0],
        taskEnd: dataFim.toISOString().split('T')[0],
        projectDescription: descricao,
        notes: notas,
        client: { clientId: clientId }, 
    };

    try {
      if (isEditing && task?.id) {
        await updateClientTask(task.id, taskData);
        Alert.alert('Sucesso', 'Tarefa atualizada com sucesso!');
      } else {
        await createClientTask(taskData);
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

      <Text style={styles.title}>{isEditing ? 'Editar Tarefa Cliente' : 'Nova Tarefa Cliente'}</Text>

      <Input label="Tema da Reunião" value={tema} onChangeText={setTema} />
      <Input label="Descrição do Projeto" value={descricao} onChangeText={setDescricao} />
      <TextArea label="Notas" value={notas} onChangeText={setNotas} />

      <TouchableOpacity onPress={() => setShowDateInicio(true)} style={styles.datePicker}>
        <Text>Data de Início: {dataInicio.toLocaleDateString('pt-BR')}</Text>
      </TouchableOpacity>
      {showDateInicio && (
        <DateTimePicker
          value={dataInicio}
          mode="date"
          onChange={(event, selectedDate) => {
            setShowDateInicio(false);
            if (selectedDate) setDataInicio(selectedDate);
          }}
        />
      )}

      <TouchableOpacity onPress={() => setShowDateFim(true)} style={styles.datePicker}>
        <Text>Data de Fim: {dataFim.toLocaleDateString('pt-BR')}</Text>
      </TouchableOpacity>
      {showDateFim && (
        <DateTimePicker
          value={dataFim}
          mode="date"
          onChange={(event, selectedDate) => {
            setShowDateFim(false);
            if (selectedDate) setDataFim(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isEditing ? 'Salvar' : 'Criar Tarefa'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  closeButton: { position: 'absolute', top: 50, right: 16, zIndex: 10 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  datePicker: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});

export default FormTaskClient;
