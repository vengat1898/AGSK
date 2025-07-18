import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './Styles/loginStyles';

// Assets
import login1 from '../../assets/images/login1.png';
import agskLogo from '../../assets/images/AGSKLogo.png';

export default function Login() {
  const [mobileNumber, setMobileNumber] = useState('');
  const router = useRouter();

  const handleGetOtp = async () => {
    if (mobileNumber.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
      return;
    }

    console.log('📱 Mobile entered:', mobileNumber);

    try {
      const response = await axios.get(
        `https://minsway.co.in/leaf/mb/Otp/send_otp?mobile=${mobileNumber}`
      );

      console.log('📦 API Response:', JSON.stringify(response.data, null, 2));

      const { success, message, mobile, id } = response.data;

      const mobileFinal = mobile || mobileNumber;
      const idFinal = id?.toString() || '';

      console.log('ℹ️ Message from server:', message);

      await AsyncStorage.setItem('userMobile', mobileFinal);
      if (idFinal) {
        await AsyncStorage.setItem('userId', idFinal);
      }

      console.log('🚀 Navigating to OTP screen with:', {
        id: idFinal,
        mobile: mobileFinal,
      });

      router.push({
        pathname: '/components/Otp',
        params: {
          id: idFinal,
          mobile: mobileFinal,
        },
      });
    } catch (error) {
      console.error('❌ OTP API Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Banner Image with Fog Gradient */}
        <View style={styles.imageWrapper}>
          <Image source={login1} style={styles.image} />
          <View style={styles.fogOverlay}>
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.9)', '#fff']}
              style={styles.gradientLayer}
            />
          </View>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={agskLogo} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.loginHeading}>LOGIN</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Enter Your Mobile Number</Text>
          <TextInput
            placeholder="+91 - 0000000000"
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={10}
            value={mobileNumber}
            onChangeText={setMobileNumber}
          />

          <TouchableOpacity style={styles.button} onPress={handleGetOtp}>
            <Text style={styles.buttonText}>GET OTP</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}










