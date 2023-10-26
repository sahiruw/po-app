import "dotenv/config";

export default {
  expo: {
    name: "po-app2",
    slug: "po-app2",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/logo.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./src/assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    
    // "androidStatusBar": {
    //   "backgroundColor": "#C2185B",
    //   "translucent": false
    // },
    
    ios: {
      supportsTablet: true,
      "config": {
        "googleMaps": {
          "apiKey": process.env.API_KEY
        }
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./src/assets/app-logo.png",
        backgroundColor: "#ffffff",
      },
      "package": "com.poapp2.app",
      "config": {
        "googleMaps": {
          "apiKey": process.env.API_KEY
        }
      }
    },
    web: {
      favicon: "./src/assets/app-logo.png",
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
      gMapsKey: process.env.GMAPS_API_KEY,
      weatherKey: process.env.WEATHER_API_KEY,
      "eas": {
        "projectId": "c567a7b4-39f4-439e-a31c-1c1db74aa712"
      }
    }
  },
};
