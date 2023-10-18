import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import userUtils from "../utils/userUtils";
import { AuthContext } from "../contextStore/AuthProvider";
import * as Location from "expo-location";
import Constants from "expo-constants";

const WEATHER_API_KEY = Constants.expoConfig.extra.weatherKey;

const ClockComponent = () => {
  const [date, setDate] = useState(new Date());
  const { user, setUser } = useContext(AuthContext);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${WEATHER_API_KEY}`
      );
      const data = await response.json();

      setWeatherData(data);
    })();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ margin: 5, alignItems: "right" }}>
        <Text style={styles.dateText}>WELCOME {user.name.first_name}</Text>
          <Text style={styles.timeText}>{formattedTime}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
          
        </View>
        <View style={[styles.bar, { backgroundColor: "black" }]}></View>
        <View style={{ alignItems: "left" }}>
          <Image
            style={styles.weatherIcon}
            source={{
              uri: `http://openweathermap.org/img/w/${weatherData?.weather[0].icon}.png`,
            }}
          />
          <Text style={styles.weatherText}>{weatherData?.weather[0]?.description}</Text>
          <Text style={styles.weatherText}>{weatherData?.name}</Text>
        </View>
      </View>
      {/* <Text>{JSON.stringify(weatherData)}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  weatherText: {
    // fontSize: 15,
    // textAlign: "center",
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  bar: {
    width: 1,
    height: 100,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  clockContainer: {
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
    textAlign: "right",
  },
  timeText: {
    fontSize: 32,
  },
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    padding: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    marginBottom: 20,
  },
});

export default ClockComponent;
