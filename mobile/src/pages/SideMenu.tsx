import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

type Props = {
  onClose: () => void;
  animationValue: Animated.Value;
  onNavigate: (screen: string) => void;
};

const SideMenu = ({ onClose, animationValue, onNavigate }: Props) => {
  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[styles.menu, { transform: [{ translateX: animationValue }] }]}
      >
        <Image
          source={require('../images/logo-SideMenu.png')}
          style={styles.logo}
        />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => onNavigate('Leads')}
        >
          <Feather name="grid" size={20} color="#fff" />
          <Text style={styles.menuText}>Leads</Text>
          <Feather name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => onNavigate('Tasks')}
        >
          <Feather name="check-circle" size={20} color="#fff" />
          <Text style={styles.menuText}>Tarefas</Text>
          <Feather name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => onNavigate('Clients')}
        >
          <Feather name="briefcase" size={20} color="#fff" />
          <Text style={styles.menuText}>Clientes</Text>
          <Feather name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => onNavigate('ClientTasks')}
        >  
          <Feather name="check-circle" size={20} color="#fff" />
          <Text style={styles.menuText}>Tarefas Clientes</Text>
          <Feather name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => onNavigate('Schedule')}
        >
          <Feather name="calendar" size={20} color="#fff" />
          <Text style={styles.menuText}>Agenda</Text>
          <Feather name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  menu: {
    width: '70%',
    backgroundColor: '#000',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  subTitle: {
    fontSize: 10,
    color: '#ccc',
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default SideMenu;
