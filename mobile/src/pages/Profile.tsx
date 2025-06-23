import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Input from '../components/Input';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import api from '../services/api';

const Profile = () => {
  const navigation = useNavigation();

  const [userId, setUserId] = useState<number>(1); // Suponha que você sabe qual o ID do usuário logado
  const [avatarUri, setAvatarUri] = useState('https://randomuser.me/api/portraits/lego/1.jpg');
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/api/users/${userId}`);
        const userData = response.data;

        setNome(userData.fullName || '');
        setEmail(userData.email || '');
        setAvatarUri(userData.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg');
        setCargo(userData.position || '');
        setEmpresa(userData.company || '');
        setLocalizacao(userData.location || '');
        setDataNascimento(userData.birthDate || '');
        setTelefone(userData.phone || '');
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  const selecionarImagem = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Erro', 'Erro ao selecionar imagem.');
          return;
        }

        const uri = response.assets?.[0]?.uri;
        if (uri) {
          setAvatarUri(uri);
        }
      },
    );
  };

  const handleSalvar = async () => {
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    const perfilAtualizado = {
      fullName: nome,
      email,
      avatarUrl: avatarUri,
      position: cargo,
      company: empresa,
      location: localizacao,
      birthDate: dataNascimento,
      phone: telefone,
      password: senha !== '' ? senha : undefined, // Só manda senha se ela foi preenchida
    };

    try {
      await api.put(`/api/users/${userId}`, perfilAtualizado);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Falha ao atualizar perfil.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Feather name="chevron-left" size={28} color="#0F172A" />
      </TouchableOpacity>

      <View style={styles.avatarWrapper}>
        <TouchableOpacity onPress={selecionarImagem}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.editIcon} onPress={selecionarImagem}>
          <Feather name="edit-3" size={18} color="#000" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Informações pessoais</Text>
      <Input label="Nome completo" value={nome} onChangeText={setNome} />
      <Input label="Cargo" value={cargo} onChangeText={setCargo} />
      <Input label="Empresa" value={empresa} onChangeText={setEmpresa} />
      <Input
        label="Localização"
        value={localizacao}
        onChangeText={setLocalizacao}
      />
      <Input
        label="Data de nascimento"
        value={dataNascimento}
        onChangeText={setDataNascimento}
      />

      <Text style={styles.sectionTitle}>Informações de contato</Text>
      <Input label="E-mail" value={email} onChangeText={setEmail} />
      <Input label="Telefone" value={telefone} onChangeText={setTelefone} />

      <Text style={styles.sectionTitle}>Informações da conta</Text>
      <Input
        label="Editar senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        showToggleVisibilityIcon
      />
      <Input
        label="Confirmar senha"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
        showToggleVisibilityIcon
      />

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    paddingBottom: 48,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#06d6a0',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 115,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 24,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'flex-end',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default Profile;
