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
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function Cart() {
  const router = useRouter();
  const { mobile: paramMobile, id: paramId, type: paramType } = useLocalSearchParams();

  const [cartItems, setCartItems] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [deliveryDateTime, setDeliveryDateTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState({});
  const [mobile, setMobile] = useState('');
  const [id, setId] = useState('');
  const [type, setType] = useState('');

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    const formattedDate = date.toLocaleString();
    setDeliveryDateTime(formattedDate);
    hideDatePicker();
  };

  // const fetchCartData = async () => {
  //   try {
  //     setLoading(true);

  //     const storedMobile = await AsyncStorage.getItem('customerMobile');
  //     const storedId = await AsyncStorage.getItem('customerId');
  //     const storedType = await AsyncStorage.getItem('type');

  //     const usedMobile = paramMobile || storedMobile;
  //     const usedId = paramId || storedId;
  //     const usedType = paramType || storedType;

  //     if (!usedMobile || !usedId) {
  //       Alert.alert('Error', 'User info missing. Please login again.');
  //       return;
  //     }

  //     setMobile(usedMobile);
  //     setId(usedId);
  //     setType(usedType);

  //     console.log('\n=================== 📥 Fetching Cart Data ===================');
  //     console.log('Used Mobile:', usedMobile);
  //     console.log('Used ID:', usedId);
  //     console.log('Used Type:', usedType);
  //     console.log('==============================================================\n');

  //     const response = await axios.get('https://minsway.co.in/leaf/mb/Checkout/checkout', {
  //       params: {
  //         mobile: usedMobile,
  //         id: usedId,
  //       },
  //     });

  //     console.log('\n=================== 📦 Cart API Response ===================');
  //     console.log(JSON.stringify(response.data, null, 2));
  //     console.log('=============================================================\n');

  //     if (response.data.success === 1 && Array.isArray(response.data.data)) {
  //       setCartItems(response.data.data);
  //     } else {
  //       setCartItems([]);
  //       Alert.alert('No Items', response.data.message || 'Your cart is empty.');
  //     }
  //   } catch (error) {
  //     console.error('❌ Fetch Cart Error:', error);
  //     Alert.alert('Error', 'Something went wrong while fetching cart.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchCartData();
  // }, []);


  const fetchCartData = async () => {
  try {
    setLoading(true);

    // Always get fresh values from AsyncStorage, ignore route params for security
    const storedMobile = await AsyncStorage.getItem('customerMobile');
    const storedId = await AsyncStorage.getItem('customerId');
    const storedType = await AsyncStorage.getItem('type');

    if (!storedMobile || !storedId) {
      Alert.alert('Error', 'Please login again');
      router.replace('/components/Login');
      return;
    }

    setMobile(storedMobile);
    setId(storedId);
    setType(storedType);

    console.log('Fetching cart for:', storedMobile, storedId);

    const response = await axios.get('https://minsway.co.in/leaf/mb/Checkout/checkout', {
      params: {
        mobile: storedMobile,
        id: storedId,
      },
    });

    if (response.data.success === 1 && Array.isArray(response.data.data)) {
      setCartItems(response.data.data);
    } else {
      setCartItems([]);
    }
  } catch (error) {
    console.error('Fetch Cart Error:', error);
    Alert.alert('Error', 'Failed to fetch cart');
  } finally {
    setLoading(false);
  }
};

  useFocusEffect(
  useCallback(() => {
    fetchCartData();
  }, [])
);

  // const deleteCartItem = async (orderId) => {
  //   try {
  //     if (!mobile) {
  //       Alert.alert('Error', 'Mobile number not found.');
  //       return;
  //     }

  //     const response = await axios.get('https://minsway.co.in/leaf/mb/Delete/delete', {
  //       params: {
  //         mobile: mobile,
  //         delete: orderId,
  //       },
  //     });

  //     console.log('\n=================== 🗑️ Delete API Response ===================');
  //     console.log(JSON.stringify(response.data, null, 2));
  //     console.log('=================================================================\n');

  //     if (response.data.success === 1) {
  //       Alert.alert('Success', response.data.message);
  //       fetchCartData();
  //     } else {
  //       Alert.alert('Error', response.data.message || 'Failed to delete item.');
  //     }
  //   } catch (error) {
  //     console.error('❌ Delete API Error:', error);
  //     Alert.alert('Error', 'Something went wrong while deleting item.');
  //   }
  // };


  const deleteCartItem = async (orderId) => {
  try {
    const currentMobile = await AsyncStorage.getItem('customerMobile');
    if (!currentMobile || currentMobile !== mobile) {
      Alert.alert('Session Expired', 'Please login again');
      router.replace('/components/Login');
      return;
    }

    const response = await axios.get('https://minsway.co.in/leaf/mb/Delete/delete', {
      params: {
        mobile: currentMobile,
        delete: orderId,
      },
    });

    if (response.data.success === 1) {
      fetchCartData(); // Refresh cart data
    } else {
      Alert.alert('Error', response.data.message);
    }
  } catch (error) {
    console.error('Delete Error:', error);
    Alert.alert('Error', 'Failed to delete item');
  }
};

  const removeItem = (item) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove ${item.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => deleteCartItem(item.order_id) },
      ]
    );
  };

