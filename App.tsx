import React from "react";
import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";
import ErrorBoundary from "react-native-error-boundary";
import { themes, ThemeProvider } from "./themes/theme";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";
import { Asset } from "expo-asset";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { useEffect, useState } from "react";
import RootStack from "./stacks/rootStack";
import { Provider } from "react-redux";
import store from "./stores/store";
import { setupAxios } from "./helpers/axiosInstance";
import { initializeApp } from "firebase/app";
enableScreens();
setupAxios(store);

// FIREBASE
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQUza4UFXKtHONTwvZdeNity7N3QOwDX8",
  authDomain: "notif-daily-casier.firebaseapp.com",
  projectId: "notif-daily-casier",
  storageBucket: "notif-daily-casier.appspot.com",
  messagingSenderId: "696157069765",
  appId: "1:696157069765:web:7d02ae35fe3f576af9abac",
  measurementId: "G-YQWR2MNDCW",
};

// Initialize Firebase
initializeApp(firebaseConfig);
// END FIREBASE

const assetImages: string[] = [];

const cacheImages = (images: string[]) =>
  images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    }
    return Asset.fromModule(image).downloadAsync();
  });

const _errorHandler = (error: Error, stackTrace: string) => {
  console.log(error);
};

export default function App() {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);

  useEffect(() => {
    _loadResourcesAsync().then(() => {
      setIsLoadingComplete(true);
    });
  }, []);

  const _loadResourcesAsync = async () => {
    try {
      await Font.loadAsync({
        "montserrat-regular": require("./assets/font/Geomanist-Regular.ttf"),
        "montserrat-bold": require("./assets/font/Geomanist-Bold.ttf"),
      });
      return await Promise.all([...cacheImages(assetImages)]);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isLoadingComplete) {
    return <AppLoading />;
  }

  return (
    <Provider store={store}>
      <ErrorBoundary onError={_errorHandler}>
        <ThemeProvider themes={themes} initialTheme="default">
          <NavigationContainer>
            <RootStack />
            <StatusBar style="dark" />
          </NavigationContainer>
        </ThemeProvider>
      </ErrorBoundary>
    </Provider>
  );
}
