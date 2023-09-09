import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';

const NoteScreen = ({ isVisible, onSave, onCancel }) => {
  const [note, setNote] = useState('');

  const handleSave = () => {
    onSave(note);
    setNote('');
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={{ flex: 1 }}>
        <TextInput
          placeholder="Enter note here..."
          multiline
          value={note}
          onChangeText={(text) => setNote(text)}
        />
        <TouchableOpacity onPress={handleSave}>
          <Text>Save Note</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default NoteScreen;
