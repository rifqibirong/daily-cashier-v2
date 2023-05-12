import { Text, TextStyle } from "react-native";
import React, { FC } from "react";
import { Colors, themes } from "../../themes/theme";

type TextProps = {
  style?: TextStyle;
  bold?: boolean;
  size?: "sm" | "xs" | "md" | "lg" | "xl";
  children: React.ReactNode;
  color?: keyof Colors;
  uppercase?: boolean;
  center?: boolean;
};

const UIText: FC<TextProps> = ({
  children,
  bold,
  size,
  style,
  color,
  uppercase,
  center,
}) => {
  const customStyles: TextStyle = {
    fontFamily: bold ? themes.default.fonts.bold : themes.default.fonts.regular,
    fontSize: size ? themes.default.sizes[size] : themes.default.sizes.md,
    letterSpacing: 0.4,
    textTransform: uppercase ? "uppercase" : "none",
    lineHeight: size
      ? themes.default.sizes[size] + 7
      : themes.default.sizes.md + 7,
    color: color ? themes.default.colors[color] : themes.default.colors.black,
    textAlign: center ? "center" : "auto",
  };
  return <Text style={[customStyles, style]}>{children}</Text>;
};

export default UIText;
