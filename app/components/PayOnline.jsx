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
        Alert.alert('Success', 'Order placed successfully!');

        const updatedParams = {
          ...params,
          payment_type: 'online',
          order_image: fileName,
        };

        console.log('\n========= ✅ Redirecting to Checkout with Params =========');
        console.log(updatedParams);
        console.log('==========================================================\n');

        router.replace({
          pathname: '/components/Checkout',
          params: updatedParams,
        });
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
          <TouchableOpacity onPress={() => router.back()}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  centerBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#f6fff6',
  },
  infoText: {
    fontSize: 16,
    color: '#000',
  },
  qrSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  uploadSection: {
    marginBottom: 24,
  },
  uploadBtn: {
    flexDirection: 'row',
    backgroundColor: '#e9f5ec',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  uploadText: {
    fontSize: 14,
    color: '#000',
    alignSelf: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    marginTop: 12,
    borderRadius: 10,
  },
  continueBtn: {
    backgroundColor: 'green',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});





