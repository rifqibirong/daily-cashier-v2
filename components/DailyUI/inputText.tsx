import React from "react";
import { StyleProp, TextInput, TextStyle, View } from "react-native";
import { createUseStyle } from "../../themes/theme";
import Block from "./block";
import Text from "./text";

export type InputTextProps = {
  label: string;
  value: string;
  placeholder: string;
  onChange?: (text: string) => void;
  style?: StyleProp<TextStyle>;
  onBlur?: (e: any) => void;
  secure?: boolean;
  errorMessage?: string | boolean;
  autoFocus?: boolean;
};

const useStyle = createUseStyle((t) => ({
  container: {
    backgroundColor: t.colors.white,
    borderColor: t.colors.gray,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: t.sizes.xs,
    fontFamily: t.fonts.regular,
  },
}));

const InputText = ({
  label,
  value,
  onChange,
  placeholder,
  style,
  onBlur,
  secure,
  errorMessage,
  autoFocus,
}: InputTextProps) => {
  const styles = useStyle();

  return (
    <Block inline style={{ marginBottom: 10 }}>
      <Text size="sm" bold>
        {label}
      </Text>
      <TextInput
        onBlur={onBlur}
        autoFocus={autoFocus}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder || label}
        style={[styles.container, style]}
        secureTextEntry={secure ? secure : false}
      />

      {errorMessage && (
        <Text size="sm" color="error">
          {errorMessage}
        </Text>
      )}
    </Block>
  );
};

export default InputText;
