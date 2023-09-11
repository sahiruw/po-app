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

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);

  const [scannedBarcode, setScannedBarcode] = useState(true);
  const [barcodeList, setBarcodeList] = useState([
    "654",
    "654655",
    "864531",
    "654654",
    "654654",
    "665431",
    "687949874651",
  ]);

  const [selectedBundleId, setSelectedBundleId] = useState(null);
  const [open, setOpen] = useState(false);
  const [bundleIds, setBundleIds] = useState([
    { label: "Bundle ID 1", value: "Bundle ID 1" },
    { label: "Bundle ID 2", value: "Bundle ID 2" },
    { label: "Bundle ID 3", value: "Bundle ID 3" },
  ]);

  //   const bundleIds = ["Bundle ID 1", "Bundle ID 2", "Bundle ID 3"];

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScannedBarcode(true);

    if (!barcodeList.includes(data)) {
      setBarcodeList([...barcodeList.reverse(), data].reverse());
      alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    } else {
      alert(`Barcode ${data} already exists in the list`);
    }
  };

  const handleRemoveBarcode = (barcode) => {
    // Show a confirmation prompt to the user
    Alert.alert(
      "Confirm Removal",
      "Are you sure you want to remove this barcode?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => {
            // User confirmed, remove the barcode
            setBarcodeList(barcodeList.filter((item) => item !== barcode));
            console.log(`Removed barcode: ${barcode}`);
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
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
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.upc_e]}
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
      <AppbarC title="Add to Bundle" />
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
              <Button title={"Clear List"} onPress={() => setBarcodeList([])} />
            </View>

            <View style={{ flex: 1 }}>
              <FlatList
                data={barcodeList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.containerRow}>
                    <Text>{item}</Text>

                    <TouchableOpacity onPress={() => handleRemoveBarcode(item)}>
                      <FontAwesome5 name={"trash-alt"} brand />
                    </TouchableOpacity>
                  </View>
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
});
