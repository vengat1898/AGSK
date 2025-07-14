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
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function NewCustomerRegister() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const storedMobile = await AsyncStorage.getItem('userMobile');
        if (storedMobile) {
          setMobile(storedMobile);
          console.log('📱 Loaded Mobile:', storedMobile);
        }
      } catch (error) {
        console.error('❌ Failed to load user data from AsyncStorage:', error);
      }
    };

    loadUserDetails();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to fetch address.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync(location.coords);

      if (place) {
        const fullAddress = `${place.name || ''}, ${place.street || ''}, ${place.city || ''}, ${place.region || ''}, ${place.postalCode || ''}, ${place.country || ''}`;
        setAddress(fullAddress.trim());
      } else {
        Alert.alert('Error', 'Unable to fetch address from location');
      }
    } catch (error) {
      console.error('❌ Location Error:', error);
      Alert.alert('Error', 'Failed to get current location');
    }
  };

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
      const url = `https://minsway.co.in/leaf/mb/Customer/register_customer?mobile=${mobile}&type=1&name=${encodeURIComponent(name)}&address=${encodeURIComponent(address)}`;
      console.log('📡 Registering via URL:', url);

      const response = await axios.get(url);
      const { status, message, data, customer_id } = response.data;

      console.log('📝 Message:', message);
      console.log('✅ Status:', status);
      console.log('📦 Data:', data);

      if (status === 1 && data) {
        await AsyncStorage.setItem('customerId', data.id);
        await AsyncStorage.setItem('customerName', data.name);
        await AsyncStorage.setItem('customerMobile', data.mobile);
        await AsyncStorage.setItem('customerAddress', data.address);
        await AsyncStorage.setItem('mobile', data.mobile);
        await AsyncStorage.setItem('type', '1');

        Alert.alert('Success', 'Customer Registered Successfully');

        router.push({
          pathname: '/components/Home',
          params: {
            id: data.id,
            mobile: data.mobile,
            address: data.address,
            name: data.name,
            user_id: data.user_id,
            customer_id: customer_id,
          },
        });
      } else {
        Alert.alert('Registration Failed', `Reason: ${message || 'Unknown'}, Status: ${status}`);
      }
    } catch (error) {
      console.error('❌ Registration Error:', error);
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
            style={[styles.input, { backgroundColor: '#f0f0f0' }]}
            placeholder="Mobile"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
            maxLength={10}
            value={mobile}
            editable={false}
          />

          {/* Styled Address Input with Location Icon */}
          <View style={styles.addressContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Address"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
              multiline
            />
            <TouchableOpacity onPress={getCurrentLocation} style={styles.iconButton}>
              <Ionicons name="location-outline" size={22} color="#29CB56" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  innerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  formWrapper: { width: width * 0.9, alignItems: 'center' },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#29CB56',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 0.3,
    borderColor: '#29CB56',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addressContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#E6F6EC',
    borderRadius: 5,
    
  },
  button: {
    backgroundColor: '#29CB56',
    paddingVertical: 14,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});








