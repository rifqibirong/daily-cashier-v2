import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCodesOnScroll, getCodesRequest } from "../../../stores/CodeSlice";
import { StatusBar } from "react-native";
import { useAppSelector } from "../../../stores/store";
import { Block, Card, Text } from "../../../components/DailyUI";
import { ActivityIndicator, FlatList, RefreshControl } from "react-native";
import { TCodeEntity } from "../../../types/global";
import { themes } from "../../../themes/theme";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import _, { chain } from "lodash";
import Button from "../../../components/DailyUI/button";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AppStackParamList } from "../../../stacks/appStack";
import { RootStackParamList } from "../../../stacks/rootStack";

const History = () => {
  const dispatch = useDispatch();
  const auth = useAppSelector((state) => state.secure.auth);

  const [limit, setLimit] = useState<number>(10);
  const [skip, setSkip] = useState<number>(0);

  const navigation =
    useNavigation<NavigationProp<AppStackParamList & RootStackParamList>>();
  const { outlet } = useAppSelector((state) => state.secure.auth.loginData);
  const isLoading = useAppSelector((state) => state.root.code.isPageLoading);
  const codesGrouped = useAppSelector((state) => {
    const codes = state.root.code.codes;
    const grouped = chain(codes)
      .groupBy("orderNumber")
      .map((value, key) => ({ orderNumber: key, codes: value }))
      .value();

    return grouped;
  });

  useEffect(() => {
    dispatch(
      getCodesRequest({
        outletId: outlet._id,
        token: auth.accessToken.token,
        limit: limit,
        skip: skip,
      })
    );
  }, []);

  const handleScroll = () => {
    setSkip(10);
    if (skip !== 0) {
      setSkip(skip + 10);
    }
    dispatch(
      getCodesOnScroll({
        outletId: outlet._id,
        token: auth.accessToken.token,
        limit: limit,
        skip: skip,
      })
    );
  };

  const _renderItem = ({
    item,
  }: {
    item: { orderNumber: string; codes: TCodeEntity[] };
  }) => {
    const d = new Date(item.codes[0].createdAt);
    return (
      <Button
        inline
        onPress={() => navigation.navigate("Print", item.codes)}
        style={{ marginHorizontal: 10, marginVertical: 5 }}
        type="white"
      >
        <Card fullWidth key={item.codes[0]._id} elevation={2} rounded="sm">
          <Text size="sm">
            {moment(item.codes[0].createdAt).format("llll")}
          </Text>
          <Text size="sm">Order Number :</Text>
          <Text size="md" bold>
            {item.orderNumber}
          </Text>
        </Card>
      </Button>
    );
  };

  return (
    <Block>
      <StatusBar backgroundColor={"white"} />
      {isLoading ? (
        <Block center>
          <ActivityIndicator color={"#4D77FF"} size={50} />
        </Block>
      ) : (
        <FlatList
          data={codesGrouped}
          scrollsToTop={true}
          onEndReached={handleScroll}
          renderItem={_renderItem}
          onEndReachedThreshold={0}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => {
                setSkip(0);
                dispatch(
                  getCodesRequest({
                    outletId: outlet._id,
                    token: auth.accessToken.token,
                    limit: 10,
                    skip: 0,
                  })
                );
              }}
            />
          }
          keyExtractor={(item, index) => item.codes[0]._id}
          ListEmptyComponent={() => (
            <Block
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
                Tidak ada Riwayat kode
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#c1bdbd",
                  textAlign: "center",
                  width: 210,
                }}
              >
                Status Riwayat kode akan muncul disini
              </Text>
            </Block>
          )}
        />
      )}
    </Block>
  );
};

export default History;
