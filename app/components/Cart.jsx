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
// import { useFocusEffect } from '@react-navigation/native';
// import { useCallback } from 'react';

// export default function Cart() {
//   const router = useRouter();
//   const { mobile: paramMobile, id: paramId, type: paramType } = useLocalSearchParams();

//   const [cartItems, setCartItems] = useState([]);
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const [deliveryDateTime, setDeliveryDateTime] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [imageError, setImageError] = useState({});
//   const [mobile, setMobile] = useState('');
//   const [id, setId] = useState('');
//   const [type, setType] = useState('');

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

//       // Always get fresh values from AsyncStorage, ignore route params for security
//       const storedMobile = await AsyncStorage.getItem('customerMobile');
//       const storedId = await AsyncStorage.getItem('customerId');
//       const storedType = await AsyncStorage.getItem('type');

//       console.log('\n=================== 🔍 FETCH CART DATA ===================');
//       console.log('Stored Mobile:', storedMobile);
//       console.log('Stored ID:', storedId);
//       console.log('Stored Type:', storedType);
//       console.log('=========================================================\n');

//       if (!storedMobile || !storedId) {
//         Alert.alert('Error', 'Please login again');
//         router.replace('/components/Login');
//         return;
//       }

//       setMobile(storedMobile);
//       setId(storedId);
//       setType(storedType);

//       console.log('🛒 Fetching cart for Mobile:', storedMobile, 'ID:', storedId);

//       const response = await axios.get('https://minsway.co.in/leaf/mb/Checkout/checkout', {
//         params: {
//           mobile: storedMobile,
//           id: storedId,
//         },
//       });

//       console.log('\n=================== 📦 CART API RESPONSE ===================');
//       console.log('Response Status:', response.status);
//       console.log('Response Data:', JSON.stringify(response.data, null, 2));
//       console.log('=========================================================\n');

//       if (response.data.success === 1 && Array.isArray(response.data.data)) {
//         setCartItems(response.data.data);
//         console.log('✅ Cart items set successfully. Count:', response.data.data.length);
//       } else {
//         setCartItems([]);
//         console.log('⚠️ No cart items found or API returned error');
//       }
//     } catch (error) {
//       console.error('❌ Fetch Cart Error:', error);
//       console.error('Error Details:', error.response?.data || error.message);
//       Alert.alert('Error', 'Failed to fetch cart');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchCartData();
//     }, [])
//   );

//   const deleteCartItem = async (orderId) => {
//     try {
//       const currentMobile = await AsyncStorage.getItem('customerMobile');
      
//       console.log('\n=================== 🗑️ DELETE CART ITEM ===================');
//       console.log('Order ID to delete:', orderId);
//       console.log('Current Mobile:', currentMobile);
//       console.log('=========================================================\n');

//       if (!currentMobile || currentMobile !== mobile) {
//         Alert.alert('Session Expired', 'Please login again');
//         router.replace('/components/Login');
//         return;
//       }

//       const response = await axios.get('https://minsway.co.in/leaf/mb/Delete/delete', {
//         params: {
//           mobile: currentMobile,
//           delete: orderId,
//         },
//       });

//       console.log('🗑️ Delete API Response:', JSON.stringify(response.data, null, 2));

//       if (response.data.success === 1) {
//         console.log('✅ Item deleted successfully');
//         fetchCartData(); // Refresh cart data
//       } else {
//         console.log('❌ Delete failed:', response.data.message);
//         Alert.alert('Error', response.data.message);
//       }
//     } catch (error) {
//       console.error('❌ Delete Error:', error);
//       Alert.alert('Error', 'Failed to delete item');
//     }
//   };

//   const removeItem = (item) => {
//     Alert.alert(
//       'Remove Item',
//       `Are you sure you want to remove ${item.name}?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Remove', onPress: () => deleteCartItem(item.order_id) },
//       ]
//     );
//   };

//   const saveCartDataToStorage = async (cartData) => {
//     try {
//       console.log('\n=================== 💾 SAVING CART DATA TO ASYNC STORAGE ===================');
      
//       // Save individual cart items data
//       for (let i = 0; i < cartData.length; i++) {
//         const item = cartData[i];
        
//         // Save each item's data with index
//         await AsyncStorage.setItem(`cart_item_${i}_product_id`, item.product_id?.toString() || '');
//         await AsyncStorage.setItem(`cart_item_${i}_product_detail_id`, item.product_detaild_id?.toString() || '');
//         await AsyncStorage.setItem(`cart_item_${i}_order_id`, item.order_id?.toString() || '');
//         await AsyncStorage.setItem(`cart_item_${i}_count`, item.count?.toString() || '');
//         await AsyncStorage.setItem(`cart_item_${i}_price`, item.price?.toString() || '');
//         await AsyncStorage.setItem(`cart_item_${i}_name`, item.name || '');
//         await AsyncStorage.setItem(`cart_item_${i}_size`, item.size || '');

