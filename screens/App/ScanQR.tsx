import {
  Text,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import BarcodeMask from "react-native-barcode-mask";
import API from "../../constants/API";
import { Ionicons } from "@expo/vector-icons";

import { useDispatch } from "react-redux";
import { useAppSelector } from "../../stores/store";
import axios from "axios";
import BluetoothStateManager from "react-native-bluetooth-state-manager";
import { Block, Card } from "../../components/DailyUI";

const ScanQR = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<any>(null);
  const [bluState, setBluState] = useState("");
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);
  const dispatch = useDispatch();
  const auth = useAppSelector((state) => state.secure.auth);
  const { isPageLoading, lastData } = useAppSelector(
    (state) => state.root.code
  );
  const [esbSalesNumber, setEsbSalesNumber] = useState<string>("");

  // useEffect(() => {
  //   BluetoothStateManager.getState().then(setBluState);
  // }, [bluState]);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    const payload = {
      esbSalesNumber: data,
      creatorId: auth.loginData._id,
    };
    let keyESB = data.slice(0, 2);

    if (keyESB === "SD") {
      setPageLoading(true);
      const token = auth.accessToken.token;
      axios
        .post(API.CODE.CREATE, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.code === 2007) {
            Alert.alert(
              `${res.data.code}: Terjadi Kesalahan`,
              `Kode Sudah Terpakai.`
            );
            setScanned(false);
          } else if (res.data.code === 1000) {
            navigation.navigate("Print", [res.data.data]);
            setScanned(false);
          }
          setScanned(false);
          setPageLoading(false);
        });
    } else {
      setPageLoading(false);
      setScanned(false);
      Alert.alert("Error", "Ups, Kode tidak dikenali");
    }
    setScanned(false);
  };

  const handleSendCode = () => {
    console.log("clicked");
    setScanned(false);
    setPageLoading(true);
    const payload = {
      esbSalesNumber: esbSalesNumber,
      creatorId: auth.loginData._id,
    };

    const token = auth.accessToken.token;
    axios
      .post(API.CODE.CREATE, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("response APIS create code", res.data);
        if (res.data.code === 2007) {
          Alert.alert(
            `${res.data.code}: Terjadi Kesalahan`,
            `Kode Sudah Terpakai.`
          );
        } else if (res.data.code === 1000) {
          navigation.navigate("Print", [res.data.data]);
        }
        setPageLoading(false);
      });
  };

  if (hasPermission === null) {
    return <ActivityIndicator color={"#4D77FF"} size={50} />;
  }
  if (hasPermission === false) {
    return (
      <Text style={{ textAlign: "center", fontSize: 20, color: "red" }}>
        No access to camera
      </Text>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isPageLoading || pageLoading ? (
        <ActivityIndicator color={"#4D77FF"} size={50} />
      ) : (
        <Block>
          {bluState === "PoweredOn" ? (
            <BarCodeScanner
              children={
                <BarcodeMask width={250} height={250} outerMaskOpacity={0.5} />
              }
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          ) : (
            <Block
              direction="column"
              center
              style={{
                marginTop: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="bluetooth" size={22} color="black">
                <Text style={{ paddingRight: 7, color: "blackr" }}>
                  Bluetooth :
                </Text>
                <Text style={{ fontWeight: "bold" }}>{bluState}</Text>
              </Ionicons>
              <Block>
                <Text>Nyalakan Bluetooth terlebih dahulu.</Text>
              </Block>
            </Block>
          )}
        </Block>
      )}
    </View>
  );
};

export default ScanQR;
