import React, { useRef, useState, useCallback } from 'react';
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
  ScrollView,
} from 'react-native';
import agskLogo from '../../assets/images/AGSKLogo.png';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import styles from './Styles/otpStyles';

export default function Otp() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);
  const router = useRouter();
  const { id, mobile, type } = useLocalSearchParams();

  useFocusEffect(
    useCallback(() => {
      console.log('🔄 OTP screen focused, clearing input');
      setOtp(['', '', '', '']);
      inputs.current[0]?.focus();
    }, [])
  );

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
      const apiUrl = `https://minsway.co.in/leaf/mb/Otpverify/verify_otp?mobile=${mobile}&otp=${enteredOtp}`;
      const raw = await axios.get(apiUrl, {
        transformResponse: [(data) => data],
      });

      let responseJson;
      try {
        const rawData = raw.data;
        const firstBrace = rawData.indexOf('{');
        const lastBrace = rawData.lastIndexOf('}');
        const cleaned = rawData.substring(firstBrace, lastBrace + 1);
        responseJson = JSON.parse(cleaned);
      } catch (err) {
        console.error('❌ JSON parsing failed:', raw.data);
        Alert.alert('Error', 'Invalid response from server.');
        return;
      }

      console.log('✅ OTP API Response:', responseJson);

      const success = responseJson.success;
      const message = responseJson.message || '';
      const returnedType = responseJson.type || type || '';
      const data = responseJson.data || responseJson;

      // ✅ COMPLETE CLEAR: Remove all previous data
      await AsyncStorage.clear();

      // Set fresh session data
      const sessionData = [
        ['otpVerified', 'true'],
        ['customerMobile', data?.mobile || mobile],
        ['type', returnedType],
        ['customerId', (data?.id || id)?.toString() || ''],
        ['loginStatus', 'loggedIn'],
        ['isLoggingOut', 'false'],
        ['sessionTimestamp', Date.now().toString()]
      ];

      await AsyncStorage.multiSet(sessionData);
      
      console.log('✅ Fresh session data saved');

      if (message.toLowerCase().includes('not registered') || success === 2) {
        console.log('🔄 Redirecting to Register');
        router.replace({
          pathname: '/components/Register',
          params: {
            id: data?.id || '',
            mobile: data?.mobile || mobile,
            type: returnedType,
          },
        });
      } else if (message === 'Already Registered' || success === 1) {
        console.log('🏠 Redirecting to Home');
        router.replace({
          pathname: '/components/Home',
          params: {
            id: data?.id || '',
            mobile: data?.mobile || mobile,
            type: returnedType,
          },
        });
      } else {
        console.log('❌ Verification failed:', message);
        Alert.alert('Verification Failed', message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('❌ OTP Verification Error:', error);
      Alert.alert('Error', 'Something went wrong while verifying OTP');
    }
  };

  const handleResend = async () => {
    console.log('🔁 Resend OTP clicked');
    try {
      const response = await axios.get(
        `https://minsway.co.in/leaf/mb/Otp/send_otp?mobile=${mobile}`
      );
      Alert.alert('Success', 'OTP has been resent to your mobile number');
    } catch (error) {
      console.error('❌ Resend OTP Error:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={agskLogo} style={styles.logo} resizeMode="contain" />

          <Text style={styles.heading}>OTP</Text>
          <Text style={styles.subheading}>Please enter the OTP sent to {mobile}</Text>

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
              Haven't Received OTP?{' '}
              <Text style={styles.resendHighlight}>Resend</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}