//         console.log(`📦 Cart Item ${i}:`, {
//           product_id: item.product_id,
//           product_detail_id: item.product_detaild_id,
//           order_id: item.order_id,
//           count: item.count,
//           price: item.price,
//           name: item.name,
//           size: item.size
//         });
//       }

//       // Save total cart count
//       await AsyncStorage.setItem('cart_items_count', cartData.length.toString());
      
//       // Save user data
//       await AsyncStorage.setItem('checkout_user_id', id.toString());
//       await AsyncStorage.setItem('checkout_mobile', mobile);
//       await AsyncStorage.setItem('checkout_type', type);

//       console.log('✅ All cart data saved to AsyncStorage successfully');
//       console.log('Total items saved:', cartData.length);
//       console.log('===============================================================================\n');

//     } catch (error) {
//       console.error('❌ Error saving cart data to AsyncStorage:', error);
//     }
//   };

//   const proceedToCheckout = async () => {
//     try {
//       console.log('\n=================== 🚀 PROCEED TO CHECKOUT ===================');
      
//       if (!mobile || !id) {
//         console.log('❌ User information missing');
//         Alert.alert('Error', 'User information missing');
//         return;
//       }

//       if (cartItems.length === 0) {
//         console.log('❌ No items in cart');
//         Alert.alert('Error', 'No items in cart');
//         return;
//       }

//       if (!deliveryDateTime) {
//         console.log('❌ No delivery date selected');
//         Alert.alert('Select Delivery Date', 'Please choose delivery date and time');
//         return;
//       }

//       console.log('📋 Current cart items:', cartItems.length);
//       console.log('📅 Delivery date:', deliveryDateTime);
//       console.log('👤 User info:', { mobile, id, type });

//       // Save all cart data to AsyncStorage
//       await saveCartDataToStorage(cartItems);

//       const confirmOrderIds = cartItems.map((item) => item.order_id);
//       console.log('📦 Order IDs to confirm:', confirmOrderIds);

//       // Get first item data for primary product info
//       const firstItem = cartItems[0] || {};
//       const product_id = firstItem.product_id || '';
//       const product_detaild_id = firstItem.product_detaild_id || '';
//       const count = firstItem.count || '';

//       console.log('📦 First item data:', {
//         product_id,
//         product_detail_id: product_detaild_id,
//         count,
//         name: firstItem.name
//       });

//       // Calculate total amount
//       const totalAmount = cartItems.reduce((sum, item) => {
//         const price = parseFloat(item.price) || 0;
//         const quantity = parseInt(item.count) || 0;
//         return sum + (price * quantity);
//       }, 0);

//       console.log('💰 Total amount calculated:', totalAmount);

//       // Save delivery date and total amount
//       await AsyncStorage.setItem('delivery_date_time', deliveryDateTime);
//       await AsyncStorage.setItem('total_amount', totalAmount.toString());

//       const params = {
//         mobile: mobile,
//         id: id,
//         delete_order: JSON.stringify([]),
//         conform_order: JSON.stringify(confirmOrderIds),
//         order_date: deliveryDateTime,
//       };

//       console.log('\n=================== 📡 CHECKOUT API PARAMS ===================');
//       console.log(JSON.stringify(params, null, 2));
//       console.log('===============================================================\n');

//       const response = await axios.get(
//         'https://minsway.co.in/leaf/mb/Checkoutpay/checkoutpay',
//         { params }
//       );

//       console.log('\n=================== ✅ CHECKOUT API RESPONSE ===================');
//       console.log('Response Status:', response.status);
//       console.log('Response Data:', JSON.stringify(response.data, null, 2));
//       console.log('================================================================\n');

//       if (response.data.success === 1) {
//         console.log('✅ Checkout API call successful');
        
//         // Prepare checkout navigation params
//         const checkoutParams = {
//           deliveryDateTime: deliveryDateTime,
//           mobile: mobile,
//           type: type,
//           id: id,
//           product_id: product_id.toString(),
//           product_detail_id: product_detaild_id.toString(),
//           count: count.toString(),
//           total_amount: totalAmount.toString(),
//           cart_items_count: cartItems.length.toString(),
//         };

//         console.log('\n=================== 🧭 NAVIGATION PARAMS ===================');
//         console.log(JSON.stringify(checkoutParams, null, 2));
//         console.log('=============================================================\n');

