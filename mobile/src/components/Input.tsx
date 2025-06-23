import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  placeholder?: string;
  showToggleVisibilityIcon?: boolean; // 👈 nova prop
}

const Input = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  placeholder,
  showToggleVisibilityIcon = false,
}: InputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!isPasswordVisible && secureTextEntry}
          placeholder={placeholder || label.toLowerCase()}
          placeholderTextColor="#7D8592"
        />
        {showToggleVisibilityIcon && (
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Icon
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={20}
              color="#7D8592"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
    color: '#7D8592',
    fontWeight: '500',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'transparent',
    height: 50,
    paddingRight: 40, 
  },
  icon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
});

export default Input;
