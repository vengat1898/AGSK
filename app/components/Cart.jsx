// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   SafeAreaView,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import styles from './Styles/cartStyles';
// import fallbackImg from '../../assets/images/bananaleafOne.png';

// export default function Cart() {
//   const router = useRouter();
//   const { mobile: paramMobile, id: paramId } = useLocalSearchParams();

//   const [cartItems, setCartItems] = useState([]);
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const [deliveryDateTime, setDeliveryDateTime] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [imageError, setImageError] = useState({});
//   const [mobile, setMobile] = useState('');
//   const [id, setId] = useState('');

//   const showDatePicker = () => setDatePickerVisibility(true);
//   const hideDatePicker = () => setDatePickerVisibility(false);

//   const handleConfirm = (date) => {
//     const formattedDate = date.toLocaleString();
//     setDeliveryDateTime(formattedDate);
//     hideDatePicker();
//   };

//   const fetchCartData = async () => {
//     try {
//       setLoading(true);
//       const storedMobile = await AsyncStorage.getItem('customerMobile');
//       const storedId = await AsyncStorage.getItem('customerId');
//       const usedMobile = paramMobile || storedMobile;
//       const usedId = paramId || storedId;

//       setMobile(usedMobile);
//       setId(usedId);

//       console.log('📥 Mobile used in Cart:', usedMobile);
//       console.log('🆔 ID used in Cart:', usedId);

//       if (!usedMobile) {
//         Alert.alert('Error', 'User not logged in.');
//         return;
//       }

//       const response = await axios.get(
//         'https://minsway.co.in/leaf/mb/Checkout/checkout',
//         {
//           params: {
//             mobile: usedMobile,
//             id: usedId,
//           },
//         }
//       );

//       console.log('📦 Checkout API Response:', response.data);

//       if (response.data.success === 1) {
//         setCartItems(response.data.data);
//       } else {
//         Alert.alert('Error', response.data.message || 'Failed to fetch cart.');
//       }
//     } catch (error) {
//       console.error('❌ Fetch Cart Error:', error);
//       Alert.alert('Error', 'Something went wrong while fetching cart.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCartData();
//   }, []);

//   const deleteCartItem = async (mobile, orderId) => {
//     try {
//       const response = await axios.get('https://minsway.co.in/leaf/mb/Delete/delete', {
//         params: {
//           mobile: mobile,
//           delete: orderId,
//         },
//       });

//       console.log('🗑️ Delete API Response:', response.data);

//       if (response.data.success === 1) {
//         Alert.alert('Success', response.data.message);
//         fetchCartData(); // Refresh cart after delete
//       } else {
//         Alert.alert('Error', response.data.message || 'Failed to delete item.');
//       }
//     } catch (error) {
//       console.error('❌ Delete API Error:', error);
//       Alert.alert('Error', 'Something went wrong while deleting item.');
//     }
//   };

//   const removeItem = async (item) => {
//     if (!mobile) {
//       Alert.alert('Error', 'Mobile number not found.');
//       return;
//     }

//     console.log('🗑️ Deleting Product - ID:', item.order_id, '| Name:', item.name);

//     await deleteCartItem(mobile, item.order_id);
//   };

//   const proceedToCheckout = async () => {
//     try {
//       const storedMobile = await AsyncStorage.getItem('customerMobile');
//       const storedId = await AsyncStorage.getItem('customerId');
//       const usedMobile = mobile || storedMobile;
//       const usedId = id || paramId || storedId;

//       if (!usedMobile || cartItems.length === 0) {
//         Alert.alert('Error', 'No items or mobile number found');
//         return;
//       }

//       if (!deliveryDateTime) {
//         Alert.alert('Select Delivery Date', 'Please choose delivery date and time');
//         return;
//       }

//       const confirmOrderIds = cartItems.map((item) => item.order_id);
//       const deleteOrderIds = [];

//       const params = {
//         mobile: usedMobile,
//         id: usedId,
//         delete_order: JSON.stringify(deleteOrderIds),
//         conform_order: JSON.stringify(confirmOrderIds),
//         order_date: deliveryDateTime,
//       };

//       console.log('📅 Delivery DateTime:', deliveryDateTime);
//       console.log('📲 Mobile:', usedMobile);
//       console.log('🆔 ID:', usedId);
//       console.log('🛒 Proceeding with Checkout Params:', params);

//       const response = await axios.get(
//         'https://minsway.co.in/leaf/mb/Checkoutpay/checkoutpay',
//         { params }
//       );

//       console.log('✅ CheckoutPay API Raw Response:', response);
//       console.log('✅ CheckoutPay API Response Data:', response.data);

