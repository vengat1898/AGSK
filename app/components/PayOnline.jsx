import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import qrCodeImage from '../../assets/images/Qrcode.png';

export default function PayOnline() {
  const router = useRouter();
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pay Online</Text>
        </View>
      </SafeAreaView>

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
      <TouchableOpacity
        style={styles.continueBtn}
        onPress={() => router.push('/components/Checkout')} // or destination screen
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  headerSafe: {
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop:40
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
    alignSelf:"center"
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
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
