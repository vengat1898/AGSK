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
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/services/api";
import { SessionContext } from "../../context/SessionContext";
const { width, height } = Dimensions.get("window");
import styles from "./Styles/HotelRegister.styles";

export default function HotelSupplyRegister() {
  const [hotelName, setHotelName] = useState("");
  const [name, setName] = useState("");
  const { mobile } = useLocalSearchParams();
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { saveSession } = useContext(SessionContext);
  const router = useRouter();

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Please allow media access to upload image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7, // Increased quality for better preview
      allowsEditing: true,
      aspect: [16, 9], // Better aspect ratio for hotel images
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // Auto-upload the image after selection
      await uploadImageToServer(result.assets[0]);
    }
  };

  const uploadImageToServer = async (imageAsset) => {
    if (!imageAsset) return;

    setIsUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Debug: Log the image asset details
      console.log("🖼️ Image Asset:", {
        uri: imageAsset.uri,
        type: imageAsset.type,
        fileName: imageAsset.fileName
      });
      
      const fileExtension = imageAsset.fileName ? imageAsset.fileName.split('.').pop().toLowerCase() : 'jpg';
      const mimeType = fileExtension === 'png' ? 'image/png' : 
                      fileExtension === 'gif' ? 'image/gif' : 'image/jpeg';
      
      formData.append('file', {
        uri: imageAsset.uri,
        type: mimeType,
        name: imageAsset.fileName || `hotel_image_${Date.now()}.${fileExtension}`,
      });

      console.log("🌐 API Base URL:", api.defaults?.baseURL);
      console.log("📤 Uploading to endpoint: /customer/upload_file");
      
      const response = await api.post('/customer/upload_file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout
      });

      console.log("📦 Upload Response:", response.data);

      // Match your PHP response structure
      if (response.data.success === true) {
        // Store the filename from your PHP response
        setUploadedImageUrl(response.data.filename);
        Alert.alert("Success", response.data.message || "Image uploaded successfully!");
      } else {
        Alert.alert("Upload Failed", response.data.message || "Failed to upload image");
        // Reset image if upload fails
        setImage(null);
      }
    } catch (error) {
      console.error("❌ Image Upload Error:", error);
      
      // More detailed error logging
      if (error.response) {
        // Server responded with error status
        console.log("📄 Error Response Status:", error.response.status);
        console.log("📄 Error Response Data:", error.response.data);
        console.log("📄 Error Response Headers:", error.response.headers);
        const errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        Alert.alert("Upload Error", errorMessage);
      } else if (error.request) {
        // Network error - no response received
        console.log("🌐 Network Error - Request made but no response:", error.request);
        console.log("🌐 Error Code:", error.code);
        console.log("🌐 Error Message:", error.message);
        Alert.alert("Network Error", "Cannot connect to server. Please check your internet connection and try again.");
      } else {
        // Other error
        console.log("⚠️ Other Error:", error.message);
        Alert.alert("Upload Error", "Failed to upload image. Please try again.");
      }
      
      // Reset image if upload fails
      setImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please allow location access to fetch address."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const [place] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (place) {
        const addressParts = [
          place.name,
          place.street,
          place.city,
          place.region,
          place.postalCode
        ].filter(Boolean); // Remove empty/null values
        
        const fullAddress = addressParts.join(', ');
        setAddress(fullAddress);
      } else {
        Alert.alert("Error", "Could not retrieve address");
      }
    } catch (error) {
      console.error("❌ Location Error:", error);
      Alert.alert("Error", "Unable to fetch location. Please enter address manually.");
    }
  };

  const handleRegister = async () => {
    if (!hotelName.trim() || !name.trim() || !mobile || !address.trim()) {
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

    // Check if image is still uploading
    if (isUploading) {
      Alert.alert("Please Wait", "Image is still uploading. Please wait.");
      return;
    }

    try {
      // Build URL with image parameter if available
      let url = `/Customer/register_customer?mobile=${mobile}&type=2&name=${encodeURIComponent(
        name.trim()
      )}&address=${encodeURIComponent(address.trim())}&hot_name=${encodeURIComponent(
        hotelName.trim()
      )}`;
      
      // Add image filename if uploaded successfully
      if (uploadedImageUrl) {
        url += `&image=${encodeURIComponent(uploadedImageUrl)}`;
      }

      console.log("📡 Sending to:", url);
      const response = await api.get(url);
      console.log("📦 API Response:", response.data);

      if (response.data.status === 1) {
        const customerData = response.data.data;
        await saveSession({
          id: customerData.id,
          name: customerData.name,
          mobile: customerData.mobile,
          email: customerData.email,
          type: 2,
        });
        Alert.alert("Success", "Hotel Supplier Registered Successfully", [
          {
            text: "OK",
            onPress: () => {
              router.replace({
                pathname: "/components/Home",
              });
            }
          }
        ]);
      } else {
        Alert.alert(
          "Registration Failed",
          response.data.message || "Something went wrong"
        );
      }
    } catch (error) {
      console.error("❌ Registration Error:", error);
      const errorMessage = error.response?.data?.message || "Something went wrong while registering";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formWrapper}>
            <Text style={styles.title}>Hotel Supply Register</Text>

            <TextInput
              style={styles.input}
              placeholder="Hotel Name"
              placeholderTextColor="#999"
              value={hotelName}
              onChangeText={setHotelName}
              returnKeyType="next"
              blurOnSubmit={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              returnKeyType="next"
              blurOnSubmit={false}
            />

            <TextInput
              style={[styles.input, styles.disabledInput]}
              placeholder="Mobile"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={10}
              value={mobile}
              editable={false}
            />

            <View style={styles.addressContainer}>
              <TextInput
                style={[styles.input, styles.addressInput]}
                placeholder="Address"
                placeholderTextColor="#999"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                returnKeyType="done"
              />
              <TouchableOpacity
                onPress={handleUseCurrentLocation}
                style={styles.locationButton}
              >
                <Ionicons name="location-outline" size={22} color="#29CB56" />
              </TouchableOpacity>
            </View>

            {/* Image Upload Section */}
            <View style={styles.imageSection}>
              <TouchableOpacity 
                style={[styles.uploadBox, isUploading && styles.uploadingBox]} 
                onPress={handleImagePick}
                disabled={isUploading}
              >
                {image ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: image }} style={styles.previewImage} />
                    <TouchableOpacity
                      style={styles.changeImageButton}
                      onPress={handleImagePick}
                      disabled={isUploading}
                    >
                      <Text style={styles.changeImageText}>Change Image</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.uploadContent}>
                    <Feather 
                      name={isUploading ? "clock" : "upload"} 
                      size={24} 
                      color="#29CB56" 
                    />
                    <Text style={styles.uploadText}>
                      {isUploading ? "Uploading..." : "Upload Hotel Image"}
                    </Text>
                    <Text style={styles.uploadSubText}>
                      Tap to select from gallery
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Show upload status */}
              {uploadedImageUrl && !isUploading && (
                <View style={styles.successContainer}>
                  <Ionicons name="checkmark-circle" size={20} color="#29CB56" />
                  <Text style={styles.successText}>Image uploaded successfully</Text>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={[
                styles.button, 
                (isUploading || !hotelName.trim() || !name.trim() || !address.trim()) && styles.disabledButton
              ]} 
              onPress={handleRegister}
              disabled={isUploading || !hotelName.trim() || !name.trim() || !address.trim()}
            >
              <Text style={styles.buttonText}>
                {isUploading ? "Please Wait..." : "Register"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}