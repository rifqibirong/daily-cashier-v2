import React, { FC, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../../stacks/appStack";
import { Block, SelectOption, Text } from "../../../components/DailyUI";
import QRCode from "react-native-qrcode-svg";
import { TCodeEntity } from "../../../types/global";
import Button from "../../../components/DailyUI/button";
import { BLEPrinter, IBLEPrinter } from "react-native-thermal-receipt-printer";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../stacks/rootStack";
import { useDispatch } from "react-redux";
import { resetCode } from "../../../stores/CodeSlice";
import { useAppSelector } from "../../../stores/store";
import { isEmpty } from "lodash";
import { Alert, TouchableOpacity, View } from "react-native";

const Print: FC<NativeStackScreenProps<AppStackParamList>> = ({ route }) => {
  const [middleman] = route.params as TCodeEntity[];

  const [printers, setPrinters] = useState<IBLEPrinter[]>([]);
  const [selectOptionData, setSelectOptionData] = useState<
    { label: string; value: IBLEPrinter }[]
  >([]);
  const [selectedPrinter, setSelectedPrinter] = useState<IBLEPrinter>();
  const navigation =
    useNavigation<NavigationProp<AppStackParamList & RootStackParamList>>();
  const dispatch = useDispatch();
  const { lastData } = useAppSelector((state) => state.root.code);

  const getPrinter = async () => {
    BLEPrinter.init().then(() => {
      BLEPrinter.getDeviceList().then(setPrinters);
    });
  };

  useEffect(() => {
    getPrinter();
  }, []);

  const changePrinter = (printer: IBLEPrinter) => {
    setSelectedPrinter(printer);
    BLEPrinter.connectPrinter(printer.inner_mac_address).then(
      () => null,
      (error) =>
        Alert.alert("Terjadi kesalahan", "Printer tidak dapat terkoneksi")
    );
  };

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

  const printOjol = async (x: any) => {
    selectedPrinter &&
      BLEPrinter.printBill(`<CB>DAILYBOX</CB>
<CD>TERIMA KASIH</CD>
<C>======================</C>

<C>Kode Poin anda adalah</C>

<CB>${middleman.code}</CB>

<C>Kode Berlaku 7 hari dari tanggal terbit.</C>

<C>Untuk mendapatkan Poin, daftarkan diri anda ke DAILYOJOL.COM dan masukan kode poin diatas.</C>


<C>-- lembar untuk driver --</C>

<C>======================</C>
`);
  };

  return (
    <Block>
      <Block center>
        <Block flex={0} direction="row" style={{ marginTop: 10, height: 220 }}>
          <Block center>
            <Text>Driver</Text>
            <Text size="lg" bold>
              {middleman.code}
            </Text>
            <QRCode value={middleman.code} size={120} />
          </Block>
        </Block>

        <Block
          fullWidth
          flex={1}
          style={{ paddingHorizontal: 20 }}
          bgColor="gray"
        >
          <View
            style={{
              height: 50,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ marginTop: 20 }}>Pilih Printer</Text>
            <TouchableOpacity
              onPress={() => {
                getPrinter();
              }}
            >
              <Ionicons
                style={{ marginTop: 20 }}
                name="refresh"
                size={16}
                color="black"
              >
                <Text>Refresh</Text>
              </Ionicons>
            </TouchableOpacity>
          </View>
          <SelectOption
            label="Printer"
            value={selectedPrinter}
            onChange={(v) => changePrinter(v)}
            options={selectOptionData}
          />
          <Button
            inline
            onPress={() => selectedPrinter && printOjol(selectedPrinter)}
            rounded="sm"
            style={{ marginBottom: 10, paddingHorizontal: 10 }}
          >
            <Text color="white">Cetak </Text>
          </Button>
        </Block>
        {/*  */}
      </Block>
      {/* <Block center>
            <Text>Customer</Text>
            <Text size="lg" bold>
              {user.code}
            </Text>
            <QRCode value={user.code} size={120} />
          </Block>
        </Block>
        <Block
          fullWidth
          flex={1}
          style={{ paddingHorizontal: 20 }}
          bgColor="gray"
        >
          <Text style={{ marginTop: 20 }}>Pilih Printer</Text>
          <SelectOption
            label="Printer"
            value={selectedPrinter}
            onChange={(v) => changePrinter(v)}
            options={selectOptionData}
          />
          <Button
            inline
            onPress={() => selectedPrinter && printOjol(selectedPrinter)}
            rounded="sm"
            style={{ marginBottom: 10, paddingHorizontal: 10 }}
          >
            <Text color="white">Cetak untuk OJOL </Text>
          </Button>
          <Button
            inline
            onPress={() => selectedPrinter && printCustomer(selectedPrinter)}
            rounded="sm"
            style={{ marginBottom: 10, paddingHorizontal: 10 }}
          >
            <Text color="white">Cetak untuk customer </Text>
          </Button>
        </Block> */}
    </Block>
  );
};

export default Print;
