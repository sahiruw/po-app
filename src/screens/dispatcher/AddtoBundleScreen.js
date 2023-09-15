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

import DropDownPicker from "react-native-dropdown-picker";
import AppbarC from "../../components/AppBarC";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import bundleService from "../../services/bundleService";
import LoadingScreen from "../LoadingScreen";
import postOfficeService from "../../services/postOfficeService";
import mailItemService from "../../services/mailItemService";
import userUtils from "../../utils/userUtils";

export default function App() {
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
    let bundles = await bundleService.getBundleData();
    setBundles(bundles);
    let bundleIds = [];

    for (let bundle of bundles) {
      let poData = await postOfficeService.getDetailsofPostofficeByID(
        bundle.destination_post_office_id
      );
      bundleIds.push({
        label: `${poData?.name} - ${bundle.destination_post_office_id}`,
        value: bundle.id,
      });
    }
    setBundleIds(bundleIds);

    console.log("Bundles for today", bundles);
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

  const handleMailItemClick = (item) => {
    setIsLoading(true);
    const getMailData = async (id) => {
      let mail = await mailItemService.getDetailsofMailItemByID(id);
      console.log(mail);
      setSelectedMailItem(mail);
    };
    getMailData(String(item).trim());
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
      <View style={{ padding: 10 }}>
        <Text>Align the camer to the barcode and wait for it to scan</Text>
        <Button
          title={"Cancel"}
          onPress={() => setScannedBarcode(true)}
          style={{ top: 10 }}
        ></Button>
        <View style={{ padding: 10 }}>
          <BarCodeScanner
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.code128]}
            onBarCodeScanned={scannedBarcode ? undefined : handleBarCodeScanned}
            style={[
              StyleSheet.absoluteFillObject,
              { height: 450, padding: 5, margin: 25 },
            ]}
          />
        </View>
      </View>
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
              <Button
                title={"Scan to add MailItem"}
                onPress={() => setScannedBarcode(false)}
              />
              {/* <Button title={"Clear List"} onPress={() => setBarcodeList([])} /> */}
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
              onPress={() => handleRemoveBarcode(item)}
              style={{
                marginTop: 10,
                backgroundColor: "lightblue",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Text>Submit</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedMailItem && (
          <>
            <View style={styles.markerInfo}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Mail Type: {selectedMailItem.type}
              </Text>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Receiver: {userUtils.formatName(selectedMailItem.receiver_name)}
              </Text>
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
