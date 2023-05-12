import { Formik } from "formik";
import React, { FC, useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Modal,
  View,
  RefreshControl,
} from "react-native";
import { useDispatch } from "react-redux";
import { Block, Card, Text, TextInput } from "../../../components/DailyUI";
import Button from "../../../components/DailyUI/button";
import axios from "axios";
import API from "../../../constants/API";
import {
  getRedeemRequest,
  getRedeemsRequest,
  getRedeemsInScrollRequest,
  resetRedeem,
  verifyRedeemRequest,
} from "../../../stores/RedeemSlice";
import { useAppSelector } from "../../../stores/store";
import { createUseStyle, themes } from "../../../themes/theme";
import { RedeemEntity } from "../../../types/global";
import { Ionicons } from "@expo/vector-icons";

import { isEmpty } from "lodash";
import { verifyRedeem } from "../../../stores/RedeemAPI";
const useStyle = createUseStyle((theme) => ({
  container: {
    backgroundColor: theme.colors.white,
    padding: theme.sizes.sm,
  },
  blockProduct: {
    marginTop: 5,
    padding: 10,
    borderRadius: theme.sizes.sm,
  },
}));

const Redeems: FC = () => {
  const dispatch = useDispatch();
  const outlet = useAppSelector((state) => state.secure.auth.loginData.outlet);
  const { redeems, lastData, isPageLoading } = useAppSelector(
    (state) => state.root.redeem
  );
  const auth = useAppSelector((state) => state.secure.auth);
  const [skip, setSkip] = useState<number>(0);
  let limitAPI: number = 10;

  const styles = useStyle();

  useEffect(() => {
    dispatch(
      getRedeemsRequest({
        outletId: outlet._id,
        token: auth.accessToken.token,
        limit: limitAPI,
        skip: skip,
      })
    );
  }, []);

  const handleScrollAPI = () => {
    setSkip(10);
    console.log("====================================");
    console.log("HANDLE SCROLL FUNCTION RUNN");
    console.log(skip);
    console.log("====================================");
    if (skip !== 0) {
      setSkip(skip + 10);
    }
    dispatch(
      getRedeemsInScrollRequest({
        outletId: outlet._id,
        token: auth.accessToken.token,
        limit: limitAPI,
        skip: skip,
      })
    );
  };

  const handleVerifyRedeem = () => {
    console.log("handleVerifyRedeem");
    axios
      .put("https://api.prod.daily.co.id/daily-outlet/redeem/v3/verification", {
        outletId: outlet._id,
        redeemNumber: lastData.redeemNumber,
        isApproved: 200,
      })
      .then((res) => {
        console.log("response redeem verif", res.data);
      });
  };

  // useEffect(() => {
  //   dispatch(
  //     getRedeemsRequest({
  //       outletId: outlet._id,
  //       token: auth.accessToken.token,
  //     })
  //   );
  // }, [lastData]);

  const SPACING = 20;
  const AVATAR_SIZE = 70;
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const inputRange = [-1, 0, AVATAR_SIZE * 50, AVATAR_SIZE * (50 + 2)];
  const scale = scrollY.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0],
  });

  const _renderItem = ({ item }: { item: RedeemEntity }) => {
    return (
      <Card
        key={item._id}
        elevation={2}
        style={{
          marginHorizontal: 10,
          marginVertical: 5,
          transform: [{ scale }],
          shadowOffset: {
            width: 0,
            height: 10,
          },
        }}
        rounded="sm"
        bgColor={item.redeemStatus === "SUCCESS" ? "white" : "gray"}
      >
        <Block style={{ position: "absolute", right: 10, top: 5 }}>
          <Text
            size="sm"
            bold
            color={item.redeemStatus === "SUCCESS" ? "primary" : "error"}
          >
            {item.redeemStatus === "SUCCESS" ? "Berhasil" : "Gagal"}
          </Text>
        </Block>
        <Text size="sm" bold>
          {item.redeemNumber}
        </Text>
        <Block>
          <Text>{item.middleman?.username}</Text>
          <Text>+{item.middleman?.phoneNumber}</Text>
        </Block>
        <Block
          direction="row"
          style={styles.blockProduct}
          bgColor={item.redeemStatus === "SUCCESS" ? "gray" : "darkGray"}
        >
          <Image
            source={{
              uri: item.menu?.image,
            }}
            style={{ width: 50, height: 50 }}
          />
          <Block
            bgColor={item.redeemStatus === "SUCCESS" ? "gray" : "darkGray"}
          >
            <Text>{item.menu?.name}</Text>
            <Text size="sm">{item.snapshotPrice} Dailycoin</Text>
          </Block>
        </Block>
      </Card>
    );
  };

  const _header = () => {
    return (
      <Block
        style={{ paddingHorizontal: 20, marginBottom: 10, paddingVertical: 20 }}
        bgColor="gray"
      >
        <Formik
          initialValues={{
            code: "",
          }}
          validate={(values) => {
            const errors = {} as any;
            if (!values.code) {
              errors.code = "Code is equired";
            }
            return errors;
          }}
          onSubmit={(values) => {
            dispatch(
              verifyRedeemRequest({
                outlet: outlet._id,
                redeemNumber: values.code,
                isApproved: 200,
                token: auth.accessToken.token,
              })
            );
            dispatch(
              getRedeemsRequest({
                outletId: outlet._id,
                token: auth.accessToken.token,
                limit: limitAPI,
                skip: 0,
              })
            );
          }}
        >
          {({
            handleChange,
            errors,
            touched,
            handleBlur,
            handleSubmit,
            values,
          }) => (
            <>
              <TextInput
                label="Kode Penukaran"
                value={values.code}
                placeholder="Kode Penukaran"
                onChange={handleChange("code")}
                onBlur={handleBlur("code")}
                errorMessage={errors.code && touched.code && errors.code}
              />
              <Button onPress={handleSubmit} rounded="sm">
                <Text color="white">Konfirmasi</Text>
              </Button>
            </>
          )}
        </Formik>
        <Modal visible={isEmpty(lastData) ? false : true}>
          <Block center style={{ marginTop: 50 }}>
            <Text size="lg">Penukaran</Text>
            <Block
              inline
              center
              fullWidth
              bgColor="gray"
              rounded="md"
              style={{ padding: 10, marginTop: 20, marginHorizontal: 20 }}
            >
              <Text size="lg" bold>
                {lastData?.menu?.name}
              </Text>
              <Text>{lastData?.snapshotPrice} Dailypoin</Text>
            </Block>
            <Block inline style={{ marginTop: 20 }}>
              {lastData?.redeemStatus === "SUCCESS" ||
              lastData?.redeemStatus === "FAILED" ? (
                <Text bold>SUDAH PERNAH DIGUNAKAN</Text>
              ) : (
                <Block inline direction="row">
                  <Button
                    inline
                    rounded="sm"
                    onPress={() => {
                      handleVerifyRedeem;
                      // dispatch(
                      //   verifyRedeemRequest({
                      //     outletId: outlet._id,
                      //     redeemNumber: lastData.redeemNumber,
                      //     isApproved: 200,
                      //     token: auth.accessToken.token,
                      //   })
                      // );
                    }}
                    style={{ paddingHorizontal: 20, marginRight: 10 }}
                  >
                    <Text color="white">Konfirmasi</Text>
                  </Button>
                  <Button
                    inline
                    rounded="sm"
                    onPress={() => {
                      dispatch(
                        verifyRedeemRequest({
                          outlet: outlet._id,
                          redeemNumber: lastData.redeemNumber,
                          isApproved: 100,
                          token: auth.accessToken.token,
                        })
                      );
                    }}
                    type="error"
                    style={{ paddingHorizontal: 20 }}
                  >
                    <Text color="white">Batalkan</Text>
                  </Button>
                </Block>
              )}

              <Button
                inline
                rounded="sm"
                type="gray"
                onPress={() => {
                  dispatch(resetRedeem());
                }}
                style={{ paddingHorizontal: 20, marginTop: 40 }}
              >
                <Text>Kembali ke home</Text>
              </Button>
            </Block>
          </Block>
        </Modal>
      </Block>
    );
  };

  return (
    <Block>
      <FlatList
        data={redeems}
        renderItem={_renderItem}
        // onEndReached={handleScrollAPI}
        // onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isPageLoading}
            onRefresh={() => {
              // setSkipAPI(0);
              dispatch(
                getRedeemsRequest({
                  outletId: outlet._id,
                  token: auth.accessToken.token,
                  limit: limitAPI,
                  skip: 0,
                })
              );
            }}
          />
        }
        keyExtractor={(item) => item._id}
        ListHeaderComponent={_header}
        // stickyHeaderIndices={[0]}
        ListEmptyComponent={
          <View
            center
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 400,
            }}
          >
            <Ionicons name="file-tray-outline" size={60} color="#c1bdbd" />
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                color: "#c1bdbd",
              }}
            >
              Tidak ada Redeem
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#c1bdbd",
                textAlign: "center",
                width: 210,
              }}
            >
              Ketika terjadi Redeem, status akan muncul disini
            </Text>
          </View>
        }
      />
    </Block>
  );
};

export default Redeems;
