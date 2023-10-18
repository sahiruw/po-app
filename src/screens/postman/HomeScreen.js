import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as Location from "expo-location";
import { Image } from "react-native-elements";
import ProfileCard from "../../components/ProfileCard";
import { AuthContext } from "../../contextStore/AuthProvider";
import AppbarC from "../../components/AppBarC";
import DeliveryStatusCard from "../../components/DeliveryStatusCard";
import ClockComponent from "../../components/ClockComponent";

const HomeScreen = () => {
  const [date, setDate] = useState(new Date());
  const { user, setUser } = useContext(AuthContext);
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <AppbarC title="Home" />
      <View style={styles.container}>
        {/* <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{date.toLocaleTimeString()}</Text>
          <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
        </View> */}
        <ClockComponent />

        <ProfileCard />
        <DeliveryStatusCard />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  dateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  weatherContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  weatherText: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
});

export default HomeScreen;
