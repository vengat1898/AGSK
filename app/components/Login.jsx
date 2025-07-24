import React, { useState, useCallback, useRef } from "react";
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
  Dimensions,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import styles from "./Styles/loginStyles";
import api from "@/services/api";

// Assets
import login1 from "../../assets/images/login1.png";
import agskLogo from "../../assets/images/AGSKLogo.png";

const { height: screenHeight } = Dimensions.get('window');

export default function Login() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const router = useRouter();
  const scrollViewRef = useRef(null);

  // Handle keyboard visibility
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      // Scroll to bottom when keyboard shows
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  // Clear storage and reset state when screen is focused
  useFocusEffect(
    useCallback(() => {
      console.log("🔄 Login screen focused - Clearing data");
      
      const clearData = async () => {
        try {
          // Clear specific keys instead of all AsyncStorage
          await AsyncStorage.multiRemove([
            "userMobile",
            "userId", 
            "customerMobile",
            "customerId",
            "type",
            "otpVerified",
            "loginStatus",
            "isLoggingOut",
          ]);
          
          // Reset component state
          setMobileNumber("");
          console.log("✅ Login data cleared");
        } catch (error) {
          console.error("❌ Error clearing data:", error);
        }
      };
      
      clearData();
    }, [])
  );

  const validateMobileNumber = (number) => {
    const mobileRegex = /^[6-9]\d{9}$/; // Indian mobile number pattern
    return mobileRegex.test(number);
  };

  const handleGetOtp = async () => {
    const trimmedNumber = mobileNumber.trim();
    
    if (!validateMobileNumber(trimmedNumber)) {
      Alert.alert(
        "Invalid Number",
        "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9"
      );
      return;
    }

    setIsLoading(true);
    console.log("📱 Mobile entered:", trimmedNumber);

    try {
      const response = await api.get(`/Otp/send_otp?mobile=${trimmedNumber}`);
      
      console.log("📦 API Response:", response.data);
      console.log("🚀 Navigating to OTP screen");

      router.replace({
        pathname: "/components/Otp",
        params: { mobile: trimmedNumber },
      });
    } catch (error) {
      console.error("❌ OTP API Error:", error);
      
      let errorMessage = "Failed to send OTP. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (text) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, '');
    setMobileNumber(numericText);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : ''}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.scrollContent,
            keyboardVisible && styles.scrollContentWithKeyboard
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          enableOnAndroid={true}
        >
          {/* Banner Image - Hide or shrink when keyboard is visible */}
          {!keyboardVisible && (
            <View style={styles.imageWrapper}>
              <Image 
                source={login1} 
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.fogOverlay}>
                <LinearGradient
                  colors={[
                    "transparent",
                    "rgba(255,255,255,0.5)",
                    "rgba(255,255,255,0.9)",
                    "#fff",
                  ]}
                  style={styles.gradientLayer}
                />
              </View>
            </View>
          )}

          {/* Logo Section - Compact when keyboard is visible */}
          <View style={[
            styles.logoContainer,
            keyboardVisible && styles.logoContainerCompact
          ]}>
            <Image
              source={agskLogo}
              style={[
                styles.logoImage,
                keyboardVisible && styles.logoImageSmall
              ]}
              resizeMode="contain"
            />
            <Text style={[
              styles.loginHeading,
              keyboardVisible && styles.loginHeadingSmall
            ]}>LOGIN</Text>
          </View>

          {/* Form Section */}
          <View style={[
            styles.formContainer,
            keyboardVisible && styles.formContainerWithKeyboard
          ]}>
            <Text style={styles.label}>Enter Your Mobile Number</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                placeholder="Enter Phone Number"
                style={styles.input}
                keyboardType="numeric"
                maxLength={10}
                value={mobileNumber}
                onChangeText={handleTextChange}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleGetOtp}
                editable={!isLoading}
                onFocus={() => {
                  // Scroll to input when focused
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 200);
                }}
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.button,
                (isLoading || mobileNumber.length !== 10) && styles.buttonDisabled
              ]} 
              onPress={handleGetOtp}
              disabled={isLoading || mobileNumber.length !== 10}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.buttonText,
                (isLoading || mobileNumber.length !== 10) && styles.buttonTextDisabled
              ]}>
                {isLoading ? "SENDING OTP..." : "GET OTP"}
              </Text>
            </TouchableOpacity>

            {/* Help Text */}
            <Text style={styles.helpText}>
              We'll send you a verification code on this number
            </Text>

            {/* Extra padding for keyboard */}
            {keyboardVisible && <View style={styles.keyboardPadding} />}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}