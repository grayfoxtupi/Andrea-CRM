import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface TextAreaProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

const TextArea = ({ label, value, onChangeText }: TextAreaProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        style={styles.input} 
        value={value} 
        onChangeText={onChangeText} 
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        placeholder={label.toLowerCase()}
        placeholderTextColor="#7D8592"
      />
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'transparent',
    minHeight: 120, // maior que o input padrão
  },
});

export default TextArea;
