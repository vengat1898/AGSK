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
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import styles from './Styles/loginStyles';

// Assets
import login1 from '../../assets/images/login1.png';
import agskLogo from '../../assets/images/AGSKLogo.png';

export default function Login() {
  const [mobileNumber, setMobileNumber] = useState('');
  const router = useRouter();

  const handleGetOtp = () => {
    // if (mobileNumber.length === 10) {
    //   router.push('/components/Otp');
    // } else {
    //   Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
    // }
    router.push('/components/Otp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Banner Image with Fog Effect */}
        <View style={styles.imageWrapper}>
          <Image source={login1} style={styles.image} />
          <View style={styles.fogOverlay}>
            <BlurView intensity={70} tint="light" style={styles.blurLayer} />
            <LinearGradient
              colors={['rgba(255,255,255,0.7)', 'rgba(255,255,255,0)']}
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
            <Text style={styles.buttonText}>Get OTP</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

