import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

const EmailDeliveryPopup = ({
  isVisible,
  onYesPress,
  onNoPress,
  onClosePress,
}) => {
  return (
    <Modal isVisible={isVisible}>
      <View
        style={{
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1,
            backgroundColor: "red",
            padding: 2,
            paddingHorizontal: 5,
          }}
          onPress={onClosePress}
        >
          <Text>X</Text>
        </TouchableOpacity>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
          }}
        >
          <Text>Is the email delivered?</Text>
          <View
            style={{
              flexDirection: "row", // Arrange buttons horizontally
              justifyContent: "space-around", // Space between buttons
              paddingHorizontal: 20, // Add horizontal padding for spacing
              paddingVertical: 20,
            }}
          >
            <TouchableOpacity style={styles.button} onPress={onYesPress}>
              <Text>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onNoPress}>
              <Text>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EmailDeliveryPopup;

const styles = StyleSheet.create({
  button: {
    margin: 10,
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
