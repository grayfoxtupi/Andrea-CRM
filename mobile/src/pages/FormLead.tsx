import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Input from '../components/Input';
import { createCompany, createLead } from '../services/leadService';

const FormLeads = () => {
  // Lead
  //const [nome, setNome] = useState(''); //nome 
  const [meioContato, setMeioContato] = useState('');
  const [localContato, setLocalContato] = useState('');
  const [produtosServicos, setProdutosServicos] = useState(''); //offer


  // Empresa
  const [razaoSocial, setRazaoSocial] = useState(''); //company_name ou fantasia
  const [cnpjCpf, setCnpjCpf] = useState('');
  const [descricao, setDescricao] = useState(''); //description
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [areaAtuacao, setAreaAtuacao] = useState('');
  
  const navigation = useNavigation();

  const validarEmail = (email: string) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const validarTelefone = (telefone: string) => {
    const regex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    return regex.test(telefone);
  };

  const formatarCnpjCpf = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');

    if (numeros.length <= 11) {
      return numeros.replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      return numeros.replace(/(\d{2})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1/$2')
                    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
  };

  const handleCreateLead = async () => {
    if (!meioContato || !localContato || !cnpjCpf || !areaAtuacao || !produtosServicos || !descricao || !email || !telefone) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert('Erro', 'E-mail inválido.');
      return;
    }

    if (!validarTelefone(telefone)) {
      Alert.alert('Erro', 'Telefone inválido. Ex: (11) 99999-9999');
      return;
    }

    try {

      //  Criar empresa
      const empresaResponse = await createCompany({
        companyName: razaoSocial,
        cnpj: cnpjCpf,
        description: descricao,
        companyEmail: email,
        companyPhoneNumber: telefone,
        businessArea: areaAtuacao,
      });

      const companyId = empresaResponse.companyId;

      //  Criar lead
      const leadResponse = await createLead({
        company: { companyId },
        date: new Date().toISOString().split('T')[0],
        communicationChannel: meioContato,
        location: localContato,
        offer: produtosServicos,
        isLead: true,
      });

      const leadId = leadResponse.leadId;

      //Sucesso
      Alert.alert('Sucesso', 'Lead e tarefa criados com sucesso!');
      navigation.goBack();

    } catch (error) {
      console.error('Erro ao criar lead e tarefa:', error);
      Alert.alert('Erro', 'Não foi possível criar o lead e a tarefa.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Feather name="x" size={24} color="#0F172A" />
      </TouchableOpacity>

      <View style={styles.formWrapper}>

        <Text style={styles.title}>Novo Lead</Text>  
        <Input label="Meio de contato" value={meioContato} onChangeText={setMeioContato} />
        <Input label="Local de contato" value={localContato} onChangeText={setLocalContato} />
        <Input label="Serviços/Produtos" value={produtosServicos} onChangeText={setProdutosServicos} />

        <Text style={styles.subTitle}>Dados da Empresa</Text>
        <Input label="Razão Social" value={razaoSocial} onChangeText={setRazaoSocial} />     
        <Input
          label="CNPJ/CPF"
          value={cnpjCpf}
          onChangeText={(valor) => setCnpjCpf(formatarCnpjCpf(valor))}
        />    
        <Input label="Descrição" value={descricao} onChangeText={setDescricao} />
        <Input label="Email" value={email} onChangeText={setEmail} />
        <Input label="Telefone" value={telefone} onChangeText={setTelefone} placeholder="(11) 99999-9999" />
        <Input label="Área de Atuação" value={areaAtuacao} onChangeText={setAreaAtuacao} />       

        <TouchableOpacity style={styles.button} onPress={handleCreateLead}>
          <Text style={styles.buttonText}>Criar Lead</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
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
    marginTop: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 24,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
    marginTop: 24,
    marginBottom: 12,
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

export default FormLeads;
