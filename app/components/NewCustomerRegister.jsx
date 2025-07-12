import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function NewCustomerRegister() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const router = useRouter();

  // Load mobile from AsyncStorage on mount
  useEffect(() => {
    const getStoredMobile = async () => {
      try {
        const storedMobile = await AsyncStorage.getItem('userMobile');
        if (storedMobile) {
          setMobile(storedMobile);
          console.log('Loaded mobile from storage:', storedMobile);
        }
      } catch (error) {
        console.error('Failed to load mobile from AsyncStorage:', error);
      }
    };

    getStoredMobile();
  }, []);

  const handleRegister = async () => {
    if (!name || !mobile || !address) {
      Alert.alert('Missing Fields', 'Please fill all the fields');
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert('Invalid Mobile Number', 'Please enter a valid 10-digit number');
      return;
    }

    try {
      const url = `https://minsway.co.in/leaf/mb/Customer/register_customer?mobile=${mobile}&type=1&name=${encodeURIComponent(
        name
      )}&address=${encodeURIComponent(address)}`;
      console.log('Sending registration to:', url);

      const response = await axios.get(url);
      console.log('API Response:', response.data);

      if (response.data.status === true) {
        const customerData = response.data.data;

        // Save to AsyncStorage
        await AsyncStorage.setItem('customerId', customerData.id);
        await AsyncStorage.setItem('customerName', customerData.name);
        await AsyncStorage.setItem('customerMobile', customerData.mobile);
        await AsyncStorage.setItem('customerAddress', customerData.address);

        Alert.alert('Success', 'Customer Registered Successfully');

        // Navigate to Home with params
        router.push({
          pathname: '/components/Home',
          params: {
            id: customerData.id,
            name: customerData.name,
            mobile: customerData.mobile,
            address: customerData.address,
          },
        });
      } else {
        Alert.alert('Registration Failed', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert('Error', 'Something went wrong while registering the customer');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.innerContainer}
      >
        <View style={styles.formWrapper}>
          <Text style={styles.title}>New Customer Register</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Mobile"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={10}
            value={mobile}
            onChangeText={setMobile}
          />

          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor="#999"
            value={address}
            onChangeText={setAddress}
            multiline
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formWrapper: {
    width: width * 0.9,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#29CB56',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#29CB56',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
    color: '#000',
  },
  button: {
    backgroundColor: '#29CB56',
    paddingVertical: 14,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
  },
});



