import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import agskLogo from '../../assets/images/AGSKLogo.png';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Styles/otpStyles';

export default function Otp() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);
  const router = useRouter();
  const { id, mobile } = useLocalSearchParams(); // 👈 get from params

  useEffect(() => {
    console.log('Received mobile:', mobile);
    console.log('Received id:', id);
  }, []);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter the 4-digit OTP');
      return;
    }

    try {
      console.log(`Verifying OTP: ${enteredOtp} for Mobile: ${mobile}`);

      const response = await axios.get(
        `https://minsway.co.in/leaf/mb/Otpverify/verify_otp?mobile=${mobile}&otp=${enteredOtp}`
      );

      console.log('API Response:', response.data);

      if (response.data.success === 1) {
        await AsyncStorage.setItem('otpVerified', 'true');

        // Navigate with id and mobile to Register
        router.push({
          pathname: '/components/Register',
          params: { id: id?.toString(), mobile: mobile?.toString() },
        });
      } else {
        Alert.alert('Verification Failed', response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      Alert.alert('Error', 'Something went wrong while verifying OTP');
    }
  };

  const handleResend = () => {
    console.log('Resend OTP clicked');
    // You can call resend OTP API here if required
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.innerContainer}
      >
        <Image source={agskLogo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.heading}>OTP</Text>
        <Text style={styles.subheading}>Please enter the OTP sent to your number</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={styles.otpBox}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendText}>
            Haven’t Received OTP?{' '}
            <Text style={styles.resendHighlight}>Resend</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}





