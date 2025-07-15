import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './Styles/cartStyles';
import fallbackImg from '../../assets/images/bananaleafOne.png';

export default function Cart() {
  const router = useRouter();
  const { mobile: paramMobile } = useLocalSearchParams();

  const [cartItems, setCartItems] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [deliveryDateTime, setDeliveryDateTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState({});
  const [mobile, setMobile] = useState('');

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setDeliveryDateTime(date.toLocaleString());
    hideDatePicker();
  };

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const storedMobile = await AsyncStorage.getItem('customerMobile');
      const usedMobile = paramMobile || storedMobile;

      setMobile(usedMobile);
      console.log('📥 Mobile used in Cart:', usedMobile);

      if (!usedMobile) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }

      const response = await axios.get(
        'https://minsway.co.in/leaf/mb/Checkout/checkout',
        { params: { mobile: usedMobile } }
      );

      console.log('📦 Checkout API Response:', response.data);

      if (response.data.success === 1) {
        setCartItems(response.data.data);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to fetch cart.');
      }
    } catch (error) {
      console.error('❌ Fetch Cart Error:', error);
      Alert.alert('Error', 'Something went wrong while fetching cart.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const removeItem = (order_id) => {
    setCartItems((prev) => prev.filter((item) => item.order_id !== order_id));
  };

  const proceedToCheckout = async () => {
    try {
      const storedMobile = await AsyncStorage.getItem('customerMobile');
      const usedMobile = mobile || storedMobile;

      if (!usedMobile || cartItems.length === 0) {
        Alert.alert('Error', 'No items or mobile number found');
        return;
      }

      if (!deliveryDateTime) {
        Alert.alert('Select Delivery Date', 'Please choose delivery date and time');
        return;
      }

      const confirmOrderIds = cartItems.map((item) => item.order_id);
      const deleteOrderIds = [];

      const params = {
        mobile: usedMobile,
        delete_order: JSON.stringify(deleteOrderIds),
        conform_order: JSON.stringify(confirmOrderIds),
        order_date: deliveryDateTime,
      };

      console.log('🛒 Proceeding with Checkout Params:', params);

      const response = await axios.get(
        'https://minsway.co.in/leaf/mb/Checkoutpay/checkoutpay',
        { params }
      );

      console.log('✅ CheckoutPay API Raw Response:', response);
      console.log('✅ CheckoutPay API Response Data:', response.data);

      if (response.data.success === 1) {
        Alert.alert('Success', response.data.message || 'Checkout successful');
        router.push('/components/Checkout');
      } else {
        Alert.alert('Failed', response.data.message || 'Checkout failed');
      }
    } catch (error) {
      console.error('❌ Checkout API Error:', error);
      Alert.alert('Error', 'Something went wrong during checkout.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={imageError[item.order_id] ? fallbackImg : { uri: item.image }}
        style={styles.productImage}
        resizeMode="cover"
        onError={() =>
          setImageError((prev) => ({ ...prev, [item.order_id]: true }))
        }
      />
      <View style={styles.cardDetails}>
        <Text style={styles.orderStatus}>Selected Orders</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productQuantity}>
          {`${item.count} leaf (${item.size}) - ₹${item.price}`}
        </Text>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.order_id)}>
        <Feather name="trash-2" size={20} color="#444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CART</Text>
        </View>
      </SafeAreaView>

      {/* Loading State */}
      {loading ? (
        <ActivityIndicator size="large" color="green" style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* Cart Items */}
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.order_id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 30 }}>
                No items in cart.
              </Text>
            }
          />

          {/* DateTime Picker */}
          <TouchableOpacity style={styles.dateTimeSelector} onPress={showDatePicker}>
            <View style={styles.dateTimeWrapper}>
              <Ionicons name="calendar-outline" size={20} color="#333" />
              <Text style={styles.dateTimeText}>
                {deliveryDateTime || 'Choose delivery date and time'}
              </Text>
              <AntDesign name="down" size={14} color="green" style={{ marginLeft: 'auto' }} />
            </View>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            minimumDate={new Date()}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          {/* Checkout Button */}
          <SafeAreaView style={styles.footerSafeArea}>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={proceedToCheckout}
            >
              <Text style={styles.checkoutText}>Proceed To Checkout</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </>
      )}
    </SafeAreaView>
  );
}








