import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import agskLogo from '../../assets/images/AGSKLogo.png';

export default function CustomDrawerContent(props) {
  const router = useRouter();

  const navItems = [
    { label: 'Home', path: '/Home' },
    { label: 'Enquiry', path: '/components/Enquiry' },
    { label: 'My Order', path: '/components/MyOrder' },
    { label: 'Notification', path: '/components/Notification' },
    { label: 'Terms and Conditions', path: '/components/Terms' },
    { label: 'Help and Support', path: '/components/Help' },
    { label: 'About Us', path: '/components/About' },
    { label: 'Logout', path: '/components/Logout' },
  ];

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
            onPress={() => {
              props.navigation.closeDrawer();
              // router.replace(item.path); // ✅ Navigate and replace current screen
            }}
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

