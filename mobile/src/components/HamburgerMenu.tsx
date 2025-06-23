import React from 'react';
import { TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

type Props = {
  onPress: () => void;
};

const HamburgerMenu = ({ onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Feather name="menu" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default HamburgerMenu;
