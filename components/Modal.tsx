import {
  Text,
  View,
  Alert,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import SelectOption from "./DailyUI/select";
import Modal from "react-native-modal";

interface IProps {
  value: string;
  title: string;
  handleChange: (text: string) => void;
}
const Modals: React.FC<IProps> = ({ title, value, handleChange }) => {
  const [modalVisible, setModalVisible] = useState(true);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <SelectOption
              label="Jenis Pengiriman"
              value={value}
              onChange={handleChange}
              options={[
                { label: "Go Food", value: "1" },
                { label: "GrabFood", value: "2" },
                { label: "Shopee Food", value: "3" },
                { label: "Traveloka", value: "4" },
                { label: "Lainnya", value: "5" },
              ]}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width } = Dimensions.get("screen");
console.log();

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,

    // padding: 55,
    height: 90,
    width: width,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default Modals;
