import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import agskLogo from '../../assets/images/AGSKLogo.png';

export default function CustomDrawerContent(props) {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [type, setType] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [loggingOut, setLoggingOut] = useState(false); // for loading state

  const navItems = [
    { label: 'Home', path: '/Home' },
    { label: 'Enquiry', path: '/components/Enquiry' },
    { label: 'My Order', path: '/components/MyOrder' },
    { label: 'Notification', path: '/components/Notification' },
    { label: 'Terms and Conditions', path: '/components/Terms' },
    { label: 'Help and Support', path: '/components/Help' },
    { label: 'About Us', path: '/components/About' },
    { label: 'Logout', path: 'logout' },
  ];

  useEffect(() => {
    const getUserData = async () => {
      try {
        const m = await AsyncStorage.getItem('customerMobile');
        const t = await AsyncStorage.getItem('type');
        const id = await AsyncStorage.getItem('customerId');

        setMobile(m || '');
        setType(t || '');
        setCustomerId(id || '');

        console.log('========== 📦 Drawer Param Load ==========');
        console.log('Mobile:', m);
        console.log('Type:', t);
        console.log('Customer ID:', id);
        console.log('==========================================');
      } catch (e) {
        console.error('Error reading user data:', e);
      }
    };

    getUserData();
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true); // show loader
      const storedMobile = await AsyncStorage.getItem('customerMobile');

      if (!storedMobile) {
        Alert.alert('Error', 'Mobile number not found. Please login again.');
        return;
      }

      console.log('📤 Sending logout API request for:', storedMobile);

      const response = await axios.post(
        'https://minsway.co.in/leaf/mb/Otpverify/logout',
        { mobile: storedMobile },
        { timeout: 10000 } // 10s timeout
      );

      console.log('✅ Logout API Response:', response.data);

      // Clear storage anyway
      await AsyncStorage.clear();

      if (response.data.success) {
        Alert.alert('Success', 'Logged out successfully');
      } else {
        Alert.alert('Notice', 'Server logout failed, but local logout completed.');
      }

      router.replace('/components/Login'); // Go to index screen (Login or Landing)
    } catch (error) {
      console.error('❌ Logout error:', error.message || error);

      await AsyncStorage.clear(); // still clear storage
      Alert.alert('Error', 'Something went wrong. Logging out locally.');
      router.replace('/components/Login');
    } finally {
      setLoggingOut(false); // hide loader
    }
  };

  const handleNavigation = (item) => {
    props.navigation.closeDrawer();

    if (item.path === 'logout') {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', onPress: handleLogout },
        ],
        { cancelable: true }
      );
    } else {
      console.log('========== 📲 Menu Navigation ==========');
      console.log('Navigating to:', item.path);
      console.log('With params:', { mobile, type, id: customerId });
      console.log('=========================================');

      router.push({
        pathname: item.path,
        params: {
          mobile,
          type,
          id: customerId,
        },
      });
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={agskLogo} style={styles.logoImage} resizeMode="contain" />
      </View>

      {loggingOut ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#28a745" />
          <Text style={{ marginTop: 10 }}>Logging out</Text>
        </View>
      ) : (
        <View style={styles.menuList}>
          {navItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleNavigation(item)}
            >
              <Text style={styles.menuText}>{item.label}</Text>
              <Text style={styles.arrow}>{'>'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  logoImage: {
    width: 140,
    height: 140,
  },
  loaderContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuList: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 18,
    color: '#666',
  },
});




