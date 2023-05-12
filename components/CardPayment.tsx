import React, { useEffect, useState } from "react";
import Card from "./DailyUI/card";
import { Block, Text } from "./DailyUI";
import { createUseStyle } from "../themes/theme";

import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { IDetailTransaction } from "../types/Payment";
import { useAppDispatch, useAppSelector } from "../stores/store";
import { ActivityIndicator, FlatList, ScrollView } from "react-native";

//  ==== START STYLED IN JSX ====
// const { width } = Dimensions.get("window");

const useStyle = createUseStyle((theme) => ({
  title: {
    fontSize: 13.8,
    fontWeight: "bold",
  },
  price: {
    color: "#bab4b4",
    fontWeight: "bold",
  },
}));
//  ==== END STYLED IN JSX ====

interface IProps {
  item: any[];
}

const CardPayment: React.FC<IProps> = ({ item }) => {
  const styles = useStyle();

  const [flatList, setFlatList] = useState();

  const isloading = useAppSelector((state) => state.root.payment.isloading);

  return (
    <ScrollView>
      <FlatList
        data={item}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={_renderItem}
        keyExtractor={(item) => item.toString()}
      />
    </ScrollView>
  );
};

export default CardPayment;
