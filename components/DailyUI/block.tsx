import { View, ViewStyle } from "react-native";
import React from "react";
import { Colors, createUseStyle, Rounded, themes } from "../../themes/theme";

type BlockProps = {
  flex?: number;
  direction?: "column" | "row" | "column-reverse" | "row-reverse" | undefined;
  bgColor?: keyof Colors;
  style?: ViewStyle;
  inline?: boolean;
  middle?: boolean;
  center?: boolean;
  middleEnd?: boolean;
  centerEnd?: boolean;
  space?: "space-around" | "space-between" | "space-evenly";
  children: React.ReactNode;
  rounded?: keyof Rounded;
  fullWidth?: boolean;
};

const useStyle = createUseStyle((t) => ({
  container: {
    backgroundColor: t.colors.white,
  },
}));

const UIBlock: React.FC<BlockProps> = ({
  children,
  flex = 1,
  direction,
  inline = false,
  bgColor,
  style,
  center,
  centerEnd,
  middle,
  middleEnd,
  space,
  rounded,
  fullWidth,
}) => {
  const styles = useStyle();
  const customStyle: ViewStyle = {
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
    alignItems: center ? "center" : centerEnd ? "flex-end" : undefined,
    backgroundColor: bgColor ? themes.default.colors[bgColor] : undefined,
    alignSelf: fullWidth ? "stretch" : "auto",
  };

  return <View style={[styles.container, customStyle, style]}>{children}</View>;
};

export default UIBlock;
