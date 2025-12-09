import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../AppNavigator";
import Ionicons from "@expo/vector-icons";

type EditAddressNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "EditAddress"
>;
type EditAddressRouteProp = RouteProp<RootStackParamList, "EditAddress">;

type Props = {
  navigation: EditAddressNavProp;
  route: EditAddressRouteProp;
};

export default function EditAddressScreen({ navigation, route }: Props) {
  const oldAddress = route.params?.address;

  const [name, setName] = useState(oldAddress?.name || "");
  const [phone, setPhone] = useState(oldAddress?.phone || "");
  const [city, setCity] = useState(oldAddress?.city || "");
  const [district, setDistrict] = useState(oldAddress?.district || "");
  const [ward, setWard] = useState(oldAddress?.ward || "");
  const [address, setAddress] = useState(oldAddress?.address || "");
  const [isPrimary, setIsPrimary] = useState(oldAddress?.isPrimary || false);

  const isEditing = !!oldAddress;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>
        {isEditing ? "Edit Address" : "Add New Address"}
      </Text>

      {/* Name */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      {/* Phone */}
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* City, District */}
      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>City / Province</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.label}>District</Text>
          <TextInput
            style={styles.input}
            value={district}
            onChangeText={setDistrict}
          />
        </View>
      </View>

      {/* Ward */}
      <Text style={styles.label}>Ward / Commune</Text>
      <TextInput
        style={styles.input}
        value={ward}
        onChangeText={setWard}
      />

      {/* Address */}
      <Text style={styles.label}>Detailed Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      {/* Switch */}
      <View style={styles.switchRow}>
        <Text style={styles.label}>Set as primary address</Text>
        <Switch value={isPrimary} onValueChange={setIsPrimary} />
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={() => {
            const newAddress = {
              name,
              phone,
              city,
              district,
              ward,
              address,
              isPrimary,
            };
            console.log(isEditing ? "Edited:" : "Added:", newAddress);
            navigation.goBack();
          }}
        >
          <Text style={styles.submitText}>
            {isEditing ? "Save Changes" : "Add Address"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F6F7FB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14,
    color: "#000",
  },
  row: {
    flexDirection: "row",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#B0B0B0",
    borderRadius: 10,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: "center",
  },
  cancelText: {
    color: "#007AFF",
    fontSize: 16,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#2D7FF9",
    borderRadius: 10,
    paddingVertical: 12,
    marginLeft: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
