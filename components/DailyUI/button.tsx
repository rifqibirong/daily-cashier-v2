import { View, Text, ViewStyle, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import {
  Colors,
  createUseStyle,
  Rounded,
  Sizes,
  themes,
} from "../../themes/theme";

type ButtonProps = {
  flex?: number;
  direction?: "column" | "row" | "column-reverse" | "row-reverse" | undefined;
  type?: keyof Colors;
  style?: ViewStyle;
  inline?: boolean;
  middle?: boolean;
  center?: boolean;
  middleEnd?: boolean;
  centerEnd?: boolean;
  space?: "space-around" | "space-between" | "space-evenly";
  children: React.ReactNode;
  onPress: Function;
  rounded?: keyof Rounded;
};

const useStyle = createUseStyle((t) => ({
  container: {
    backgroundColor: t.colors.white,
  },
}));

const Button: FC<ButtonProps> = ({
  children,
  flex = 1,
  direction,
  inline = false,
  type,
  style,
  center,
  centerEnd,
  middle,
  middleEnd,
  onPress,
  space,
  rounded,
}) => {
  const styles = useStyle();
  const customStyle: ViewStyle = {
    paddingVertical: 10,
    borderRadius: themes.default.rounded[rounded || "none"],
    flex: !inline ? flex : undefined,
    flexDirection: direction ? direction : "column",
    justifyContent: middle
      ? "center"
      : middleEnd
      ? "flex-end"
      : space
      ? space
      : undefined,
    alignItems: center ? "center" : centerEnd ? "flex-end" : "center",
    backgroundColor: type
      ? themes.default.colors[type]
      : themes.default.colors.primary,
  };

  return (
    <TouchableOpacity
      style={[styles.container, customStyle, style]}
      onPress={() => onPress()}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Button;
