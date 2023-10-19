import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Modal,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";

import DropDownPicker from "react-native-dropdown-picker";
import AppbarC from "../../components/AppBarC";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import bundleService from "../../services/bundleService";
import LoadingScreen from "../LoadingScreen";
import postOfficeService from "../../services/postOfficeService";
import mailItemService from "../../services/mailItemService";

import {Icons} from "../../assets/icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useTheme } from "../../assets/theme/theme";

export default function App() {
  var { theme } = useTheme();

  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scannedBarcode, setScannedBarcode] = useState(true);

  const [selectedBundleId, setSelectedBundleId] = useState(null);
  const [open, setOpen] = useState(false);
  const [bundleIds, setBundleIds] = useState([{ label: "", value: "1" }]);
  const [bundles, setBundles] = useState([]);
  const [mailsOfSelectedBundle, setMailsOfSelectedBundle] = useState([]);
  const [selectedMailItem, setSelectedMailItem] = useState(null);

  const getBundles = async () => {
    setIsLoading(true);
    try {
      let bundles = await bundleService.getBundleData();
    setBundles(bundles);
    let bundleIds = [];

    for (let bundle of bundles) {
      let poData = await postOfficeService.getDetailsofPostofficeByID(
        bundle.destination_post_office_id
      );
      bundleIds.push({
        label: `${poData?.Name} - ${bundle.destination_post_office_id}`,
        value: bundle.id,
      });
    }
    setBundleIds(bundleIds);

    console.log("Bundles for today", bundles);
    }
    catch(e){
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Error fetching bundles",
        button: "close",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getBundles();
  }, []);

  useEffect(() => {
    if (selectedBundleId) {
      let mailsOfSelectedBundle = bundles.find(
        (item) => item.id === selectedBundleId
      ).mail_service_items;
      setMailsOfSelectedBundle(
        mailsOfSelectedBundle.map((item) => {
          return { id: item, scanned: false };
        })
      );
    }
  }, [selectedBundleId]);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScannedBarcode(true);

    for (let mailIdx in mailsOfSelectedBundle) {
      let mail = mailsOfSelectedBundle[mailIdx];
      if (mail.id === data) {
        mail.scanned = true;
        mailsOfSelectedBundle.splice(mailIdx, 1); // Remove the item from its current position
        mailsOfSelectedBundle.push(mail);
        break;
      }
    }

    setMailsOfSelectedBundle(mailsOfSelectedBundle);
  };

  const handleSubmit = async () => {
    if (mailsOfSelectedBundle.some((item) => item.scanned === false)) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Please scan all mail items before submitting",
        button: "close",
      });
      return;
    }
    setIsLoading(true);
    try{
      await bundleService.updateBundleStatus(
        selectedBundleId,
        mailsOfSelectedBundle,
      );
      await getBundles();
      setSelectedBundleId(null);
    }
    catch(e){
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Error submitting bundle",
        button: "close",
      });
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: "Warning",
      textBody:
        "This will reset all scanned mail items. Do you want to continue?",
      button: "Okay",
      onPressButton: () => {
        setMailsOfSelectedBundle(
          mailsOfSelectedBundle.map((item) => ({ ...item, scanned: false }))
        );
        Dialog.hide();
      },
    });
  };

  const handleMailItemClick = (item) => {
    setIsLoading(true);
    try {
      const getMailData = async (id) => {
        let mail = await mailItemService.getDetailsofMailItemByID(id);
        console.log(mail);
        setSelectedMailItem(mail);
      };
      getMailData(String(item).trim());
    }
    catch(e){
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Error fetching mail data",
        button: "close",
      });
    }
    setIsLoading(false);
  };

  const handleOverlayPress = () => {
    setSelectedMailItem(null);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (!scannedBarcode) {
    return (
      <>
        <AppbarC title="Add to Bundle" />
        <View style={{ padding: 10 }}>
          <Text
            style={{
              fontSize: 16,
              marginBottom: 8,
              textAlign: "center",
              fontStyle: "italic",
              fontFamily: "sans-serif-light",
              padding: 20,
            }}
          >
            Align the camera to the barcode and wait for it to scan
          </Text>

          <View style={{ height: 420 }}>
            <BarCodeScanner
              barCodeTypes={[BarCodeScanner.Constants.BarCodeType.code128]}
              onBarCodeScanned={
                scannedBarcode ? undefined : handleBarCodeScanned
              }
              style={[
                StyleSheet.absoluteFillObject,
                { height: 400, padding: 5 },
              ]}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: theme.accentColor,
                width: 250,
                alignSelf: "center",
              },
            ]}
            onPress={() => setScannedBarcode(true)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      {isLoading && <LoadingScreen />}
      <AppbarC title="Add to Bundle" />
      {/* <Text>{JSON.stringify(mailsOfSelectedBundle)}</Text> */}

      <View style={styles.container}>
        <Text>Select a Bundle ID:</Text>
        <DropDownPicker
          open={open}
          value={selectedBundleId}
          items={bundleIds}
          setOpen={setOpen}
          setValue={setSelectedBundleId}
          setItems={setBundleIds}
          style={{ width: 300, borderWidth: 1 }}
          containerStyle={{
            padding: 5,
          }}
        />

        {selectedBundleId && (
          <View style={{ top: 10, flex: 1 }}>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.lightBackgroundColor2, width: 200 },
                ]}
                onPress={() => setScannedBarcode(false)}
              >
                <Text style={styles.buttonText}>Scan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.lightBackgroundColor2 },
                ]}
                onPress={handleReset}
              >
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <FlatList
                data={mailsOfSelectedBundle.map((item) => {
                  return item.id;
                })}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => handleMailItemClick(item)}
                  >
                    <View style={styles.containerRow}>
                      <Text>{item}</Text>
                      {mailsOfSelectedBundle.find((mail) => mail.id === item)
                        ?.scanned ? (
                        <FontAwesome5
                          name={"check"}
                          style={{ color: "#00b815" }}
                          brand
                        />
                      ) : (
                        <FontAwesome5
                          name={"times"}
                          style={{ color: "#ff0000" }}
                          brand
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                style={{
                  borderWidth: 1,
                  padding: 5,
                  marginTop: 15,
                  flex: 1,
                }}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.lightBackgroundColor2 },
              ]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedMailItem && (
          <>
            <View style={[styles.mailInfo, {bottom:100, backgroundColor: theme.lightBackgroundColor, height:200}]}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Mail Type: {selectedMailItem.type}
              </Text>
              <Text style={{ fontSize: 20 }}>
                Receiver: {selectedMailItem.receiver_name}
              </Text>

              <Icon name= {Icons.MailItems[selectedMailItem.type]} size={100} style={{top:20}}/>
            </View>
            <TouchableOpacity
              style={styles.overlay}
              onPress={() => handleOverlayPress()}
            />
          </>
        )}
      </View>
    </>
  );
}

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
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  containerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    padding: 25,
  },
  mailInfo: {
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
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    zIndex: 0, // Place the overlay behind the popup
  },
});
