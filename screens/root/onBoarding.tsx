import React from "react";
import { createUseStyle, themes } from "../../themes/theme";
import { Block, Text } from "../../components/DailyUI";
import Slider from "react-native-onboarding-swiper";
import images from "../../constants/images";
import { Image, StatusBar, View } from "react-native";
import Button from "../../components/DailyUI/button";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../stacks/rootStack";

const useStyle = createUseStyle((theme) => ({
  container: {
    backgroundColor: theme.colors.white,
    padding: theme.sizes.sm,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
}));

const OnBoarding = () => {
  const styles = useStyle();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <Block>
      <Slider
        showDone={false}
        showSkip={false}
        pages={[
          {
            backgroundColor: themes.default.colors.primary,
            image: <Image source={images.Logo} style={styles.image} />,
            title: "Cashier Apps",
            subtitle: (
              <Block inline>
                <StatusBar backgroundColor={"#4D77FF"} />
                <Button
                  inline
                  type="black"
                  style={{ paddingHorizontal: 40 }}
                  rounded="lg"
                  onPress={() => navigation.navigate("Auth")}
                >
                  <Text color="white">Masuk</Text>
                </Button>
              </Block>
            ),
          },
        ]}
      />
    </Block>
  );
};

export default OnBoarding;
