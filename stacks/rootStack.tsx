import React, { useCallback, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnBoarding from "../screens/root/onBoarding";
import AppStack from "./appStack";
import { StatusBar } from "react-native";
import { createUseStyle } from "../themes/theme";
import Auth from "../screens/root/auth";
import Home from "../screens/app/home";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAppSelector } from "../stores/store";

export type RootStackParamList = {
  OnBoarding: undefined;
  Auth: undefined;
  AppStack: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const useStyle = createUseStyle((t) => ({
  contentStyle: {},
}));

const RootStack = () => {
  const auth = useAppSelector((state) => state.secure.auth);
  const navigate = useNavigation();
  const styles = useStyle();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "card",
        contentStyle: styles.contentStyle,
      }}
      initialRouteName="OnBoarding"
    >
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="AppStack" component={AppStack} />
    </Stack.Navigator>
  );
};

export default RootStack;