//         Alert.alert('Success', response.data.message || 'Checkout successful', [
//           {
//             text: 'OK',
//             onPress: () => {
//               console.log('🧭 Navigating to checkout page...');
//               router.push({
//                 pathname: '/components/Checkout',
//                 params: checkoutParams,
//               });
//             }
//           },
//         ]);
//       } else {
//         console.log('❌ Checkout failed:', response.data.message);
//         Alert.alert('Failed', response.data.message || 'Checkout failed');
//       }
//     } catch (error) {
//       console.error('❌ Checkout API Error:', error);
//       console.error('Error Details:', error.response?.data || error.message);
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
//       <SafeAreaView style={styles.headerSafeArea}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => router.replace('/components/Home')}>
//             <Ionicons name="arrow-back" size={22} color="#000" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>CART</Text>
//         </View>
//       </SafeAreaView>

//       {loading ? (
//         <ActivityIndicator size="large" color="green" style={{ marginTop: 40 }} />
//       ) : (
//         <>
//           <FlatList
//             data={cartItems}
//             keyExtractor={(item) => item.order_id?.toString() || Math.random().toString()}
//             renderItem={renderItem}
//             contentContainerStyle={{ paddingBottom: 20 }}
//             ListEmptyComponent={
//               <Text style={{ textAlign: 'center', marginTop: 30 }}>
//                 No items in cart.
//               </Text>
//             }
//           />

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

