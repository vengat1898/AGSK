// import React, { useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   Alert,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useFocusEffect } from '@react-navigation/native'; // ✅ Add this import
// import styles from './Styles/loginStyles';

// // Assets
// import login1 from '../../assets/images/login1.png';
// import agskLogo from '../../assets/images/AGSKLogo.png';

// export default function Login() {
//   const [mobileNumber, setMobileNumber] = useState('');
//   const router = useRouter();

//   // ✅ Refresh/reset on screen focus
//   useFocusEffect(
//     useCallback(() => {
//       console.log('🔄 Login screen focused, resetting state');
//       setMobileNumber('');
//       AsyncStorage.removeItem('userMobile');
//       AsyncStorage.removeItem('userId');
//     }, [])
//   );

//   const handleGetOtp = async () => {
//     if (mobileNumber.length !== 10) {
//       Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
//       return;
//     }

//     console.log('📱 Mobile entered:', mobileNumber);

//     try {
//       const response = await axios.get(
//         `https://minsway.co.in/leaf/mb/Otp/send_otp?mobile=${mobileNumber}`
//       );

//       console.log('📦 API Response:', JSON.stringify(response.data, null, 2));

//       const { success, message, mobile, id } = response.data;

//       const mobileFinal = mobile || mobileNumber;
//       const idFinal = id?.toString() || '';

//       console.log('ℹ️ Message from server:', message);

//       await AsyncStorage.setItem('userMobile', mobileFinal);
//       if (idFinal) {
//         await AsyncStorage.setItem('userId', idFinal);
//       }

//       console.log('🚀 Navigating to OTP screen with:', {
//         id: idFinal,
//         mobile: mobileFinal,
//       });

//       router.push({
//         pathname: '/components/Otp',
//         params: {
//           id: idFinal,
//           mobile: mobileFinal,
//         },
//       });
//     } catch (error) {
//       console.error('❌ OTP API Error:', error);
//       Alert.alert('Error', 'Failed to send OTP. Please try again.');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         style={styles.container}
//       >
//         {/* Banner Image with Fog Gradient */}
//         <View style={styles.imageWrapper}>
//           <Image source={login1} style={styles.image} />
//           <View style={styles.fogOverlay}>
//             <LinearGradient
//               colors={['transparent', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.9)', '#fff']}
//               style={styles.gradientLayer}
//             />
//           </View>
//         </View>

//         {/* Logo */}
//         <View style={styles.logoContainer}>
//           <Image source={agskLogo} style={styles.logoImage} resizeMode="contain" />
//           <Text style={styles.loginHeading}>LOGIN</Text>
//         </View>

//         {/* Form */}
//         <View style={styles.formContainer}>
//           <Text style={styles.label}>Enter Your Mobile Number</Text>
//           <TextInput
//             placeholder="+91 - 0000000000"
//             style={styles.input}
//             keyboardType="phone-pad"
//             maxLength={10}
//             value={mobileNumber}
//             onChangeText={setMobileNumber}
//           />

//           <TouchableOpacity style={styles.button} onPress={handleGetOtp}>
//             <Text style={styles.buttonText}>GET OTP</Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

import React, { useState, useCallback, useEffect } from 'react';
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
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import styles from './Styles/loginStyles';

// Assets
import login1 from '../../assets/images/login1.png';
import agskLogo from '../../assets/images/AGSKLogo.png';

export default function Login() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [forceRender, setForceRender] = useState(0); // Force re-render
  const router = useRouter();

  // ✅ COMPLETE FIX: Multiple clearing strategies
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Login screen focused - COMPLETE RESET');
      
      // Strategy 1: Clear all AsyncStorage
      AsyncStorage.clear();
      
      // Strategy 2: Clear specific known keys
      AsyncStorage.multiRemove([
        'userMobile',
        'userId', 
        'customerMobile',
        'customerId',
        'type',
        'otpVerified',
        'loginStatus',
        'isLoggingOut'
      ]);
      
      // Strategy 3: Reset component state
      setMobileNumber('');
      
      // Strategy 4: Force component re-render
      setForceRender(prev => prev + 1);
      
      // Strategy 5: Add small delay to ensure clearing completes
      setTimeout(() => {
        setMobileNumber('');
        console.log('✅ Login reset complete');
      }, 100);
      
    }, [])
  );

  // ✅ ADDITIONAL: Clear on component mount
  useEffect(() => {
    console.log('🔄 Login component mounted - Initial clear');
    AsyncStorage.clear();
    setMobileNumber('');
  }, []);

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

      // ✅ CLEAN SLATE: Clear everything before storing new data
      await AsyncStorage.clear();
      
      // Store only OTP verification data
      await AsyncStorage.multiSet([
        ['userMobile', mobileFinal],
        ['userId', idFinal],
        ['tempOtpData', JSON.stringify({ mobile: mobileFinal, id: idFinal })]
      ]);

      console.log('🚀 Navigating to OTP screen with:', {
        id: idFinal,
        mobile: mobileFinal,
      });

      router.push({
        pathname: '/components/Otp',
        params: { id: idFinal, mobile: mobileFinal },
      });
    } catch (error) {
      console.error('❌ OTP API Error:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  // ✅ FORCE CLEAR: Clear input when text changes (if needed)
  const handleTextChange = (text) => {
    setMobileNumber(text);
  };

  return (
    <SafeAreaView style={styles.container} key={forceRender}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Banner Image */}
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
              key={`mobile-input-${forceRender}`} // Force new TextInput instance
              placeholder="+91 - 0000000000"
              style={styles.input}
              keyboardType="phone-pad"
              maxLength={10}
              value={mobileNumber}
              onChangeText={handleTextChange}
              clearTextOnFocus={true} // Clear on focus (iOS)
              selectTextOnFocus={true} // Select all on focus
              autoFocus={false}
            />

            <TouchableOpacity style={styles.button} onPress={handleGetOtp}>
              <Text style={styles.buttonText}>GET OTP</Text>
            </TouchableOpacity>

            {/* ✅ DEBUG: Show current state */}
            <Text style={{ fontSize: 12, color: 'gray', marginTop: 10 }}>
              Debug: Current value = "{mobileNumber}" | Render: {forceRender}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}











