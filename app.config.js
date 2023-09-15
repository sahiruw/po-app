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
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./src/assets/app-logo.png",
        backgroundColor: "#ffffff",
      },
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
    },
    gmaps: {
      apiKey: process.env.GMAPS_API_KEY,
    },
  },
};
