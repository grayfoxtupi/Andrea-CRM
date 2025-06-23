import React, {useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import Input from '../components/Input';
import Button from '../components/Button';
import {RootStackParamList} from '../../App';

//API
import api from '../services/api';
import {Alert} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const navigation = useNavigation<NavigationProps>();

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', {
        username: email,
        password: password,
      });

      const token = response.data.token;
      console.log('Token JWT:', token);

      await AsyncStorage.setItem('token', token);

      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Erro', 'Email ou senha incorretos');
      console.error('Login error:', error);
    }
  };

  return (
    <ImageBackground
      source={require('../images/rosa.png')}
      style={styles.background}>
      <Image source={require('../images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Entre na sua área</Text>

      <Input label="Endereço de email" value={email} onChangeText={setEmail} />
      <Input
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        showToggleVisibilityIcon
      />

      <View style={styles.checkboxRow}>
        <View style={styles.checkboxContainer}>
          <CheckBox value={remember} onValueChange={setRemember} />
          <Text style={styles.checkboxLabel}>Lembre-me</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>Não possui conta?</Text>
        </TouchableOpacity>
      </View>

      <Button title="Acessar" onPress={handleLogin} />

      <Text
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.link}>
        Esqueci minha senha
      </Text>
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
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
    color: '#7D8592',
  },
  signupLink: {
    color: '#7D8592',
    fontWeight: '500',
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#7D8592',
  },
});

export default Login;
