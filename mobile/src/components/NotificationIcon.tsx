import React from 'react';
import { TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

type Props = {
  onPress: () => void;
};

const NotificationIcon = ({ onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Feather name="bell" size={24} color="black" />
    </TouchableOpacity>
  );
};

export default NotificationIcon;
