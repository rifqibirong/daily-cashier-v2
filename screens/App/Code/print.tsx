import React, { FC, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../stacks/appStack";
import { Block, SelectOption, Text } from "../../../components/DailyUI";
import QRCode from "react-native-qrcode-svg";
import { TCodeEntity } from "../../../types/global";
import Button from "../../../components/DailyUI/button";
import { Platform } from "react-native";
// import { BLEPrinter } from "react-native-thermal-receipt-printer";
import EscPos from "@leesiongchan/react-native-esc-pos";
import {
  USBPrinter,
  NetPrinter,
  BLEPrinter,
} from "react-native-thermal-receipt-printer";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../stacks/rootStack";
import { useDispatch } from "react-redux";
import { resetCode } from "../../../stores/CodeSlice";
import { useAppSelector } from "../../../stores/store";
import { isEmpty } from "lodash";

const Print: FC<NativeStackScreenProps<AppStackParamList>> = ({ route }) => {
  const [middleman, user] = route.params as TCodeEntity[];
  const [printers, setPrinters] = useState<any[]>([]);

  const [selectOptionData, setSelectOptionData] = useState<
    { label: string; value: any }[]
  >([]);
  const [selectedPrinter, setSelectedPrinter] = useState<any>();
  const navigation =
    useNavigation<NavigationProp<AppStackParamList & RootStackParamList>>();
  const dispatch = useDispatch();
  const { lastData } = useAppSelector((state) => state.root.code);

  // useEffect(() => {
  //   BLEPrinter.init().then(() => {
  //     BLEPrinter.getDeviceList().then((x) => setPrinters(x));
  //   });
  // }, []);

  // useEffect(() => {
  //   BLEPrinter.init().then(() => {
  //     BLEPrinter.getDeviceList().then((x) => console.log("get printer", x));
  //   });
  // }, []);

  useEffect(() => {
    if (Platform.OS == "android") {
      USBPrinter.init().then(() => {
        //list printers
        USBPrinter.getDeviceList().then((x) => setPrinters(x));
      });
    }
  }, []);

  // useEffect(() => {
  //   EscPos.scanDevices();

  //   EscPos.addListener(
  //     "bluetoothDeviceFound",
  //     (event: { state: keyof EscPos; deviceInfo: any }) => {
  //       console.log(event.state);
  //       if (event.state === EscPos.BLUETOOTH_DEVICE_FOUND) {
  //         console.log("Device Found!");
  //         console.log("Device Name : " + event.deviceInfo.name);
  //         console.log("Device MAC Address : " + event.deviceInfo.macAddress);
  //       }
  //     }
  //   );

  //   EscPos.addListener(
  //     "bluetoothStateChanged",
  //     (event: { state: keyof EscPos; deviceInfo: any }) => {
  //       console.log(event.state);
  //       if (event.state === EscPos.BLUETOOTH_CONNECTED) {
  //         console.log("Device Connected!");
  //         console.log("Device Name : " + event.deviceInfo.name);
  //         console.log("Device MAC Address : " + event.deviceInfo.macAddress);
  //       }
  //     }
  //   );

  //   return () => {
  //     EscPos.stopScan();
  //   };
  // }, []);

  useEffect(() => {
    if (!isEmpty(lastData)) {
      dispatch(resetCode());
    }
  }, [lastData]);

  useEffect(() => {
    setSelectOptionData(
      printers.map((x) => ({ label: x.device_name, value: x }))
    );
  }, [printers]);

  const printCustomer = async (x: any) => {
    try {
      EscPos.setConfig({ type: "bluetooth" });
      await EscPos.connect(x);
      EscPos.setPrintingSize(EscPos.PRINTING_SIZE_58_MM);
      EscPos.setTextDensity(8);

      await EscPos.printDesign(`{H3}{C}{B} TERIMA KASIH 
{C}{RP:30:-}
{C} CUSTOMER
{C} Kode point anda adalah
{H3}{C} ${user.code}
{C}{RP:30:-}
{H3} Kode Berlaku 7 hari dari tanggal terbit.
{H3} .
`);
      EscPos.disconnect();
    } catch (error) {
      console.error(error);
    }
  };

  const printOjol = async (x: any) => {
    try {
      // Test Print

      EscPos.setConfig({ type: "bluetooth" });
      await EscPos.connect(x);
      EscPos.setPrintingSize(EscPos.PRINTING_SIZE_58_MM);
      EscPos.setTextDensity(8);

      await EscPos.printDesign(`{H3}{C}{B} TERIMA KASIH 
{C}{RP:30:-}
{C} DRIVER
{C} Kode point anda adalah
{H3}{C} ${middleman.code}
{C}{RP:30:-}
{H3} Kode Berlaku 7 hari dari tanggal terbit.
{H3} .
`);
      EscPos.disconnect();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Block>
      <Block center>
        <Block flex={1} direction="row" style={{ marginTop: 10 }}>
          <Block center>
            <Text>Driver</Text>
            <Text size="lg" bold>
              {middleman.code}
            </Text>
            <QRCode value={middleman.code} size={150} />
          </Block>
          <Block center>
            <Text>Customer</Text>
            <Text size="lg" bold>
              {user.code}
            </Text>
            <QRCode value={user.code} size={150} />
          </Block>
        </Block>
        <Block fullWidth style={{ marginHorizontal: 20 }}>
          <Text style={{ marginTop: 20 }}>Pilih Printer</Text>

          <SelectOption
            label="Printer"
            value={selectedPrinter?.device_name}
            onChange={(v) => setSelectedPrinter(v)}
            options={selectOptionData}
          />
          <Button
            inline
            onPress={() => selectedPrinter && printCustomer(selectedPrinter)}
            rounded="sm"
            style={{ marginBottom: 10, paddingHorizontal: 10 }}
          >
            <Text color="white">Cetak untuk OJOL </Text>
          </Button>
          <Button
            inline
            onPress={() => selectedPrinter && printOjol(selectedPrinter)}
            rounded="sm"
            style={{ marginBottom: 10, paddingHorizontal: 10 }}
          >
            <Text color="white">Cetak untuk customer </Text>
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export default Print;
