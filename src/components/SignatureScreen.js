import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import SignatureCapture from 'react-native-signature-capture';

const SignatureScreen = ({ isVisible, onSave, onCancel }) => {
  const signatureRef = useRef();

  const handleSave = async () => {
    if (signatureRef.current) {
      const signature = await signatureRef.current.saveImage();
      onSave(signature);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={{ flex: 1 }}>
        <SignatureCapture
          ref={signatureRef}
          onSaveEvent={handleSave}
        />
        <TouchableOpacity onPress={onCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SignatureScreen;
