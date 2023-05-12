import React from "react";
import { StyleProp, TextInput, TextStyle, View } from "react-native";
import { createUseStyle } from "../../themes/theme";
import Block from "./block";
import Text from "./text";
import { Picker } from "@react-native-picker/picker";

type Option = {
  label: string;
  value: any;
};

export type SelectOptionProps = {
  label: string;
  value: any;
  onChange: (text: any) => void;
  style?: StyleProp<TextStyle>;
  onBlur?: (e: any) => void;
  errorMessage?: string | boolean;
  options: Option[];
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

const SelectOption = ({
  label,
  value,
  onChange,
  style,
  onBlur,
  errorMessage,
  options,
}: SelectOptionProps) => {
  const styles = useStyle();

  return (
    <Block inline style={{ marginBottom: 5 }}>
      <Text size="sm" bold>
        {label}
      </Text>
      <Picker style={[style]} selectedValue={value} onValueChange={onChange}>
        {options.map((i) => {
          return <Picker.Item key={i.value} label={i.label} value={i.value} />;
        })}
      </Picker>

      {errorMessage && (
        <Text size="sm" color="error">
          {errorMessage}
        </Text>
      )}
    </Block>
  );
};

export default SelectOption;
