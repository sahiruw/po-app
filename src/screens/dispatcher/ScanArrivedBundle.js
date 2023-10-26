import React, { useEffect, useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";

import { useTheme } from "../../assets/theme/theme";
import userService from "../../services/userService";

import AppBarC from "../../components/AppBarC";
import mailItemService from "../../services/mailItemService";
import { BarCodeScanner } from "expo-barcode-scanner";
import bundleService from "../../services/bundleService";
import postOfficeService from "../../services/postOfficeService";
import LoadingScreen from "../../screens/LoadingScreen";

const ScanArrived = ({ navigation }) => {
  var { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [scannedBarcode, setScannedBarcode] = useState(true);
  const [scannedValue, setScannedValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    const retrieveUser = async () => {
      let user = await userService.getActiveUserData();
      setUser(user);
    };
    retrieveUser();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setSubmitted(false);
    setScannedBarcode(true);

    const retrieveBundle = async () => {
      setLoading(true);
      let bundleData = await bundleService.getBundleDataByID(data);
      console.log(bundleData);
      console.log(user.postoffice);
      let isValidBundle =
        bundleData?.destination_post_office_id == user.postoffice;

      if (isValidBundle) {
        let fromPO = await postOfficeService.getDetailsofPostofficeByID(
          bundleData.origin_post_office_id
        );
        let toPO = await postOfficeService.getDetailsofPostofficeByID(
          bundleData.destination_post_office_id
        );
        bundleData = { fromPO, toPO, ...bundleData, bundleID: data };

        setScannedValue(bundleData);
      }
      setLoading(false);
      return isValidBundle;
    };

    let isValidBundle = await retrieveBundle();
    if (!isValidBundle) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Invalid Bundle",
        textBody: `The bundle ${data} is not valid for this post office.`,
        button: "Okay",
      });
    } else {
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Successfull",
        textBody: `The bundle ${data} has been scanned.`,
        button: "Okay",
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    let bundleData = scannedValue;

    // setScannedValue(null);
    await bundleService.acceptBundle(bundleData);
    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: "Successfull",
      textBody: `The bundle ${bundleData.bundleID} has been marked as arrived.`,
      button: "Okay",
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <AppBarC title="Scan Bundle" />
      {loading && <LoadingScreen />}
      <View style={{ padding: 10 }}>
        {scannedBarcode ? (
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.lightBackgroundColor3 },
            ]}
            onPress={() => {
              setScannedBarcode(false);
            }}
          >
            <Text style={styles.buttonText}>Scan a bundle</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.lightBackgroundColor3 },
            ]}
            onPress={() => {
              setScannedBarcode(true);
            }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        {!scannedBarcode ? (
          <>
            <Text
              style={{
                fontSize: 16,
                // marginBottom: 8,
                textAlign: "center",
                fontStyle: "italic",
                fontFamily: "sans-serif-light",
                padding: 20,
              }}
            >
              Scan the barcode on the bundle.
            </Text>
            <View style={{ padding: 10 }}>
              <BarCodeScanner
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.code128]}
                onBarCodeScanned={
                  scannedBarcode ? undefined : handleBarCodeScanned
                }
                style={[
                  StyleSheet.absoluteFillObject,
                  { height: 450, padding: 5, margin: 5 },
                ]}
              />
            </View>
          </>
        ) : scannedValue ? (
          <View
            style={{
              backgroundColor: theme.lightBackgroundColor2,
              top: 45,
              paddingBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                marginBottom: 8,
                textAlign: "center",
                fontStyle: "italic",
                fontWeight: "bold",
                padding: 20,
              }}
            >
              You have scanned the bundle {scannedValue.bundleID}
            </Text>

            <Text
              style={{
                fontSize: 16,
                marginBottom: 8,
                // textAlign: "center",
                fontStyle: "italic",
                fontWeight: "bold",
                fontFamily: "sans-serif-light",
                padding: 20,
              }}
            >
              From: {scannedValue.fromPO.Name}
              {"\n"}
              To: {scannedValue.toPO.Name}
              {"\n\n"}
              No of MailItems: {scannedValue.mail_service_items.length}
            </Text>
            {!submitted && (
              <>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: theme.lightBackgroundColor3,
                      width: 200,
                      alignSelf: "center",
                    },
                  ]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.buttonText}>Mark as arrived</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: theme.lightBackgroundColor3,
                      width: 200,
                      alignSelf: "center",
                    },
                  ]}
                  onPress={() => {
                    setScannedValue(null);
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
            {submitted && (
              <Text style={{ fontSize: 16, textAlign: "center" }}>
                You have marked the bundle as arrived.
              </Text>
            )}
          </View>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
    // width: 250,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  clockContainer: {
    alignItems: "center",
  },
  dateText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  timeText: {
    fontSize: 32,
  },
});

export default ScanArrived;
