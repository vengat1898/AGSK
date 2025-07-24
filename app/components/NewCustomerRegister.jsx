import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import api from "@/services/api";
import { SessionContext } from "@/context/SessionContext";
import styles from "./Styles/customerRegister.styles";
const { width } = Dimensions.get("window");

export default function NewCustomerRegister() {
  const [name, setName] = useState("");
  const { mobile } = useLocalSearchParams();
  const [address, setAddress] = useState("");
  const router = useRouter();


  const {saveSession}=useContext(SessionContext)
  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to fetch address."
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync(location.coords);

      if (place) {
        const fullAddress = `${place.name || ""}, ${place.street || ""}, ${
          place.city || ""
        }, ${place.region || ""}, ${place.postalCode || ""}, ${
          place.country || ""
        }`;
        setAddress(fullAddress.trim());
      } else {
        Alert.alert("Error", "Unable to fetch address from location");
      }
    } catch (error) {
      console.error("❌ Location Error:", error);
      Alert.alert("Error", "Failed to get current location");
    }
  };

  const handleRegister = async () => {
    if (!name || !mobile || !address) {
      Alert.alert("Missing Fields", "Please fill all the fields");
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert(
        "Invalid Mobile Number",
        "Please enter a valid 10-digit number"
      );
      return;
    }

    try {
      const url = `/Customer/register_customer?mobile=${mobile}&type=1&name=${encodeURIComponent(
        name
      )}&address=${encodeURIComponent(address)}`;
      console.log("📡 Registering via URL:", url);

      const response = await api.get(url);
      const { status, message, customer_id,data } = response.data;

      console.log("📝 Message:", message);
      console.log("✅ Status:", status);
      console.log("📦 Data:", data);

      if (status === 1 && data) {
        await saveSession({
          id: data.id,
          name: data.name,
          mobile: data.mobile,
          email: data.email,
          type: data.type,
        });
        Alert.alert("Success", "Customer Registered Successfully");

        router.replace({
          pathname: "/components/Home",
          params: {
            id: data.id,
            mobile: data.mobile,
            address: data.address,
            name: data.name,
            user_id: data.user_id,
            customer_id: customer_id,
          },
        });
      } else {
        Alert.alert(
          "Registration Failed",
          `Reason: ${message || "Unknown"}, Status: ${status}`
        );
      }
    } catch (error) {
      console.error("❌ Registration Error:", error);
      Alert.alert(
        "Error",
        "Something went wrong while registering the customer"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.innerContainer}
      >
        <View style={styles.formWrapper}>
          <Text style={styles.title}>New Customer Register</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={[styles.input, { backgroundColor: "#f0f0f0" }]}
            placeholder="Mobile"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={10}
            value={mobile}
            editable={false}
          />

          {/* Styled Address Input with Location Icon */}
          <View style={styles.addressContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Address"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
              multiline
            />
            <TouchableOpacity
              onPress={getCurrentLocation}
              style={styles.iconButton}
            >
              <Ionicons name="location-outline" size={22} color="#29CB56" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


