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
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function CateringRegister() {
  const [hotelName, setHotelName] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const router = useRouter();

  // Fetch mobile from AsyncStorage
  useEffect(() => {
    const getStoredMobile = async () => {
      try {
        const storedMobile = await AsyncStorage.getItem('userMobile');
        if (storedMobile) {
          setMobile(storedMobile);
          console.log('Loaded mobile from AsyncStorage:', storedMobile);
        }
      } catch (error) {
        console.error('Error loading mobile:', error);
      }
    };

    getStoredMobile();
  }, []);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please allow media access to upload image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!name || !mobile || !address || !hotelName) {
      Alert.alert('Missing Fields', 'Please fill all the fields');
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert('Invalid Mobile Number', 'Please enter a valid 10-digit number');
      return;
    }

    try {
      const url = `https://minsway.co.in/leaf/mb/Customer/register_customer?mobile=${mobile}&type=3&name=${encodeURIComponent(name)}&address=${encodeURIComponent(address)}`;

      console.log('Registering Catering Service:', url);

      const response = await axios.get(url);
      console.log('API Response:', response.data);

      if (response.data.status === true) {
        const customerData = response.data.data;

        await AsyncStorage.setItem('customerId', customerData.id);
        await AsyncStorage.setItem('customerName', customerData.name);
        await AsyncStorage.setItem('customerMobile', customerData.mobile);
        await AsyncStorage.setItem('customerAddress', customerData.address);

        Alert.alert('Success', 'Catering Service Registered Successfully');

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
      Alert.alert('Error', 'Something went wrong during registration');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.innerContainer}
      >
        <View style={styles.formWrapper}>
          <Text style={styles.title}>Catering Register Services</Text>

          <TextInput
            style={styles.input}
            placeholder="Hotel Name"
            placeholderTextColor="#999"
            value={hotelName}
            onChangeText={setHotelName}
          />

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

          <TouchableOpacity style={styles.uploadBox} onPress={handleImagePick}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <>
                <Text style={styles.uploadText}>Upload image</Text>
                <Feather name="upload" size={20} color="#888" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  innerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  formWrapper: { width: width * 0.9, alignItems: 'center' },
  title: {
    fontSize: 24,
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
  uploadBox: {
    width: '100%',
    height: 50,
    borderWidth: 0.3,
    borderColor: '#29CB56',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  uploadText: {
    color: '#999',
    fontSize: 14,
    marginRight: 6,
  },
  previewImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 20,
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
