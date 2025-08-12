import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { SessionContext } from '@/context/SessionContext';
import styles from './Styles/helpSupportStyles';

const HelpSupport = () => {
  const router = useRouter();
  const { getUserMobile } = useContext(SessionContext);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mobile, setMobile] = useState(null);
  const [mobileLoading, setMobileLoading] = useState(true);

  // Fetch mobile number when component mounts
  React.useEffect(() => {
    const fetchMobile = async () => {
      try {
        const userMobile = await getUserMobile();
        if (userMobile) {
          setMobile(userMobile);
        } else {
          Alert.alert(
            'Session Expired',
            'Please login again to access support',
            [
              {
                text: 'OK',
                onPress: () => router.replace('/components/Login'),
              },
            ]
          );
        }
      } catch (error) {
        console.error('Error fetching mobile:', error);
        Alert.alert('Error', 'Failed to load user information');
      } finally {
        setMobileLoading(false);
      }
    };

    fetchMobile();
  }, [getUserMobile]);

  const handleSend = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your message');
      return;
    }

    if (!mobile) {
      Alert.alert('Error', 'Mobile number is required');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.get(
        'https://minsway.co.in/leaf/mb/Support/support',
        {
          params: {
            mobile,
            message: message.trim(),
          },
        }
      );

      if (response.data.success === 1) {
        Alert.alert('Success', response.data.message || 'Your message has been sent successfully!');
        setMessage('');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to send support request');
      }
    } catch (error) {
      console.error('Support request error:', error);
      let errorMessage = 'Failed to send support request';
      
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Network error - please check your connection';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (mobileLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={styles.loadingText}>Loading your information...</Text>
      </SafeAreaView>
    );
  }

  if (!mobile) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="warning" size={48} color="#dc3545" />
        <Text style={styles.errorText}>No mobile number found</Text>
        <Text style={styles.errorSubtext}>Please login again to continue</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.replace('/components/Login')}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.replace('/components/Home')} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      {/* Form */}
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Need Help?</Text>
        <Text style={styles.description}>
          We're here to assist you. Please describe your issue below.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Your Mobile Number</Text>
          <View style={styles.mobileContainer}>
            <Text style={styles.mobileText}>{mobile}</Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Your Message *</Text>
          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Describe your issue in detail..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={5}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSend}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Send Message</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HelpSupport;