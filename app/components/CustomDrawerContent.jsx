import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
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

  const navItems = [
    { label: 'Home', path: '/Home' },
    { label: 'Enquiry', path: '/components/Enquiry' },
    { label: 'My Order', path: '/components/MyOrder' },
    { label: 'Notification', path: '/components/Notification' },
    { label: 'Terms and Conditions', path: '/components/Terms' },
    { label: 'Help and Support', path: '/components/Help' },
    { label: 'About Us', path: '/components/About' },
    { label: 'Logout', path: 'logout' }, // special logout handler
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
    const storedMobile = await AsyncStorage.getItem('customerMobile');

    if (!storedMobile) {
      Alert.alert('Error', 'Mobile number not found in storage. Please login again.');
      return;
    }

    const response = await axios.post(
      'https://minsway.co.in/leaf/mb/Otpverify/logout',
      { mobile: storedMobile }
    );

    if (response.data.success) {
      await AsyncStorage.clear();
      Alert.alert('Success', 'Logged out successfully');
      router.replace('/components/Login');
    } else {
      Alert.alert('Error', response.data.message || 'Logout failed');
    }
  } catch (error) {
    console.error('Logout error:', error);
    Alert.alert('Error', 'Something went wrong during logout');
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



