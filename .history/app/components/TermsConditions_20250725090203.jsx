import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,

  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import styles from './Styles/termsStyles';

const TermsConditions = () => {
  const [termsContent, setTermsContent] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get(
          'https://minsway.co.in/leaf/mb/Content_management/terms_conditions'
        );

        console.log('📃 Terms API Response ====', response.data);

        if (response.data.status === 1) {
          setTermsContent(response.data.content);
        } else {
          Alert.alert('Error', response.data.message || 'Failed to load content');
        }
      } catch (error) {
        console.error('❌ Terms API Error ====', error);
        Alert.alert('Error', 'Failed to load terms and conditions');
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style='' />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/components/Home')} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator size="large" color="#43a047" />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.termsText}>{termsContent}</Text>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TermsConditions;