const proceedToCheckout = async () => {
  try {
    if (!mobile || !id) {
      Alert.alert('Error', 'User information missing');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Error', 'No items in cart');
      return;
    }

    if (!deliveryDateTime) {
      Alert.alert('Select Delivery Date', 'Please choose delivery date and time');
      return;
    }

    const confirmOrderIds = cartItems.map((item) => item.order_id);

    const firstItem = cartItems[0] || {};
    const product_id = firstItem.product_id || '';
    const product_detaild_id = firstItem.product_detaild_id || '';
    const count = firstItem.count || '';

    // 🧠 Save to AsyncStorage
    await AsyncStorage.setItem('product_id', product_id.toString());
    await AsyncStorage.setItem('product_detail_id', product_detaild_id.toString());
    await AsyncStorage.setItem('user_id', id.toString());

    // 🚨 Debugging: Log retrieved values
    console.log('\n=================== 🔍 Retrieved Product IDs ===================');
    console.log('product_id:', product_id);
    console.log('product_detaild_id:', product_detaild_id);
    console.log('user_id:', id);
    console.log('===============================================================\n');

    const params = {
      mobile: mobile,
      id: id,
      delete_order: JSON.stringify([]),
      conform_order: JSON.stringify(confirmOrderIds),
      order_date: deliveryDateTime,
    };

    console.log('\n=================== 🚀 Checkout Params ===================');
    console.log(JSON.stringify(params, null, 2));
    console.log('===========================================================\n');

    const response = await axios.get(
      'https://minsway.co.in/leaf/mb/Checkoutpay/checkoutpay',
      { params }
    );

    console.log('\n=================== ✅ Checkout API Response ===================');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('================================================================\n');

    if (response.data.success === 1) {
      Alert.alert('Success', response.data.message || 'Checkout successful', [
        {
          text: 'OK',
          onPress: () =>
            router.push({
              pathname: '/components/Checkout',
              params: {
                deliveryDateTime: deliveryDateTime,
                mobile: mobile,
                type: type,
                id: id,
                product_id,
                product_detaild_id,
                count,
              },
            }),
        },
      ]);
    } else {
      Alert.alert('Failed', response.data.message || 'Checkout failed');
    }
  } catch (error) {
    console.error('❌ Checkout API Error:', error);
    Alert.alert('Error', 'Something went wrong during checkout.');
  }
};


// const proceedToCheckout = async () => {
//   try {
//     if (!mobile || !id) {
//       Alert.alert('Error', 'User information missing');
//       return;
//     }

//     if (cartItems.length === 0) {
//       Alert.alert('Error', 'No items in cart');
//       return;
//     }

//     if (!deliveryDateTime) {
//       Alert.alert('Select Delivery Date', 'Please choose delivery date and time');
//       return;
//     }

//     const confirmOrderIds = cartItems.map((item) => item.order_id);

//     const firstItem = cartItems[0] || {};
//     const product_id = firstItem.product_id || '';
//     const product_detaild_id = firstItem.product_detaild_id || '';
//     const count = firstItem.count || '';

//     // 🧠 Save to AsyncStorage
//     await AsyncStorage.setItem('product_id', product_id.toString());
//     await AsyncStorage.setItem('product_detail_id', product_detaild_id.toString());
//     await AsyncStorage.setItem('user_id', id.toString());

//     const params = {
//       mobile: mobile,
//       id: id,
//       delete_order: JSON.stringify([]),
//       conform_order: JSON.stringify(confirmOrderIds),
//       order_date: deliveryDateTime,
//     };

//     console.log('\n=================== 🚀 Checkout Params ===================');
//     console.log(JSON.stringify(params, null, 2));
//     console.log('product_id:', product_id);
//     console.log('product_detail_id:', product_detaild_id);
//     console.log('user_id:', id);
//     console.log('===========================================================\n');

//     const response = await axios.get(
//       'https://minsway.co.in/leaf/mb/Checkoutpay/checkoutpay',
//       { params }
//     );

//     console.log('\n=================== ✅ Checkout API Response ===================');
//     console.log(JSON.stringify(response.data, null, 2));
//     console.log('================================================================\n');

//     if (response.data.success === 1) {
//       Alert.alert('Success', response.data.message || 'Checkout successful', [
//         {
//           text: 'OK',
//           onPress: () =>
//             router.push({
//               pathname: '/components/Checkout',
//               params: {
//                 deliveryDateTime: deliveryDateTime,
//                 mobile: mobile,
//                 type: type,
//                 id: id,
//                 product_id,
//                 product_detaild_id,
//                 count,
//               },
//             }),
//         },
//       ]);
//     } else {
//       Alert.alert('Failed', response.data.message || 'Checkout failed');
//     }
//   } catch (error) {
//     console.error('❌ Checkout API Error:', error);
//     Alert.alert('Error', 'Something went wrong during checkout.');
//   }
// };


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
      <TouchableOpacity onPress={() => removeItem(item)}>
        <Feather name="trash-2" size={20} color="#444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/components/Home')}>
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CART</Text>
        </View>
      </SafeAreaView>

      {loading ? (
        <ActivityIndicator size="large" color="green" style={{ marginTop: 40 }} />
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.order_id?.toString() || Math.random().toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 30 }}>
                No items in cart.
              </Text>
            }
          />

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

          <SafeAreaView style={styles.footerSafeArea}>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={proceedToCheckout}
              disabled={cartItems.length === 0}
            >
              <Text style={styles.checkoutText}>Proceed To Checkout</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </>
      )}
    </SafeAreaView>
  );
}
