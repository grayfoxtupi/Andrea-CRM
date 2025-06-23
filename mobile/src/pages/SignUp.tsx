import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Input from '../components/Input';
import Button from '../components/Button';
import { RootStackParamList } from '../../App';

//API 
import api from '../services/api';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remember, setRemember] = useState(false);


  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    try {
      const response = await api.post('/users', {
        name: name,
        email: email,
        password: password,
      });
      
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível realizar o cadastro');
      console.error('Signup error:', error);
    }
  };

  const navigation = useNavigation<NavigationProps>();

  return (
    <ImageBackground
      source={require('../images/rosa.png')}
      style={styles.background}
    >
      <Image source={require('../images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Registre-se para a Andrea</Text>

      <Input label="Nome completo" value={name} onChangeText={setName} />
      <Input
        label="E-mail"
        value={email}
        onChangeText={setEmail}
      />

      <Input
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        showToggleVisibilityIcon
      />

      <Input
        label="Confirme sua senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        showToggleVisibilityIcon
      />
      

      <View style={styles.checkboxContainer}>
        <CheckBox value={remember} onValueChange={setRemember} />
        <Text style={styles.checkboxLabel}>Lembre-me</Text>
      </View>

      <Button title="Registre-se" onPress={handleSignUp}/>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Já tem uma conta?</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkboxLabel: {
    marginLeft: 8,
    color: '#7D8592',
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#7D8592',
    fontWeight: '500',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 40,
  },
});

export default SignUp;
