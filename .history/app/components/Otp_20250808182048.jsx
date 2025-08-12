import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import agskLogo from "../../assets/images/AGSKLogo.png";
import { SessionContext } from "../../context/SessionContext";
import api from "../../services/api";
import styles from "./Styles/otpStyles";

export default function Otp() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const inputs = useRef([]);
  const timerRef = useRef(null);
  const router = useRouter();
  const { mobile, type } = useLocalSearchParams();
  const { saveSession } = useContext(SessionContext);

  // Timer effect
  useEffect(() => {
    if (timer > 0) {
      timerRef.current = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log("🔄 OTP screen focused, clearing input");
      setOtp(["", "", "", ""]);
      inputs.current[0]?.focus();
      // Start initial timer when screen is focused
      setTimer(30);
    }, [])
  );

  const handleChange = (text, index) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, '');
    
    const newOtp = [...otp];
    newOtp[index] = numericText;
    setOtp(newOtp);

    if (numericText) {
      // If we entered a value, find the next empty field to focus
      const nextEmptyIndex = newOtp.findIndex((digit, i) => i > index && !digit);
      if (nextEmptyIndex !== -1) {
        inputs.current[nextEmptyIndex]?.focus();
      }
    } else {
      // If we cleared a value, focus on the previous field if it exists
      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace to move to previous input
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current field is empty and backspace is pressed, clear previous field and focus it
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const validateApiResponse = (response) => {
    if (!response || !response.data) {
      throw new Error("Invalid API response structure");
    }
    
    const { success, type, data, message } = response.data;
    
    // Ensure success is a number
    const successCode = typeof success === 'string' ? parseInt(success) : success;
    const typeCode = typeof type === 'string' ? parseInt(type) : type;
    
    return {
      success: successCode,
      type: typeCode,
      data,
      message: message || "Operation completed"
    };
  };

  const createSessionData = (userData, mobile) => {
    if (userData.type==2) {
      return {
      id: userData.id,
      name: userData.name,
      mobile: mobile,
      email: userData.email,
      type: userData.type,
      sec_mobile: userData.branch_mobile,
    };
    } else {
      return {
      id: userData.id,
      name: userData.name,
      mobile: mobile,
      email: userData.email,
      type: userData.type,
      sec_mobile: userData.branch_mobile,
    };
    }

    
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    
    if (enteredOtp.length !== 4) {
      Alert.alert("Invalid OTP", "Please enter the complete 4-digit OTP");
      return;
    }

    setLoading(true);
    
    try {
      console.log("🔄 Verifying OTP:", { mobile, otp: enteredOtp });
      
      const response = await api.get(
        `/Otpverify/verify_otp?mobile=${mobile}&otp=${enteredOtp}`
      );
      
      console.log("✅ OTP API Response:", response.data);

      const { success, type: responseType, data: userData, message } = validateApiResponse(response);

      console.log("📊 Parsed Response:", { success, responseType, message });

      // Handle different success codes
      if (success === 1) {
        // Successful verification - user exists and logged in
        console.log("🏠 User verified successfully, redirecting to Home");
        
        if (!userData) {
          throw new Error("User data is missing from successful response");
        }

        const sessionData = createSessionData(userData, mobile);
        
        console.log("💾 Saving session data:", sessionData);
        await saveSession(sessionData);
        
        Alert.alert(
          "Success", 
          message || "Login successful!",
          [
            {
              text: "OK",
              onPress: () => {
                router.replace({
                  pathname: "/components/Home",
                });
              }
            }
          ]
        );
      } 
      else if (success === 2 || success === 0) {
        console.log("🔄 OTP verified, redirecting to Register");
        
        router.replace({
          pathname: "/components/Register",
          params: {
            mobile: mobile,
            type: responseType.toString(),
            verified: "true", 
          },
        });
      } 
      else {
        // Verification failed
        console.log("❌ Verification failed:", message);
        Alert.alert(
          "Verification Failed", 
          message || "Invalid OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("❌ OTP Verification Error:", error);
      
      let errorMessage = "Something went wrong while verifying OTP";
      
      if (error.response) {
        // API returned an error response
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          errorMessage = "Invalid OTP or mobile number";
        } else if (status === 429) {
          errorMessage = "Too many attempts. Please try again later";
        } else if (data && data.message) {
          errorMessage = data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    console.log("🔁 Resend OTP clicked for mobile:", mobile);
    
    if (resendLoading || timer > 0) return; 
    
    setResendLoading(true);
    
    try {
      const response = await api.get(`/Otp/send_otp?mobile=${mobile}`);
      
      console.log("✅ Resend OTP Response:", response.data);
      
      setOtp(["", "", "", ""]);
      inputs.current[0]?.focus();
      
      // Start the 30-second timer after successful resend
      setTimer(30);
      
      Alert.alert(
        "Success", 
        "OTP has been resent to your mobile number"
      );
    } catch (error) {
      console.error("❌ Resend OTP Error:", error);
      
      let errorMessage = "Failed to resend OTP. Please try again.";
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const clearOtp = () => {
    setOtp(["", "", "", ""]);
    inputs.current[0]?.focus();
  };

  const isResendDisabled = resendLoading || loading || timer > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={agskLogo} style={styles.logo} resizeMode="contain" />

          <Text style={styles.heading}>OTP Verification</Text>
          <Text style={styles.subheading}>
            Please enter the OTP sent to {mobile}
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={[
                  styles.otpBox,
                  digit ? styles.otpBoxFilled : null
                ]}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                editable={!loading}
                selectTextOnFocus
              />
            ))}
          </View>

          <TouchableOpacity 
            style={[
              styles.button, 
              (loading || otp.join("").length !== 4) && styles.buttonDisabled
            ]} 
            onPress={handleVerify}
            disabled={loading || otp.join("").length !== 4}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <TouchableOpacity 
              onPress={handleResend}
              disabled={isResendDisabled}
              style={styles.resendButton}
            >
              <Text style={styles.resendText}>
                Haven't Received OTP?{" "}
                <Text style={[
                  styles.resendHighlight,
                  isResendDisabled && styles.resendDisabled
                ]}>
                  {resendLoading 
                    ? "Sending..." 
                    : timer > 0 
                      ? `Resend in ${timer}s` 
                      : "Resend"
                  }
                </Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={clearOtp}
              disabled={loading}
              style={styles.clearButton}
            >
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}