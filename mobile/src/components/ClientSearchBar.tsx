import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

interface Props {
  placeholder: string;
  onChangeText: (text: string) => void;
  value?: string;
}

const ClientSearchBar = ({ placeholder, onChangeText, value }: Props) => {
  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color="#6B7280" style={styles.icon} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        onChangeText={onChangeText}
        value={value}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 0,
  },
});

export default ClientSearchBar;
