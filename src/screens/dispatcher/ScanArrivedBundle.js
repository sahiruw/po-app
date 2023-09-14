import React, { useEffect, useState } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { useTheme } from "../../assets/theme/theme";
import userService from "../../services/userService";
import routeService from "../../services/routeService";
import AppBarC from "../../components/AppBarC";
import mailItemService from "../../services/mailItemService";
import { BarCodeScanner } from "expo-barcode-scanner";

const HomeScreen = ({ navigation }) => {
  var { theme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      let user = await userService.getUserData();
      setUser(user);
    }
    async function getMailData() {
      let mail = await mailItemService.getDetailsofMailItemByID("0Op2tD2zDfe3mfVxf2SF")
      console.log(mail);
    }
    getUser();
    // getMailData();
  }, []);

  return (
    <>
      <AppBarC title="Scan Bundle" />
      <View style={{ padding: 10 }}>
        <Text>Scan the barcode on the bundle.</Text>

        <View style={{ padding: 10 }}>
          <BarCodeScanner
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.code128]}
            onBarCodeScanned={undefined}
            style={[
              StyleSheet.absoluteFillObject,
              { height: 450, padding: 5, margin: 25,  },
            ]}
          />
        </View>
      </View>
    </>
  );
};

const ModernDateTimeDisplay = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update the current date and time every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString();
  const formattedTime = currentDateTime.toLocaleTimeString();

  return (
    <View style={styles.clockContainer}>
      <Text style={styles.dateText}>{formattedDate}</Text>
      <Text style={styles.timeText}>{formattedTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default HomeScreen;
