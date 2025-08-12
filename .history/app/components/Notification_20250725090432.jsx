import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './Styles/notificationStyles';
import sa
const Notification = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/components/Home')} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.infoText}>🔔 Notification functionality coming soon.</Text>
      </View>
    </SafeAreaView>
  );
};

export default Notification;