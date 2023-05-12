import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import {
  Block,
  SelectOption,
  Text,
  TextInput,
} from "../../../components/DailyUI";
import Button from "../../../components/DailyUI/button";
import { AppStackParamList } from "../../../stacks/appStack";
import { RootStackParamList } from "../../../stacks/rootStack";
import { createCodeRequest } from "../../../stores/CodeSlice";
import { useAppSelector } from "../../../stores/store";
import { themes } from "../../../themes/theme";

const CreateCode = () => {
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NavigationProp<AppStackParamList & RootStackParamList>>();
  const { loginData } = useAppSelector((state) => state.secure.auth);
  const { isPageLoading, lastData } = useAppSelector(
    (state) => state.root.code
  );

  const date = new Date();

  useEffect(() => {
    if (!isEmpty(lastData)) {
      navigation.navigate("Print", lastData);
    }
  }, [lastData]);

  if (isPageLoading) {
    return (
      <ActivityIndicator size="large" color={themes.default.colors.primary} />
    );
  }

  return (
    <Block style={{ marginTop: 20 }}>
      <Formik
        initialValues={{
          cashierId: loginData._id,
          orderNumber: "",
          orderAmount: "",
          deliveryType: "1",
          employeeId: "",
          orderDate:
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear(),
          outletId: loginData.outlet._id,
        }}
        validate={(values) => {
          const errors = {} as any;
          if (!values.orderNumber) {
            errors.orderNumber = "Nomor Order wajib diisi";
          }
          if (!values.orderAmount) {
            errors.orderAmount = "Total Belanja wajib diisi";
          }
          if (!values.employeeId) {
            errors.employeeId = "ID Karyawan wajib diisi";
          }
          return errors;
        }}
        onSubmit={(values) => {
          dispatch(createCodeRequest(values as any));
        }}
      >
        {({
          handleChange,
          errors,
          touched,
          handleBlur,
          handleSubmit,
          values,
        }) => (
          <Block style={{ marginHorizontal: 20 }}>
            <TextInput
              label="Nomor Order"
              placeholder="Nomor Order"
              value={values.orderNumber}
              onChange={handleChange("orderNumber")}
              errorMessage={
                errors.orderNumber && touched.orderNumber && errors.orderNumber
              }
            />
            <TextInput
              label="Total Belanja"
              placeholder="Total Belanja"
              value={values.orderAmount}
              onChange={handleChange("orderAmount")}
              errorMessage={
                errors.orderAmount && touched.orderAmount && errors.orderAmount
              }
            />
            <SelectOption
              label="Jenis Pengiriman"
              value={values.deliveryType}
              onChange={handleChange("deliveryType")}
              options={[
                { label: "Go Food", value: "1" },
                { label: "GrabFood", value: "2" },
                { label: "Shopee Food", value: "3" },
                { label: "Traveloka", value: "4" },
                { label: "Lainnya", value: "5" },
              ]}
            />
            <TextInput
              label="ID Karyawan"
              placeholder="ID Karyawan"
              value={values.employeeId}
              onChange={handleChange("employeeId")}
              errorMessage={
                errors.employeeId && touched.employeeId && errors.employeeId
              }
            />
            <Button inline onPress={handleSubmit} rounded="sm">
              <Text color="white">Buat</Text>
            </Button>
          </Block>
        )}
      </Formik>
    </Block>
  );
};

export default CreateCode;
