import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

import DropDownPicker from "react-native-dropdown-picker";
import AppbarC from "../../components/AppBarC";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);

  const [scannedBarcode, setScannedBarcode] = useState(true);
  const [barcodeList, setBarcodeList] = useState([]);

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
    setBarcodeList(barcodeList.filter((item) => item !== barcode));
    console.log(barcode);
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
        <View>
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
            <View style={{ top: 10 }}>
              <Button
                title={"Scan to add Mail Item"}
                onPress={() => setScannedBarcode(false)}
              />

              <FlatList
                data={barcodeList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.container2}>
                    <Text>{item}</Text>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleRemoveBarcode(item)}
                    >
                      <Text style={styles.buttonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  container2: {
    flexDirection: "row", // Arrange buttons horizontally
    justifyContent: "space-between", // Space between buttons
    paddingHorizontal: 20, // Add horizontal padding for spacing
    paddingVertical: 20,
  },
});
