import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
}

const Button = ({ title, onPress }: ButtonProps) => {
  return (
    <View style={{ alignItems: 'center' }}>
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
    </View>
 
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: 50,
    width: 200,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'NunitoSans-Bold',
    fontSize: 16,
  },
});

export default Button;
