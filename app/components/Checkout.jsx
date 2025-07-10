import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './Styles/checkoutStyles';

export default function Checkout() {
  const router = useRouter();

  const handleProceed = () => {
    Alert.alert(
      'Please Wait',
      'Payment screenshot verification in process. conformation in 12 hours.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* SafeArea Header */}
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>
      </SafeAreaView>

      {/* Scrollable Body */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Use Current Location */}
        <TouchableOpacity style={styles.locationBox}>
          <Text style={styles.useLocationText}>Use Current Location</Text>
        </TouchableOpacity>

        {/* Invoice Section */}
        <Text style={styles.sectionTitle}>Invoice</Text>
        <View style={styles.invoiceBox}>
          <View style={styles.row}>
            <Text style={styles.label}>Original Price</Text>
            <Text style={styles.value}>₹500</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Delivery</Text>
            <Text style={styles.positive}>+40</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>GST</Text>
            <Text style={styles.positive}>+18</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Discount</Text>
            <Text style={styles.value}>₹20</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹538</Text>
          </View>
        </View>

        {/* Shipping Details */}
        <Text style={styles.sectionTitle}>Shipping Details</Text>
        <View style={styles.shippingBox}>
          <View style={styles.shippingHeader}>
            <Text style={styles.shippingName}>Mr vengat</Text>
            <Text style={styles.shippingType}>Home</Text>
          </View>
          <View style={styles.rowIcon}>
            <Ionicons name="location-outline" size={18} color="#555" />
            <Text style={styles.shippingText}>
              70 Washington Square South, Pallavaram, NY 10012, Chennai
            </Text>
          </View>
          <View style={styles.rowIcon}>
            <Feather name="phone" size={18} color="#555" />
            <Text style={styles.shippingText}>+91 12345 67890</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Buttons */}
        <View style={styles.paymentRow}>
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => router.push('/components/PayOnline')}
          >
            <Text style={styles.payText}>Pay Online</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payText}>Cash On Delivery</Text>
          </TouchableOpacity>
        </View>

        {/* Delivery Instructions */}
        <TouchableOpacity>
          <Text style={styles.instructionsText}>Add Delivery Instructions</Text>
        </TouchableOpacity>

        {/* Proceed Button */}
        <TouchableOpacity style={styles.checkoutButton} onPress={handleProceed}>
          <Text style={styles.checkoutText}>Proceed</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}



