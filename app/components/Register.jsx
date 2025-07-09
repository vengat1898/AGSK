import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';
import styles from './Styles/registerStyles';

// Images
import login1 from '../../assets/images/login1.jpeg'; // Banana leaf banner
import agskLogo from '../../assets/images/AGSKLogo.png'; // AGSK logo

export default function Register() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Banner */}
        <Image source={login1} style={styles.bannerImage} />

        {/* Logo & Title */}
        <View style={styles.logoSection}>
          <Image source={agskLogo} style={styles.logo} resizeMode="contain" />

        </View>

        {/* Buttons */}
        <TouchableOpacity style={styles.button} onPress={() => router.push('/components/NewCustomerRegister')}>
          <FontAwesome5 name="users" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>New Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/components/HotelSupplyRegister')}>
          <MaterialIcons name="location-city" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Hotel Supply</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/components/CateringRegister')}>
          <Entypo name="bowl" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Catering service</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
