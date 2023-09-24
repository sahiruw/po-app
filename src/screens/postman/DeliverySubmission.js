import React, {
  createRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Switch,
  TextInput,
  Button,
} from "react-native";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";

import { SketchCanvas } from "rn-perfect-sketch-canvas";
import AppbarC from "../../components/AppBarC";
import LoadingScreen from "../LoadingScreen";
import { MailListContext } from "../../contextStore/MailListProvider";
import userUtils from "../../utils/userUtils";
import BottomBox from "../../components/BottomBox";
import { useTheme } from "../../assets/theme/theme";
import mailItemService from "../../services/mailItemService";
import { AppConstants } from "../../assets/constants";

const DeliverySubmission = ({ route, navigation }) => {
  const { mailList, setMailList } = useContext(MailListContext);
  var { theme } = useTheme();
  const [isMailDelivered, setIsMailDelivered] = useState(
    route.params?.isMailDelivered
  );
  const [selectedMarker, setSelectedMarker] = useState(route.params?.marker);
  const canvasRef = useRef();
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    // setIsLoading(true)
    let data = {
      status: AppConstants.MailDeliveryAttemptStatus.Failed,
      note: note,
      timestamp: new Date(),
    };

    if (isMailDelivered) {
      const imageURI = await canvasRef.current?.toBase64()
      data = {
        status: AppConstants.MailDeliveryAttemptStatus.Delivered,
        sign: imageURI,
        timestamp: new Date(),
      };
    }

    let res = await mailItemService.updateMailItemdeliveryStatus(
      selectedMarker,
      data
    );

    setIsLoading(false)
    if (res) {
      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: `Mail item status updated successfully.`,
        button: "Okay",
      });
      navigation.goBack();
    } else {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Unsuccessful",
        textBody: `Mail item status update failed.`,
        button: "Okay",
      });
    }
  };

  return (
    <>
      <AppbarC title="Update Status" showBackButton={true} />
      {/* <Text>{JSON.stringify(hehe)}</Text> */}
      {isLoading && <LoadingScreen/>}
      <View style={styles.container}>
        {isMailDelivered && (
          <>
            <Text style={{ padding: 20 }}>
              {"Ask for signature from " +
                userUtils.formatName(selectedMarker?.receiver_name)}
            </Text>
            <SketchCanvas
              ref={canvasRef}
              strokeColor={"black"}
              strokeWidth={5}
              containerStyle={{
                flex: 1,
                borderWidth: 1, // Add border width
                borderColor: "black",
                marginRight: 10,
                marginTop: 10,
                marginLeft: 10,
                borderStyle: "dashed",
              }}
            />
            <View style={styles.container2}>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.lightBackgroundColor3 },
                ]}
                onPress={() => {
                  canvasRef.current?.reset();
                }}
              >
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.lightBackgroundColor3 },
                ]}
                onPress={() => {
                  canvasRef.current?.undo();
                }}
              >
                <Text style={styles.buttonText}>Undo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.lightBackgroundColor3 },
                ]}
                onPress={() => {
                  canvasRef.current?.redo();
                }}
              >
                <Text style={styles.buttonText}>Redo</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {!isMailDelivered && (
          <>
            <Text style={{ padding: 20 }}>
              Enter a not about the failure of delivery
            </Text>
            <TextInput
              placeholder="Enter note here..."
              multiline
              value={note}
              onChangeText={(text) => setNote(text)}
              style={styles.inputField}
            />
          </>
        )}
      </View>

      <View
        style={[
          styles.greenBox,
          { backgroundColor: theme.lightBackgroundColor3 },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.lightBackgroundColor2, top: 20 },
          ]}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.lightBackgroundColor2, top: 50 },
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  greenBox: {
    height: 250,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    paddingHorizontal: 50,
  },
  inputField: {
    backgroundColor: "white",
    padding: 10,
    height: 250,
    borderWidth: 1,
    borderColor: "black",
    marginRight: 10,
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    flex: 1,
  },
  markerInfo: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    flexDirection: "column",
    alignItems: "center",
    zIndex: 1, // Ensure the popup is above the overlay
  },

  sign: {
    zIndex: 2, // Ensure the popup is above the overlay
  },
  button: {
    marginTop: 10,
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
    // width: 250,
    alignItems: "center",
  },
  openInMapsButton: {
    marginTop: 10,
    backgroundColor: "lightgreen",
    padding: 10,
    borderRadius: 5,
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    zIndex: 0, // Place the overlay behind the popup
  },

  container2: {
    flexDirection: "row", // Arrange buttons horizontally
    justifyContent: "space-evenly", // Space between buttons
    paddingHorizontal: 20, // Add horizontal padding for spacing
    paddingVertical: 20,
  },
});

export default DeliverySubmission;
