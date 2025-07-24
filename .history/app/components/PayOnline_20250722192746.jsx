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
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import qrCodeImage from '../../assets/images/Qrcode.png';

export default function PayOnline() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [screenshot, setScreenshot] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please allow media access to upload image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      aspect: [4, 3], // Good aspect ratio for screenshots
    });

    if (!result.canceled && result.assets.length > 0) {
      setScreenshot(result.assets[0].uri);
      // Upload image to server immediately after selection
      await uploadImageToServer(result.assets[0]);
    }
  };

  const uploadImageToServer = async (imageAsset) => {
    if (!imageAsset) return;

    setIsUploading(true);
    try {
      const formData = new FormData();

      // Get file extension and determine MIME type
      const fileExtension = imageAsset.fileName
        ? imageAsset.fileName.split(".").pop().toLowerCase()
        : "jpg";
      
      const mimeType = fileExtension === "png" ? "image/png" 
                      : fileExtension === "gif" ? "image/gif" 
                      : "image/jpeg";

      formData.append("file", {
        uri: imageAsset.uri,
        type: mimeType,
        name: imageAsset.fileName || `payment_screenshot_${Date.now()}.${fileExtension}`,
      });

      // Replace with your actual API endpoint
      const apiUrl = "https://minsway.co.in/leaf/mb/customer/upload_file";
      
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      console.log('Upload response:', response.data);

      if (response.data.success === true || response.data.success === 1) {
        setUploadedImageUrl(response.data.filename || response.data.file_name);
        Alert.alert("Success", "Payment screenshot uploaded successfully!");
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("❌ Image Upload Error:", error);

      // Clear the screenshot on upload failure
      setScreenshot(null);
      setUploadedImageUrl(null);

      if (error.response) {
        const errorMessage = error.response.data?.message || 
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
          error.message || "Failed to upload image. Please try again."
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinue = async () => {
    if (!screenshot) {
      Alert.alert('Upload Required', 'Please upload a payment screenshot before proceeding.');
      return;
    }

    if (!uploadedImageUrl) {
      Alert.alert('Upload Pending', 'Please wait for the image to finish uploading.');
      return;
    }

    try {
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
        orginal_price: original_price, // Note: keeping original spelling from your code
        delivery: delivery_charge,
        total_price,
        address,
        second_mobile: mobile,
        payment_type: 'online',
        order_image: uploadedImageUrl, // Use the uploaded filename from server
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
          order_image: uploadedImageUrl,
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
      Alert.alert('Error', 'Failed to place order. Please try again.');
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
          <TouchableOpacity 
            style={[styles.uploadBtn, isUploading && styles.uploadBtnDisabled]} 
            onPress={pickImage}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Feather name="image" size={20} color="#000" />
            )}
            <Text style={styles.uploadText}>
              {isUploading ? ' Uploading...' : ' Choose Image'}
            </Text>
          </TouchableOpacity>

          {screenshot && (
            <View style={styles.uploadedImageContainer}>
              <Image source={{ uri: screenshot }} style={styles.uploadedImage} />
              {uploadedImageUrl && (
                <View style={styles.uploadSuccessIndicator}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.uploadSuccessText}>Uploaded</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          style={[
            styles.continueBtn, 
            (!screenshot || isUploading) && styles.continueBtnDisabled
          ]} 
          onPress={handleContinue}
          disabled={!screenshot || isUploading || !uploadedImageUrl}
        >
          <Text style={[
            styles.continueText,
            (!screenshot || isUploading) && styles.continueTextDisabled
          ]}>
            Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  centerBox: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  qrSection: {
    alignItems: 'center',
    marginVertical: 30,
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  uploadSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  uploadBtnDisabled: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  uploadText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  uploadedImageContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  uploadedImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  uploadSuccessIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  uploadSuccessText: {
    color: '#4CAF50',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  continueBtn: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueBtnDisabled: {
    backgroundColor: '#cccccc',
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueTextDisabled: {
    color: '#999',
  },
});