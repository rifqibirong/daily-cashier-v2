import React, { useCallback, useEffect, useRef, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import moment from "moment";
import { AntDesign } from "@expo/vector-icons";

import { createUseStyle, themes } from "../../themes/theme";
import {
  Block,
  TextInput,
  Card,
  Text,
  SelectOption,
} from "../../components/DailyUI";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../components/DailyUI/button";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { RootStackParamList } from "../../stacks/rootStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "../../stores/store";
import {
  deleteDeviceTokenRequest,
  getDeviceToken,
  loggedOut,
  updateNotificationKey,
} from "../../stores/AuthSlice";
import { AppStackParamList } from "../../stacks/appStack";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useDispatch } from "react-redux";
import { IDetailTransaction } from "../../types/Payment";
import { deleteDeviceToken, postDeviceToken } from "../../stores/TokenAPI";
import {
  getTransactionRequest,
  getTransactionSecRequest,
} from "../../stores/ListPaymentSlice";
import API from "../../constants/API";
type NavigationProps = NativeStackNavigationProp<AppStackParamList>;

//  ==== START STYLED IN JSX ====
const { height } = Dimensions.get("window");
const useStyle = createUseStyle((theme) => ({
  container: {
    backgroundColor: theme.colors.white,
    padding: theme.sizes.sm,
  },
  title: {
    fontSize: 13.8,
    fontWeight: "bold",
  },
  price: {
    padding: 0,
    margin: 0,
    color: "#bab4b4",
    fontWeight: "bold",
  },
}));
//  ==== END STYLED IN JSX ====

const ButtonIcon = ({
  text,
  iconName,
  goTo,
  onClick,
}: {
  text: string;
  iconName: keyof typeof Ionicons.glyphMap;
  goTo?: keyof AppStackParamList | "logout";
  onClick?: () => void;
}) => {
  const nav = useNavigation<NavigationProps>();
  const dispatch = useAppDispatch();
  return (
    <Button
      middle
      center
      type="primary"
      style={{ margin: 5, padding: 10, minHeight: 120 }}
      rounded="md"
      onPress={() => {
        if (onClick) {
          onClick();
        }
        if (goTo) {
          // dispatch(loggedOut());
          nav.navigate(goTo);
        }
      }}
    >
      <Ionicons
        name={iconName}
        size={themes.default.sizes.xxxl}
        color={themes.default.colors.white}
      />
      <Text size="sm" center color="white">
        {text}
      </Text>
    </Button>
  );
};

