import { Animated, View, ViewStyle } from "react-native";
import React, { useRef } from "react";
import { Colors, createUseStyle, Rounded, themes } from "../../themes/theme";

type CardProps = {
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
  elevation?: number;
  rounded?: keyof Rounded;
  fullWidth?: boolean;
};

const useStyle = createUseStyle((t) => ({
  container: {
    backgroundColor: t.colors.white,
  },
}));

const Card: React.FC<CardProps> = ({
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
  elevation,
  fullWidth,
}) => {
  const styles = useStyle();
  const customStyle: ViewStyle = {
    borderRadius: themes.default.rounded[rounded || "none"],
    flex: !inline ? flex : undefined,
    flexGrow: inline ? 0 : undefined,
    flexShrink: inline ? 1 : undefined,
    flexDirection: direction ? direction : "column",
    justifyContent: middle
      ? "center"
      : middleEnd
      ? "flex-end"
      : space
      ? space
      : undefined,
    alignItems: center ? "center" : centerEnd ? "flex-end" : undefined,
    backgroundColor: bgColor
      ? themes.default.colors[bgColor]
      : themes.default.colors.white,

    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: fullWidth ? "stretch" : "auto",

    shadowColor: themes.default.colors.black,
    shadowOffset: {
      width: 0,
      height: elevation ? Math.floor(elevation / 2) : 1,
    },
    shadowOpacity: elevation ? elevation * 0.12 : 0.12,
    shadowRadius: elevation ? elevation + elevation * 0.3 : 0.4,
    elevation: elevation ? elevation : 1,
  };

  return (
    <Animated.View style={[styles.container, customStyle, style]}>
      {children}
    </Animated.View>
  );
};

export default Card;
