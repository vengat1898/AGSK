import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import qrCodeImage from '../../assets/images/Qrcode.png';
import styles from './Styles/PayOnline.styles';
export default function PayOnline() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [screenshot, setScreenshot] = useState(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setScreenshot(result.assets[0].uri);
    }
  };
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
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect for profile pictures
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await uploadImageToServer(result.assets[0]);
    }
  };

  const uploadImageToServer = async (imageAsset) => {
    if (!imageAsset) return;

    setIsUploading(true);
    try {
      const formData = new FormData();

      const fileExtension = imageAsset.fileName
        ? imageAsset.fileName.split(".").pop().toLowerCase()
        : "jpg";
      const mimeType =
        fileExtension === "png"
          ? "image/png"
          : fileExtension === "gif"
          ? "image/gif"
          : "image/jpeg";

      formData.append("file", {
        uri: imageAsset.uri,
        type: mimeType,
        name: imageAsset.fileName || `invoice_${Date.now()}.${fileExtension}`,
      });

      const response = await api.post("/customer/upload_file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      if (response.data.success === true) {
        setUploadedImageUrl(response.data.filename);
        Alert.alert("Success", "bill image updated successfully!");
      } else {
        Alert.alert(
          "Upload Failed",
          response.data.message || "Failed to upload image"
        );
        setImage(null);
      }
    } catch (error) {
      console.error("❌ Image Upload Error:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
        Alert.alert("Upload Error", errorMessage);
      } else if (error.request) {
        Alert.alert(
          "Network Error",
          "Cannot connect to server. Please check your internet connection and try again."
        );
      } else {
        Alert.alert(
          "Upload Error",
          "Failed to upload image. Please try again."
        );
      }

      setImage(null);
    } finally {
      setIsUploading(false);
    }
  };
  const handleContinue = async () => {
    if (!screenshot) {
      Alert.alert('Upload Required', 'Please upload a payment screenshot before proceeding.');
      return;
    }

    try {
      const fileName = screenshot.split('/').pop();

      const {
        user_id,
        mobile,
        address,
        original_price,
        delivery_charge,
        total_price,
        delivery_date,
        order_date,
        type,
        pincode,
      } = params;

      const apiUrl = `https://minsway.co.in/leaf/mb/Finalplaceorder/final_update`;

      const finalParams = {
        mobile,
        orginal_price: original_price,
        delivery: delivery_charge,
        total_price,
        address,
        second_mobile: mobile,
        payment_type: 'online',
        order_image: fileName,
        pincode,
        order_date,
        delivery_date,
        type,
      };

      console.log('\n================ FINAL ORDER REQUEST ================');
      console.log('🧾 API URL:', apiUrl);
      console.log('📦 Params:', finalParams);
      console.log('====================================================\n');

      const response = await axios.get(apiUrl, { params: finalParams });

      console.log('\n================ FINAL ORDER RESPONSE ===============');
      console.log('✅ Response Data:', response.data);
      console.log('====================================================\n');

      if (response.data.success === 1) {
        const updatedParams = {
          ...params,
          payment_type: 'online',
          order_image: fileName,
        };

        Alert.alert(
          'Success',
          'Order placed successfully! Confirmation within 12 hours',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('\n========= ✅ Redirecting to Home with Params =========');
                console.log(updatedParams);
                console.log('======================================================\n');

                router.replace({
                  pathname: '/components/Home',
                  params: updatedParams,
                });
              },
            },
          ]
        );
      } else {
        Alert.alert('Failed', response.data.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error('\n❌ FINAL ORDER ERROR ================================');
      console.error(error);
      console.error('====================================================\n');
      Alert.alert('Error', 'Failed to place order.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/components/Checkout')}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pay Online</Text>
        </View>

        {/* UPI ID Box */}
        <View style={styles.centerBox}>
          <Text style={styles.label}>UPI ID</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>vengat@ybl</Text>
          </View>
        </View>

        {/* GPay Number Box */}
        <View style={styles.centerBox}>
          <Text style={styles.label}>GPay Number</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>+91 98765 43210</Text>
          </View>
        </View>

        {/* QR Code */}
        <View style={styles.qrSection}>
          <Image source={qrCodeImage} style={styles.qrImage} resizeMode="contain" />
        </View>

        {/* Upload Screenshot */}
        <View style={styles.uploadSection}>
          <Text style={styles.label}>Upload Payment Screenshot</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
            <Feather name="image" size={20} color="#000" />
            <Text style={styles.uploadText}> Choose Image</Text>
          </TouchableOpacity>

          {screenshot && (
            <Image source={{ uri: screenshot }} style={styles.uploadedImage} />
          )}
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}








