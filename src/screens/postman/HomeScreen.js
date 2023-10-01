
 import React, { useEffect, useState } from 'react';
 import { StyleSheet, Text, View , Button} from 'react-native';
 import * as Location from 'expo-location';
import { Image } from 'react-native-elements';

 const WEATHER_API_KEY = "2d82cc05b031d014675160de987c55f8"

 const HomeScreen = () => {
   const [date, setDate] = useState(new Date());
   const [weatherData, setWeatherData] = useState(null);

   useEffect(() => {
     (async () => {
       let { status } = await Location.requestForegroundPermissionsAsync();
       if (status !== 'granted') {
         setErrorMsg('Permission to access location was denied');
         return;
       }

       let location = await Location.getCurrentPositionAsync({});
       const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${WEATHER_API_KEY}`);
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

   return (
     <View style={styles.container}>
       <View style={styles.dateContainer}>
         <Text style={styles.dateText}>{date.toLocaleTimeString()}</Text>
         <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
       </View>
       
       {weatherData && 
         <View style={styles.weatherContainer}>

           <Image 
             style={styles.weatherIcon} 
             source={{uri: `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}}
           />
           <Text style={styles.weatherText}>{JSON.stringify(weatherData.weather)}</Text>
         </View>
       }
     </View>
   );
 };


 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: '#F5FCFF',
   },
   dateContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
   },
   dateText: {
     fontSize: 20,
     textAlign: 'center',
     margin: 10,
   },
   weatherContainer: {
     flex: 2,
     justifyContent: 'center',
     alignItems: 'center',
   },
   weatherIcon: {
     width: 50,
     height: 50,
   },
   weatherText: {
     fontSize: 20,
     textAlign: 'center',
     margin: 10,
   },
 });

 export default HomeScreen;