//           <SafeAreaView style={styles.footerSafeArea}>
//             <TouchableOpacity
//               style={styles.checkoutButton}
//               onPress={proceedToCheckout}
//               disabled={cartItems.length === 0}
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

      // Always get fresh values from AsyncStorage, ignore route params for security
      const storedMobile = await AsyncStorage.getItem('customerMobile');
      const storedId = await AsyncStorage.getItem('customerId');
      const storedType = await AsyncStorage.getItem('type');

      console.log('\n=================== 🔍 FETCH CART DATA ===================');
      console.log('Stored Mobile:', storedMobile);
      console.log('Stored ID:', storedId);
      console.log('Stored Type:', storedType);
      console.log('=========================================================\n');

      if (!storedMobile || !storedId) {
        Alert.alert('Error', 'Please login again');
        router.replace('/components/Login');
        return;
      }

      setMobile(storedMobile);
      setId(storedId);
      setType(storedType);

      console.log('🛒 Fetching cart for Mobile:', storedMobile, 'ID:', storedId);

      const response = await axios.get('https://minsway.co.in/leaf/mb/Checkout/checkout', {
        params: {
          mobile: storedMobile,
          id: storedId,
        },
      });

      console.log('\n=================== 📦 CART API RESPONSE ===================');
      console.log('Response Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data, null, 2));
      console.log('=========================================================\n');

      if (response.data.success === 1 && Array.isArray(response.data.data)) {
        setCartItems(response.data.data);
        console.log('✅ Cart items set successfully. Count:', response.data.data.length);
      } else {
        setCartItems([]);
        console.log('⚠️ No cart items found or API returned error');
      }
    } catch (error) {
      console.error('❌ Fetch Cart Error:', error);
      console.error('Error Details:', error.response?.data || error.message);
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

  const deleteCartItem = async (orderId) => {
    try {
      const currentMobile = await AsyncStorage.getItem('customerMobile');
      
      console.log('\n=================== 🗑️ DELETE CART ITEM ===================');
      console.log('Order ID to delete:', orderId);
      console.log('Current Mobile:', currentMobile);
      console.log('=========================================================\n');

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

      console.log('🗑️ Delete API Response:', JSON.stringify(response.data, null, 2));

      if (response.data.success === 1) {
        console.log('✅ Item deleted successfully');
        fetchCartData(); // Refresh cart data
      } else {
        console.log('❌ Delete failed:', response.data.message);
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('❌ Delete Error:', error);
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

  const saveCartDataToStorage = async (cartData) => {
    try {
      console.log('\n=================== 💾 SAVING CART DATA TO ASYNC STORAGE ===================');
      
      // Save individual cart items data
      for (let i = 0; i < cartData.length; i++) {
        const item = cartData[i];
        
        // Save each item's data with index
        await AsyncStorage.setItem(`cart_item_${i}_product_id`, item.product_id?.toString() || '');
        await AsyncStorage.setItem(`cart_item_${i}_product_detail_id`, item.product_detaild_id?.toString() || '');
        await AsyncStorage.setItem(`cart_item_${i}_order_id`, item.order_id?.toString() || '');
        await AsyncStorage.setItem(`cart_item_${i}_count`, item.count?.toString() || '');
        await AsyncStorage.setItem(`cart_item_${i}_price`, item.price?.toString() || '');
        await AsyncStorage.setItem(`cart_item_${i}_name`, item.name || '');
        await AsyncStorage.setItem(`cart_item_${i}_size`, item.size || '');

        console.log(`📦 Cart Item ${i}:`, {
          product_id: item.product_id,
          product_detail_id: item.product_detaild_id,
          order_id: item.order_id,
          count: item.count,
          price: item.price,
          name: item.name,
          size: item.size
        });
      }

      // Save total cart count
      await AsyncStorage.setItem('cart_items_count', cartData.length.toString());
      
      // Save user data
      await AsyncStorage.setItem('checkout_user_id', id.toString());
      await AsyncStorage.setItem('checkout_mobile', mobile);
      await AsyncStorage.setItem('checkout_type', type);

      console.log('✅ All cart data saved to AsyncStorage successfully');
      console.log('Total items saved:', cartData.length);
      console.log('===============================================================================\n');

    } catch (error) {
      console.error('❌ Error saving cart data to AsyncStorage:', error);
    }
  };

  const proceedToCheckout = async () => {
    try {
      console.log('\n=================== 🚀 PROCEED TO CHECKOUT ===================');
      
      if (!mobile || !id) {
        console.log('❌ User information missing');
        Alert.alert('Error', 'User information missing');
        return;
      }

      if (cartItems.length === 0) {
        console.log('❌ No items in cart');
        Alert.alert('Error', 'No items in cart');
        return;
      }

      if (!deliveryDateTime) {
        console.log('❌ No delivery date selected');
        Alert.alert('Select Delivery Date', 'Please choose delivery date and time');
        return;
      }

      console.log('📋 Current cart items:', cartItems.length);
      console.log('📅 Delivery date:', deliveryDateTime);
      console.log('👤 User info:', { mobile, id, type });

      // Save all cart data to AsyncStorage
      await saveCartDataToStorage(cartItems);

      const confirmOrderIds = cartItems.map((item) => item.order_id);
      console.log('📦 Order IDs to confirm:', confirmOrderIds);

      // Get first item data for primary product info
      const firstItem = cartItems[0] || {};
      const product_id = firstItem.product_id || '';
      // Fix: Use the correct property name from your cart data
      const product_detaild_id = firstItem.product_detaild_id || firstItem.product_detail_id || '';
      const count = firstItem.count || '';

      console.log('📦 First item data:', {
        product_id,
        product_detaild_id, // Use consistent naming
        count,
        name: firstItem.name
      });

      // Calculate total amount
      const totalAmount = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.count) || 0;
        return sum + (price * quantity);
      }, 0);

      console.log('💰 Total amount calculated:', totalAmount);

      // Save delivery date and total amount
      await AsyncStorage.setItem('delivery_date_time', deliveryDateTime);
      await AsyncStorage.setItem('total_amount', totalAmount.toString());

      const params = {
        mobile: mobile,
        id: id,
        delete_order: JSON.stringify([]),
        conform_order: JSON.stringify(confirmOrderIds),
        order_date: deliveryDateTime,
      };

      console.log('\n=================== 📡 CHECKOUT API PARAMS ===================');
      console.log(JSON.stringify(params, null, 2));
      console.log('===============================================================\n');

      const response = await axios.get(
        'https://minsway.co.in/leaf/mb/Checkoutpay/checkoutpay',
        { params }
      );

      console.log('\n=================== ✅ CHECKOUT API RESPONSE ===================');
      console.log('Response Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data, null, 2));
      console.log('================================================================\n');

      if (response.data.success === 1) {
        console.log('✅ Checkout API call successful');
        
        // Prepare checkout navigation params - use consistent naming
        const checkoutParams = {
          deliveryDateTime: deliveryDateTime,
          mobile: mobile,
          type: type,
          id: id,
          product_id: product_id.toString(),
          product_detaild_id: product_detaild_id.toString(), // Match API parameter name
          count: count.toString(),
          total_amount: totalAmount.toString(),
          cart_items_count: cartItems.length.toString(),
        };

        console.log('\n=================== 🧭 NAVIGATION PARAMS ===================');
        console.log(JSON.stringify(checkoutParams, null, 2));
        console.log('=============================================================\n');

        Alert.alert('Success', response.data.message || 'Checkout successful', [
          {
            text: 'OK',
            onPress: () => {
              console.log('🧭 Navigating to checkout page...');
              router.push({
                pathname: '/components/Checkout',
                params: checkoutParams,
              });
            }
          },
        ]);
      } else {
        console.log('❌ Checkout failed:', response.data.message);
        Alert.alert('Failed', response.data.message || 'Checkout failed');
      }
    } catch (error) {
      console.error('❌ Checkout API Error:', error);
      console.error('Error Details:', error.response?.data || error.message);
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
