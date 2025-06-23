import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useEffect } from "react";
import Feather from 'react-native-vector-icons/Feather';



interface FilterOverlayProps {
  visible: boolean;
  onClose: () => void;
  onSave: (selected: string) => void;
  onClear: () => void;
  appliedFilter: string | null; 
}


const OPTIONS = ['Mais recentes', 'Mais antigos'];

const FilterOverlay: React.FC<FilterOverlayProps> = ({
  visible,
  onClose,
  onSave,
  onClear,
  appliedFilter,
}) => {
 
  useEffect(() => {
    setSelectedOption(appliedFilter);
  }, [appliedFilter]);
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSave = () => {
    if (selectedOption) {
      onSave(selectedOption);
    }
    onClose();
  };

  
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClear}>
              <Text style={styles.clearText}>Limpar</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Ordenar</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subheading}>Selecionar</Text>
          {OPTIONS.map(option => (
            <Pressable
              key={option}
              style={styles.optionRow}
              onPress={() => handleOptionSelect(option)}>
              <View style={styles.radioCircle}>
                {selectedOption === option && (
                  <View style={styles.selectedDot} />
                )}
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          ))}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'flex-start',
  },
  content: {
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 32,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 100,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearText: {
    color: '#6B7280',
    fontSize: 14,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  subheading: {
    marginTop: 24,
    marginBottom: 12,
    fontWeight: '600',
    fontSize: 14,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
  },
  saveButton: {
    marginTop: 'auto',
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default FilterOverlay;