//       if (response.data.success === 1) {
//   Alert.alert(
//     'Success',
//     response.data.message || 'Checkout successful',
//     [
//       {
//         text: 'OK',
//         onPress: () => router.push({
//           pathname: '/components/Checkout',
//           params: {
//             deliveryDateTime: deliveryDateTime, // ✅ pass param here
//           },
//         }),
//       },
//     ]
//   );
// }
//  else {
//         Alert.alert('Failed', response.data.message || 'Checkout failed');
//       }
//     } catch (error) {
//       console.error('❌ Checkout API Error:', error);
//       Alert.alert('Error', 'Something went wrong during checkout.');
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Image
//         source={imageError[item.order_id] ? fallbackImg : { uri: item.image }}
//         style={styles.productImage}
//         resizeMode="cover"
//         onError={() =>
//           setImageError((prev) => ({ ...prev, [item.order_id]: true }))
//         }
//       />
//       <View style={styles.cardDetails}>
//         <Text style={styles.orderStatus}>Selected Orders</Text>
//         <Text style={styles.productName}>{item.name}</Text>
//         <Text style={styles.productQuantity}>
//           {`${item.count} leaf (${item.size}) - ₹${item.price}`}
//         </Text>
//       </View>
//       <TouchableOpacity onPress={() => removeItem(item)}>
//         <Feather name="trash-2" size={20} color="#444" />
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <SafeAreaView style={styles.headerSafeArea}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => router.replace('/components/Home')}>
//             <Ionicons name="arrow-back" size={22} color="#000" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>CART</Text>
//         </View>
//       </SafeAreaView>

//       {/* Loading */}
//       {loading ? (
//         <ActivityIndicator size="large" color="green" style={{ marginTop: 40 }} />
//       ) : (
//         <>
//           {/* Cart Items */}
//           <FlatList
//             data={cartItems}
//             keyExtractor={(item) => item.order_id}
//             renderItem={renderItem}
//             contentContainerStyle={{ paddingBottom: 20 }}
//             ListEmptyComponent={
//               <Text style={{ textAlign: 'center', marginTop: 30 }}>
//                 No items in cart.
//               </Text>
//             }
//           />

//           {/* DateTime Picker */}
//           <TouchableOpacity style={styles.dateTimeSelector} onPress={showDatePicker}>
//             <View style={styles.dateTimeWrapper}>
//               <Ionicons name="calendar-outline" size={20} color="#333" />
//               <Text style={styles.dateTimeText}>
//                 {deliveryDateTime || 'Choose delivery date and time'}
//               </Text>
//               <AntDesign name="down" size={14} color="green" style={{ marginLeft: 'auto' }} />
//             </View>
//           </TouchableOpacity>

//           <DateTimePickerModal
//             isVisible={isDatePickerVisible}
//             mode="datetime"
//             minimumDate={new Date()}
//             onConfirm={handleConfirm}
//             onCancel={hideDatePicker}
//           />

//           {/* Checkout Button */}
//           <SafeAreaView style={styles.footerSafeArea}>
//             <TouchableOpacity
//               style={styles.checkoutButton}
//               onPress={proceedToCheckout}
//             >
//               <Text style={styles.checkoutText}>Proceed To Checkout</Text>
//             </TouchableOpacity>
//           </SafeAreaView>
//         </>
//       )}
//     </SafeAreaView>
//   );
// }

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

  const fetchCartData = async () => {
    try {
      setLoading(true);

      const storedMobile = await AsyncStorage.getItem('customerMobile');
      const storedId = await AsyncStorage.getItem('customerId');
      const storedType = await AsyncStorage.getItem('type');

      const usedMobile = paramMobile || storedMobile;
      const usedId = paramId || storedId;
      const usedType = paramType || storedType;

      if (!usedMobile || !usedId) {
        Alert.alert('Error', 'User info missing. Please login again.');
        return;
      }

      setMobile(usedMobile);
      setId(usedId);
      setType(usedType);

      console.log('\n=================== 📥 Fetching Cart Data ===================');
      console.log('Used Mobile:', usedMobile);
      console.log('Used ID:', usedId);
      console.log('Used Type:', usedType);
      console.log('==============================================================\n');

      const response = await axios.get('https://minsway.co.in/leaf/mb/Checkout/checkout', {
        params: {
          mobile: usedMobile,
          id: usedId,
        },
      });

      console.log('\n=================== 📦 Cart API Response ===================');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('=============================================================\n');

      if (response.data.success === 1 && Array.isArray(response.data.data)) {
        setCartItems(response.data.data);
      } else {
        setCartItems([]);
        Alert.alert('No Items', response.data.message || 'Your cart is empty.');
      }
    } catch (error) {
      console.error('❌ Fetch Cart Error:', error);
      Alert.alert('Error', 'Something went wrong while fetching cart.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchCartData();
  // }, []);

  useFocusEffect(
  useCallback(() => {
    fetchCartData();
  }, [])
);

  const deleteCartItem = async (orderId) => {
    try {
      if (!mobile) {
        Alert.alert('Error', 'Mobile number not found.');
        return;
      }

      const response = await axios.get('https://minsway.co.in/leaf/mb/Delete/delete', {
        params: {
          mobile: mobile,
          delete: orderId,
        },
      });

      console.log('\n=================== 🗑️ Delete API Response ===================');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('=================================================================\n');

      if (response.data.success === 1) {
        Alert.alert('Success', response.data.message);
        fetchCartData();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to delete item.');
      }
    } catch (error) {
      console.error('❌ Delete API Error:', error);
      Alert.alert('Error', 'Something went wrong while deleting item.');
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
