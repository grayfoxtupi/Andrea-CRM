import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Input from '../components/Input';
import Button from '../components/Button';
import { RootStackParamList } from '../../App'; 

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [remember, setRemember] = useState(false);
  const navigation = useNavigation<NavigationProps>();

  return (
    <ImageBackground source={require('../images/rosa.png')} style={styles.background}>
      <Image source={require('../images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Recupere sua senha</Text>

      <Input label="Endereço de email" value={email} onChangeText={setEmail} />

      <Button title="Enviar" onPress={() => {}} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Voltar ao login</Text>
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
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#7D8592',
    fontWeight: '500',
  },
});

export default ForgotPassword;
