import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

type Props = {
  placeholder: string;
  onChangeText?: (text: string) => void;
};

const SearchBar = ({ placeholder, onChangeText }: Props) => {
  return (
    <View style={styles.container}>
      <Feather name="search" size={18} color="black" style={styles.icon} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        style={styles.input}
        onChangeText={onChangeText}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 50,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
});

export default SearchBar;