const Home = () => {
  const styles = useStyle();
  const auth = useAppSelector((state) => state.secure.auth);
  const navigate = useNavigation();
  useNavigation<NavigationProp<AppStackParamList & RootStackParamList>>();
  const dispatch = useDispatch();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const { notificationKey, loginData } = useAppSelector(
    (state) => state.secure.auth
  );
  const deviceToken = useAppSelector((state) => state.secure.auth.deviceToken);

  const Transaction = useAppSelector((state) => state.root.payment.listPayment);

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [period, setPeriod] = useState("today");
  const [limitAPI, setLimitAPI] = useState<number>(10);
  const [skipAPI, setSkipAPI] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [isLoadingVoucher, setIsLoadingVoucher] = useState(false);

  const isloading = useAppSelector((state) => state.root.payment.isLoading);

  // useEffect(() => {
  //   registerForPushNotificationsAsync();

  //   // This listener is fired whenever a notification is received while the app is foregrounded
  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       dispatch(updateNotificationKey());
  //     });

  //   // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {});

  //   return () => {
  //     Notifications.removeNotificationSubscription(
  //       notificationListener.current
  //     );
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  // async function registerForPushNotificationsAsync() {
  //   let token;
  //   if (Device.isDevice) {
  //     const { status: existingStatus } =
  //       await Notifications.getPermissionsAsync();
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== "granted") {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== "granted") {
  //       Alert.alert("Failed to get push token for push notification!");
  //       return;
  //     }
  //     try {
  //       token = (await Notifications.getExpoPushTokenAsync()).data;
  //       getDeviceToken(token);
  //       const data = {
  //         token: token,
  //         outletId: auth.loginData.outlet._id,
  //         platform: Platform.OS,
  //       };
  //       let res = await postDeviceToken(data);
  //       return res;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     alert("Must use physical device for Push Notifications");
  //   }

  //   if (Platform.OS === "android") {
  //     Notifications.setNotificationChannelAsync("default", {
  //       name: "default",
  //       importance: Notifications.AndroidImportance.MAX,
  //       vibrationPattern: [0, 250, 250, 250],
  //       lightColor: "#FF231F7C",
  //     });
  //   }

  //   return token;
  // }

  const onRefresh = () => {
    setRefreshing(true);
    const payload = {
      id: auth.loginData.outlet._id,
      period: period,
      token: auth.accessToken.token,
      limit: 10,
      skip: 0,
    };
    dispatch(getTransactionRequest(payload));
    setRefreshing(false);
  };

  useEffect(() => {
    onRefresh();
  }, []);

  useEffect(() => {
    const payload = {
      id: auth.loginData.outlet._id,
      period: period,
      token: auth.accessToken.token,
      limit: limitAPI,
      skip: 10,
    };
    dispatch(getTransactionSecRequest(payload));
  }, [limitAPI]);

  useEffect(() => {
    if (notificationKey !== "no data") {
      onRefresh();
    }
    onRefresh();
  }, [notificationKey, period]);

  const handleVerify = async () => {
    setIsLoadingVoucher(true);
    const payload = {
      voucherCode: voucherCode,
      outletId: loginData.outlet._id,
    };
    const res = await API.HTTP.post(
      "https://api.prod.dailyapp.id/api-cashier-voucher-1.0.0/cashier-verify-voucher",
      payload
    );
    setIsLoadingVoucher(false);

    if (res.data.code === 1000) {
      Alert.alert("Success", "You Verify code Voucer");
      setVoucherCode("");
    } else {
      Alert.alert(`Error :: ${res.data.code}`, `${res.data.error}`);
    }

    return res;
  };

  // ======== START
  const _renderItem = ({ item }: { item: IDetailTransaction }) => (
    <Card inline>
      <Block
        direction="row"
        center
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "#3333",
          paddingHorizontal: 5,
          borderRadius: 10,
        }}
      >
        <Block inline style={{ width: 40 }}>
          <Ionicons name="receipt-outline" size={22} color="#c1bdbd" />
        </Block>
        <Block>
          <Text style={styles.title}>
            Dailycoin Payment - {item.reasonId?.posCode}
          </Text>
          <Block inline direction="column" style={{ justifyContent: "center" }}>
            <Text style={{ fontSize: 11 }}>Pembayaran dengan dailycoin</Text>
            <Block direction="row">
              <Text style={{ fontSize: 11, paddingRight: 10, lineHeight: 11 }}>
                {moment(item.reasonId?.createdAt).format("MMM Do YYYY")}
              </Text>
              <Text style={{ fontSize: 11, lineHeight: 11 }}>
                {moment(item.reasonId?.createdAt).format("LT")}
              </Text>
            </Block>
          </Block>
        </Block>

        <Block
          inline
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Text style={styles.price}>{item.reasonId?.pointAmount}</Text>
          <Text style={{ fontSize: 11, color: "#c1bdbd", lineHeight: 11 }}>
            Dailycoin
          </Text>
        </Block>
      </Block>
    </Card>
  );

  // ======== END

  return (
    <Block style={styles.container}>
      {/* <StatusBar backgroundColor={"white"} /> */}

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            flex: 1,
            alignItems: "center",
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        >
          <View
            style={{
              width: "95%",
              height: 200,
              padding: 15,
              position: "relative",
              borderRadius: 4,
              elevation: 2,
              backgroundColor: "white",
            }}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={{ position: "absolute", top: 5, right: 18 }}>
                <AntDesign name="close" size={30} color="black" />
              </View>
            </TouchableWithoutFeedback>
            <Block style={{ marginTop: 35 }}>
              <TextInput
                label="Voucher Code"
                onChange={(text) => setVoucherCode(text)}
                placeholder="Voucher Code"
                value={voucherCode}
              />

              <Block style={{ marginTop: 25 }}>
                <Button inline rounded="sm" onPress={handleVerify}>
                  {isLoadingVoucher ? (
                    <ActivityIndicator color={"#FFF"} size={20} />
                  ) : (
                    <Text color="white">Sumbit</Text>
                  )}
                </Button>
              </Block>
            </Block>
          </View>
        </View>
      </Modal>

      <Block direction="row" inline style={{ paddingVertical: 10 }}>
        <Block>
          <Text bold>Halo Cashier </Text>
        </Block>
        <Block inline>
          <TouchableOpacity
            onPress={() => {
              dispatch(loggedOut());
              dispatch(deleteDeviceTokenRequest(deviceToken));
            }}
          >
            <Block inline direction="row">
              <Ionicons
                style={{ paddingTop: 5, paddingRight: 2 }}
                name="md-power-sharp"
                size={14}
                color="black"
              />
              <Text style={{ fontWeight: "bold" }}>Logout</Text>
            </Block>
          </TouchableOpacity>
        </Block>
      </Block>
      <Block
        inline
        direction="row"
        style={{
          marginHorizontal: -10,
        }}
      >
        <ButtonIcon
          text="Scan Kode Driver"
          iconName="scan-circle-outline"
          goTo="CreateCode"
        />
        <ButtonIcon
          text="Riwayat Pembuatan Kode"
          iconName="time-outline"
          goTo="CodeHistory"
        />
      </Block>
      <Block inline direction="row" style={{ marginHorizontal: -10 }}>
        <ButtonIcon
          text="Redeem Approval"
          iconName="checkmark-circle-outline"
          goTo="Redeems"
        />
        <ButtonIcon
          text="Verify Voucher"
          onClick={() => setModalVisible(!modalVisible)}
          iconName="checkmark-circle"
        />
      </Block>
      <Block>
        <Block inline style={{ paddingVertical: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: "bold" }}>
            Riwayat Pembayaran
          </Text>
        </Block>
        <Block>
          <SelectOption
            label="Filter data"
            value={period}
            onChange={(text) => setPeriod(text)}
            options={[
              { label: "Sekarang", value: "today" },
              { label: "Kemarin", value: "yesterday" },
              { label: "Bulan", value: "monthly" },
            ]}
          />

          {isloading ? (
            <Block center>
              <ActivityIndicator color={"#4D77FF"} size={50} />
            </Block>
          ) : (
            <FlatList
              data={Transaction}
              scrollsToTop={true}
              // inverted
              refreshControl={
                <RefreshControl
                  refreshing={isloading}
                  onRefresh={() => {
                    setLimitAPI(10);
                    const payload = {
                      id: auth.loginData.outlet._id,
                      period: period,
                      token: auth.accessToken.token,
                      limit: 10,
                      skip: 0,
                    };
                    dispatch(getTransactionRequest(payload));
                  }}
                />
              }
              onEndReached={() => {
                setLimitAPI(limitAPI + 10);
                // const payload = {
                //   id: auth.loginData.outlet._id,
                //   period: period,
                //   token: auth.accessToken.token,
                //   limit: limitAPI,
                //   skip: 10,
                // };
                // dispatch(getTransactionSecRequest(payload));
              }}
              onEndReachedThreshold={0.3}
              renderItem={_renderItem}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={() => (
                <View
                  center
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: 400,
                  }}
                >
                  <Ionicons
                    name="file-tray-outline"
                    size={60}
                    color="#c1bdbd"
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#c1bdbd",
                    }}
                  >
                    Tidak ada pembayaran
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#c1bdbd",
                      textAlign: "center",
                      width: 210,
                    }}
                  >
                    Ketika terjadi pembayaran, status akan muncul disini
                  </Text>
                </View>
              )}
            />
          )}
        </Block>
      </Block>
    </Block>
  );
};

export default Home;
