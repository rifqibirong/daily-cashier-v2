// import {
//   createThemedStyleCreator,
//   createThemedUseStyleCreator,
//   // createUseTheme,
//   initThemeProvider,
//   createThemedUseThemeDispatch,
//   useStyle,
//   ThemeProvider,
// } from "@pavelgric/react-native-theme-provider";

const colors = {
  bgPrimary: "#B8FFF9",
  bgSecondary: "#85F4FF",
  white: "#FFFFFF",
  black: "#333333",
  primary: "#4D77FF",
  secondary: "#56BBF1",
  gray: "#eeeeee",
  lightGray: "#f5f4f4",
  darkGray: "#c1bdbd",
  error: "#FF0000",
};

const sizes = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 22,
  xl: 30,
  xxl: 40,
  xxxl: 50,
  xxxxl: 60,
  xxxxxl: 70,
};

const rounded = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 24,
};

const defaultTheme = {
  colors,
  sizes,
  rounded,
  constants: {
    gapFromStatusBar: 0,
  },
  fonts: {
    regular: "montserrat-regular",
    bold: "montserrat-bold",
  },
};

// // you can have as many themes as you want
// export const themes = {
//   default: defaultTheme,
// };

// export type Themes = typeof themes;
export type Colors = typeof colors;
export type Sizes = typeof sizes;
export type Rounded = typeof rounded;

// export const createStyle = createThemedStyleCreator<Themes>();
// export const createUseStyle = createThemedUseStyleCreator<Themes>();
// export const useTheme = createUseTheme<Themes>();
// export const useThemeDispatch = createThemedUseThemeDispatch<Themes>();

import {
  initThemeProvider,
  createThemedStyleCreator,
  createThemedUseStyleCreator,
  createThemedUseTheme,
  createThemedUseThemeDispatch,
  useStyle,
} from "@pavelgric/react-native-theme-provider";

const blueTheme = {
  colors: {
    primary: "light",
  },
};

const redTheme = {
  colors: {
    primary: "dark",
  },
};

// you can have as many themes as you want
export type Themes = typeof themes;
export const themes = {
  default: defaultTheme,
  // colors: colors,
};

export const {
  createUseStyle,
  createStyle,
  useTheme,
  useThemeDispatch,
  ThemeProvider,
} = initThemeProvider({ themes, initialTheme: "default" });

// useStyle does not depend on Theme, this is just to make it also accessible from here. But you'll probably not gonna use this anyway
export { useStyle };
