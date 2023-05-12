import React, { useCallback, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createUseStyle } from "../themes/theme";
import Home from "../screens/App/home";
import ScanRQ from "../screens/App/ScanQR";
import History from "../screens/App/Code/history";
import Redeems from "../screens/App/Redeem/lists";
import CreateCode from "../screens/App/Code/createCode";
import Print from "../screens/App/Code/printThermalPrinterReceive";
// import Print from "../screens/app/Code/print";
import { TCodeEntity } from "../types/global";
import { useAppSelector } from "../stores/store";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export type AppStackParamList = {
  Home: undefined;
  CreateCode: undefined;
  CodeHistory: undefined;
  Redeems: undefined;
  Print: TCodeEntity[];
  VerifyVoucher: any;
};

const Stack = createNativeStackNavigator();

const useStyle = createUseStyle((t) => ({
  contentStyle: {
    backgroundColor: t.colors.white,
  },
}));

const AppStack = () => {
  const navigate = useNavigation();
  const auth = useAppSelector((state) => state.secure.auth);
  const styles = useStyle();

  useFocusEffect(
    useCallback(() => {
      if (!auth.loginState) {
        navigate.reset({
          index: 0,
          routes: [{ name: "Auth" }],
        });
      }
    }, [auth])
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        presentation: "card",
        contentStyle: styles.contentStyle,
        statusBarStyle: "dark",
      }}
      initialRouteName="Home"
    >
      <Stack.Screen
        name="Home"
        // options={{ title: "Welcome" }}
        options={{ headerShown: false }}
        component={Home}
      />
      <Stack.Screen
        name="CreateCode"
        options={{ title: "Pembuatan Code" }}
        component={ScanRQ}
      />
      <Stack.Screen
        name="Print"
        options={{ title: "Pencetakan Code" }}
        component={Print}
      />
      <Stack.Screen
        name="CodeHistory"
        options={{ title: "Riwayat Kode" }}
        component={History}
      />

      <Stack.Screen
        name="Redeems"
        options={{ title: "Approval" }}
        component={Redeems}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
