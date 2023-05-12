import React, { useCallback, useEffect } from "react";
import { Block, Text, TextInput } from "../../components/DailyUI";
import Button from "../../components/DailyUI/button";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { authLoginRequest, resetCodeStatus } from "../../stores/AuthSlice";
import { useAppSelector } from "../../stores/store";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { RootStackParamList } from "../../stacks/rootStack";
// REACTOTRON DEBUG

import {
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Linking,
  View,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import reactotron from "reactotron-react-native";

const Auth = () => {
  const dispatch = useDispatch();
  const auth = useAppSelector((state) => state.secure.auth);
  const navigate = useNavigation<NavigationProp<RootStackParamList>>();
  const { isPageLoading } = useAppSelector((state) => state.secure.auth);

  useEffect(() => {
    dispatch(resetCodeStatus());
  }, [auth.statusCode]);

  useFocusEffect(
    useCallback(() => {
      if (auth.loginState) {
        navigate.reset({
          index: 0,
          routes: [{ name: "AppStack" }],
        });
      }
    }, [auth])
  );

  return (
    <Block>
      <StatusBar backgroundColor={"#eeeeee"} />
      {auth.statusCode !== 0 && auth.statusCode !== 1000
        ? Alert.alert("Error", "User tidak ditemukan!")
        : null}
      <Block
        center
        style={{
          marginTop: 100,
          height: 100,
        }}
      >
        <Text bold size="xl" style={{ marginBottom: 4 }}>
          Welcome.
        </Text>
        <Block style={{ width: 290, height: 0, alignItems: "center" }}>
          <Text color="black" size={"md"} center>
            Jika terjadi kesulitan login, silahkan hubungi Team Support Kami
          </Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL("https://wa.me/+6285882159624");
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                style={{ marginRight: 3 }}
                name="logo-whatsapp"
                size={16}
                color="#25D366"
              />
              <Text
                size="md"
                color="black"
                style={{
                  textDecorationLine: "underline",
                  fontWeight: "700",
                }}
              >
                WhatsApp
              </Text>
            </View>
          </TouchableOpacity>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validate={(values) => {
              const errors = {} as any;
              if (!values.email) {
                errors.email = "Email is required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              if (!values.password) {
                errors.password = "Password is equired";
              }
              return errors;
            }}
            onSubmit={(values) => {
              dispatch(
                authLoginRequest({
                  email: values.email,
                  password: values.password,
                })
              );
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
              <Block fullWidth style={{ marginHorizontal: 20, marginTop: 80 }}>
                <TextInput
                  label="Email"
                  value={values.email}
                  autoFocus={true}
                  placeholder="Masukan Email"
                  onBlur={handleBlur("email")}
                  onChange={handleChange("email")}
                  errorMessage={errors.email && touched.email && errors.email}
                />
                <TextInput
                  label="Password"
                  value={values.password}
                  onBlur={handleBlur("password")}
                  placeholder="Masukan Kata Sandi"
                  onChange={handleChange("password")}
                  errorMessage={
                    errors.password && touched.password && errors.password
                  }
                  secure
                />
                <Button
                  inline
                  direction="row"
                  // style={{ alignItems: "center", justifyContent: "center" }}
                  space="center"
                  onPress={handleSubmit}
                  rounded="sm"
                >
                  {isPageLoading ? (
                    <ActivityIndicator size="small" color="#B8FFF9" />
                  ) : null}
                  <Text style={{ fontWeight: "bold" }} color="white">
                    Login
                  </Text>
                </Button>
              </Block>
            )}
          </Formik>
        </Block>
      </Block>
    </Block>
  );
};

export default Auth;
