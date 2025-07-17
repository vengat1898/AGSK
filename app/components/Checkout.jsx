// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   Alert,
//   TextInput,
//   Modal,
//   FlatList,
//   ActivityIndicator,
// } from 'react-native';
// import { Ionicons, Feather } from '@expo/vector-icons';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import styles from './Styles/checkoutStyles';

// export default function Checkout() {
//   const router = useRouter();
//   const { deliveryDateTime, type } = useLocalSearchParams();

//   const [showEnquiryFlow, setShowEnquiryFlow] = useState(false);
//   const [message, setMessage] = useState('');
//   const [pincodes, setPincodes] = useState([]);
//   const [selectedPincode, setSelectedPincode] = useState(null);
//   const [showPincodeModal, setShowPincodeModal] = useState(false);
//   const [pincodeLoading, setPincodeLoading] = useState(false);
//   const [subtotal, setSubtotal] = useState(0);
//   const [userDetails, setUserDetails] = useState({});

//   const normalizedDateTime =
//     deliveryDateTime?.includes(' ') && !deliveryDateTime?.includes('T')
//       ? deliveryDateTime.replace(' ', 'T')
//       : deliveryDateTime;

//   const parsedDate = new Date(normalizedDateTime);
//   const isValidDate = !isNaN(parsedDate);

//   useEffect(() => {
//     const fetchInvoiceAndUser = async () => {
//       try {
//         const storedMobile = await AsyncStorage.getItem('customerMobile');
//         const storedId = await AsyncStorage.getItem('customerId');
//         if (!storedMobile) return;

//         console.log('📲 Retrieved Mobile:', storedMobile);
//         console.log('🆔 Retrieved ID:', storedId);

//         const response = await axios.get(
//           'https://minsway.co.in/leaf/mb/Orderplace/Orderplace',
//           { params: { mobile: storedMobile } }
//         );

//         console.log('🧾 Invoice API Response:', response.data);

//         if (response.data.success === 1) {
//           setSubtotal(response.data.total_price || 0);
//           setUserDetails(response.data.data || {});
//         }
//       } catch (error) {
//         console.error('❌ Error fetching invoice and user details:', error);
//       }
//     };

//     fetchInvoiceAndUser();
//   }, []);

//   useEffect(() => {
//     const fetchAllPincodes = async () => {
//       try {
//         setPincodeLoading(true);
//         const response = await axios.get('https://minsway.co.in/leaf/mb/Pincode/all_pincodes');
//         if (response.data.success === 1) {
//           setPincodes(response.data.data);
//         }
//       } catch (error) {
//         console.error('❌ Pincode Fetch Error:', error);
//       } finally {
//         setPincodeLoading(false);
//       }
//     };

//     fetchAllPincodes();
//   }, []);

//   useEffect(() => {
//     if (isValidDate) {
//       try {
//         const selectedDate = new Date(normalizedDateTime);
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const threeDaysLater = new Date(today);
//         threeDaysLater.setDate(today.getDate() + 3);
//         const compareDate = new Date(selectedDate);
//         compareDate.setHours(0, 0, 0, 0);
//         const shouldShowEnquiry = compareDate > threeDaysLater;
//         setShowEnquiryFlow(shouldShowEnquiry);
//       } catch (error) {
//         console.error('Error in date comparison:', error);
//         setShowEnquiryFlow(false);
//       }
//     }
//   }, [normalizedDateTime]);

//   const handleProceed = () => {
//     if (!selectedPincode) {
//       Alert.alert('Select Pincode', 'Please choose a delivery pincode.');
//       return;
//     }

//     if (!deliveryDateTime) {
//       Alert.alert('Missing Date', 'Delivery date is required.');
//       return;
//     }

//     Alert.alert(
//       'Please Wait',
//       'Payment screenshot verification in process. Confirmation in 12 hours.',
//       [{ text: 'OK' }]
//     );
//   };

//   const handleSendEnquiry = () => {
//     if (!message.trim()) {
//       Alert.alert('Error', 'Please describe your enquiry.');
//       return;
//     }
//     Alert.alert('Success', 'Your enquiry has been sent to the admin.');
//     setMessage('');
//   };

//   const renderCheckoutFlow = () => {
//     const deliveryCharge = selectedPincode ? parseInt(selectedPincode.price) : 40;
//     const taxes = 18;
//     const discount = 20;
//     const total = subtotal + deliveryCharge + taxes - discount;

//     return (
//       <>
//         <Text style={styles.sectionTitle}>
//           You are ordering as: {type === '1' ? 'Customer' : type === '2' ? 'Hotel' : 'Catering'}
//         </Text>

//         <Text style={styles.sectionTitle}>Invoice</Text>
//         <View style={styles.invoiceBox}>
//           <View style={styles.invoiceRow}>
//             <Text style={styles.invoiceLabel}>Subtotal</Text>
//             <Text style={styles.invoiceValue}>₹{subtotal}</Text>
//           </View>
//           <View style={styles.invoiceRow}>
//             <Text style={styles.invoiceLabel}>Delivery</Text>
//             <Text style={styles.invoicePositive}>+ ₹{deliveryCharge}</Text>
//           </View>
//           <View style={styles.invoiceRow}>
//             <Text style={styles.invoiceLabel}>Taxes</Text>
//             <Text style={styles.invoicePositive}>+ ₹{taxes}</Text>
//           </View>
//           <View style={styles.invoiceRow}>
//             <Text style={styles.invoiceLabel}>Discount</Text>
//             <Text style={styles.invoiceNegative}>- ₹{discount}</Text>
//           </View>
//           <View style={[styles.invoiceRow, styles.totalRow]}>
//             <Text style={styles.totalLabel}>Total</Text>
//             <Text style={styles.totalValue}>₹{total}</Text>
//           </View>
//         </View>

//         <Text style={styles.sectionTitle}>Shipping Details</Text>
//         <View style={styles.shippingBox}>
//           <View style={styles.shippingHeader}>
//             <Text style={styles.shippingName}>{userDetails.name || 'Name'}</Text>
//             <Text style={styles.shippingType}>Home</Text>
//           </View>
//           <View style={styles.shippingRow}>
//             <Ionicons name="location-outline" size={18} color="#555" />
//             <Text style={styles.shippingText}>
//               {userDetails.address || 'Your address'},{' '}
//               {selectedPincode?.city || 'Chennai'}, Tamil Nadu
//             </Text>
//           </View>
//           <View style={styles.shippingRow}>
//             <Feather name="phone" size={18} color="#555" />
//             <Text style={styles.shippingText}>+91 {userDetails.mobile || '9876543210'}</Text>
//           </View>
//           <TouchableOpacity style={styles.editButton}>
//             <Text style={styles.editText}>Edit Address</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.paymentOptions}>
//           {/* Pay Online */}
//           <TouchableOpacity
//             style={[styles.paymentButton, styles.onlinePayment]}
//             onPress={() => {
//               const user_id = userDetails.id;
//               const mobile = userDetails.mobile;
//               const address = userDetails.address;
//               const original_price = subtotal;
//               const delivery_charge = deliveryCharge;
//               const total_price = total;
//               const delivery_date = deliveryDateTime;
//               const order_date = new Date().toISOString().split('T')[0];
//               const pincode = selectedPincode?.pincode || '';
//               const pincode_city = selectedPincode?.city || '';
//               const pincode_price = selectedPincode?.price || 0;

//               router.push({
//                 pathname: '/components/PayOnline',
//                 params: {
//                   user_id,
//                   mobile,
//                   address,
//                   original_price,
//                   delivery_charge,
//                   total_price,
//                   delivery_date,
//                   order_date,
//                   type,
//                   pincode,
//                   pincode_city,
//                   pincode_price,
//                 },
//               });
//             }}
//           >
//             <Text style={styles.paymentButtonText}>Pay Online</Text>
//           </TouchableOpacity>

//           {/* Cash on Delivery */}
//           <TouchableOpacity
//             style={[styles.paymentButton, styles.codPayment]}
//             onPress={async () => {
//               try {
//                 const mobile = userDetails.mobile;
//                 const address = userDetails.address || 'Chengalpattu';
//                 const original_price = subtotal;
//                 const delivery_charge = deliveryCharge;
//                 const total_price = subtotal + delivery_charge + 18 - 20;
//                 const discount = 10;
//                 const delivery_date = deliveryDateTime;
//                 const order_date = new Date().toISOString().split('T')[0];
//                 const pincode = selectedPincode?.pincode || '';
//                 const second_mobile = mobile;
//                 const payment_type = 'cod';

//                 console.log('========== COD ORDER PARAMS ==========');
//                 console.log('📱 Mobile         :', mobile);
//                 console.log('🏠 Address        :', address);
//                 console.log('💰 Subtotal       : ₹', original_price);
//                 console.log('🚚 Delivery Charge: ₹', delivery_charge);
//                 console.log('💸 Discount       : ₹', discount);
//                 console.log('💵 Total Price    : ₹', total_price);
//                 console.log('📅 Delivery Date  :', delivery_date);
//                 console.log('🗓️  Order Date     :', order_date);
//                 console.log('📍 Pincode        :', pincode);
//                 console.log('💳 Payment Type   :', payment_type);
//                 console.log('=======================================');

//                 const response = await axios.get(
//                   'https://minsway.co.in/leaf/mb/Finalplaceorder/final_update',
//                   {
//                     params: {
//                       mobile,
//                       orginal_price: original_price,
//                       delivery: delivery_charge,
//                       discount,
//                       total_price,
//                       address,
//                       second_mobile,
//                       payment_type,
//                       pincode,
//                       order_date,
//                       delivery_date,
//                       type,
//                     },
//                   }
//                 );

//                 console.log('========== COD API RESPONSE ==========');
//                 console.log('✅ Success   :', response.data.success);
//                 console.log('📦 Message   :', response.data.message);
//                 console.log('🧾 Order Info:', response.data.data);
//                 console.log('=======================================');

//                 if (response.data.success === 1) {
//                   Alert.alert(
//                     'Order Confirmed',
//                     'Your COD order has been placed successfully! Wait for confirmation.',
//                     [
//                       {
//                         text: 'OK',
//                         onPress: () => router.push('/components/Home'),
//                       },
//                     ]
//                   );
//                 } else {
//                   Alert.alert('Error', 'Something went wrong. Try again, choose pincode.');
//                 }
//               } catch (error) {
//                 console.log('❌ COD Order Error:', error);
//                 Alert.alert('Error', 'Failed to place COD order.');
//               }
//             }}
//           >
//             <Text style={styles.paymentButtonText}>Cash on Delivery</Text>
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity
//           style={[styles.actionButton, styles.proceedButton]}
//           onPress={handleProceed}
//         >
//           <Text style={styles.actionButtonText}>Proceed with Order</Text>
//         </TouchableOpacity>
//       </>
//     );
//   };

//   const renderEnquiryFlow = () => (
//     <View style={styles.enquiryContainer}>
//       <Text style={styles.instructionsText}>
//         Your delivery date is more than 3 days from today. Please send an enquiry and our team will
//         confirm your order.
//       </Text>
//       <TextInput
//         style={styles.messageInput}
//         placeholder="Enter your enquiry details..."
//         placeholderTextColor="#999"
//         multiline
//         numberOfLines={5}
//         value={message}
//         onChangeText={setMessage}
//       />
//       <TouchableOpacity
//         style={[styles.actionButton, styles.enquiryButton]}
//         onPress={handleSendEnquiry}
//       >
//         <Text style={styles.actionButtonText}>Send Enquiry</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.safeHeader}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => router.replace('/components/Cart')} style={styles.headerBackButton}>
//             <Ionicons name="chevron-back" size={24} color="black" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Checkout</Text>
//         </View>
//       </SafeAreaView>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <TouchableOpacity
//           style={styles.locationBox}
//           onPress={() => setShowPincodeModal(true)}
//         >
//           <Text style={styles.useLocationText}>
//             {selectedPincode
//               ? `📍 ${selectedPincode.city} (${selectedPincode.pincode}) - ₹${selectedPincode.price}`
//               : 'Choose Pincode'}
//           </Text>
//         </TouchableOpacity>

//         {deliveryDateTime && (
//           <Text style={styles.sectionTitle}>Delivery DateTime: {deliveryDateTime}</Text>
//         )}

//         {showEnquiryFlow ? renderEnquiryFlow() : renderCheckoutFlow()}
//       </ScrollView>

//       <Modal
//         visible={showPincodeModal}
//         animationType="slide"
//         transparent
//         onRequestClose={() => setShowPincodeModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalBox}>
//             <Text style={styles.modalTitle}>Select Delivery Pincode</Text>

//             {pincodeLoading ? (
//               <ActivityIndicator size="large" color="green" />
//             ) : (
//               <FlatList
//                 data={pincodes}
//                 keyExtractor={(item, index) => index.toString()}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     style={styles.pincodeItem}
//                     onPress={() => {
//                       setSelectedPincode(item);
//                       setShowPincodeModal(false);
//                     }}
//                   >
//                     <Text style={styles.pincodeText}>
//                       {item.city} ({item.pincode}) - ₹{item.price}
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               />
//             )}

//             <TouchableOpacity
//               onPress={() => setShowPincodeModal(false)}
//               style={styles.closeButton}
//             >
//               <Text style={styles.closeButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './Styles/checkoutStyles';

export default function Checkout() {
  const router = useRouter();
  const { deliveryDateTime, type } = useLocalSearchParams();

  const [showEnquiryFlow, setShowEnquiryFlow] = useState(false);
  const [message, setMessage] = useState('');
  const [pincodes, setPincodes] = useState([]);
  const [selectedPincode, setSelectedPincode] = useState(null);
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [userDetails, setUserDetails] = useState({});

  // Function to parse the date string in "DD/MM/YYYY, HH:mm:ss" format
  const parseDeliveryDate = (dateString) => {
    if (!dateString) return null;
    
    try {
      // Split the date and time parts
      const [datePart, timePart] = dateString.split(', ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes, seconds] = timePart.split(':');
      
      // Create a new Date object (months are 0-indexed in JavaScript)
      return new Date(year, month - 1, day, hours, minutes, seconds);
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchInvoiceAndUser = async () => {
      try {
        const storedMobile = await AsyncStorage.getItem('customerMobile');
        const storedId = await AsyncStorage.getItem('customerId');
        if (!storedMobile) return;

        console.log('📲 Retrieved Mobile:', storedMobile);
        console.log('🆔 Retrieved ID:', storedId);

        const response = await axios.get(
          'https://minsway.co.in/leaf/mb/Orderplace/Orderplace',
          { params: { mobile: storedMobile } }
        );

        console.log('🧾 Invoice API Response:', response.data);

        if (response.data.success === 1) {
          setSubtotal(response.data.total_price || 0);
          setUserDetails(response.data.data || {});
        }
      } catch (error) {
        console.error('❌ Error fetching invoice and user details:', error);
      }
    };

    fetchInvoiceAndUser();
  }, []);

  useEffect(() => {
    const fetchAllPincodes = async () => {
      try {
        setPincodeLoading(true);
        const response = await axios.get('https://minsway.co.in/leaf/mb/Pincode/all_pincodes');
        if (response.data.success === 1) {
          setPincodes(response.data.data);
        }
      } catch (error) {
        console.error('❌ Pincode Fetch Error:', error);
      } finally {
        setPincodeLoading(false);
      }
    };

    fetchAllPincodes();
  }, []);

  useEffect(() => {
    if (deliveryDateTime) {
      try {
        const deliveryDate = parseDeliveryDate(deliveryDateTime);
        if (!deliveryDate) return;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const fiveDaysLater = new Date(today);
        fiveDaysLater.setDate(today.getDate() + 5);
        
        // Compare dates (ignoring time)
        const compareDate = new Date(deliveryDate);
        compareDate.setHours(0, 0, 0, 0);
        
        // Show enquiry flow if date is more than 5 days from today
        const shouldShowEnquiry = compareDate > fiveDaysLater;
        setShowEnquiryFlow(shouldShowEnquiry);
      } catch (error) {
        console.error('Error in date comparison:', error);
        setShowEnquiryFlow(false);
      }
    }
  }, [deliveryDateTime]);

  const handleProceed = () => {
    if (!selectedPincode) {
      Alert.alert('Select Pincode', 'Please choose a delivery pincode.');
      return;
    }

    if (!deliveryDateTime) {
      Alert.alert('Missing Date', 'Delivery date is required.');
      return;
    }

    Alert.alert(
      'Please Wait',
      'Payment screenshot verification in process. Confirmation in 12 hours.',
      [{ text: 'OK' }]
    );
  };

const handleSendEnquiry = async () => {
  if (!message.trim()) {
    Alert.alert('Error', 'Please describe your enquiry.');
    return;
  }

  try {
    const storedMobile = await AsyncStorage.getItem('customerMobile');
    const storedId = await AsyncStorage.getItem('customerId');
    const product_id = 1;
    const product_detaild_id = 1;
    const count = 3;
    const address = userDetails.address || 'No address';
    const customer_date = deliveryDateTime;
    const enquiryMessage = message.trim();

    console.log('========== ENQUIRY API CALL ==========');
    console.log('📱 Mobile:', storedMobile);
    console.log('🛒 Product ID:', product_id);
    console.log('🔍 Product Detail ID:', product_detaild_id);
    console.log('🔢 Count:', count);
    console.log('📍 Address:', address);
    console.log('📅 Date:', customer_date);
    console.log('💬 Message:', enquiryMessage);
    console.log('======================================');

    const response = await axios.get('https://minsway.co.in/leaf/mb/Enquiry/enquiry', {
      params: {
        mobile: storedMobile,
        product_id,
        product_detaild_id,
        count,
        address,
        customer_date,
        message: enquiryMessage,
      },
    });

    console.log('========== ENQUIRY API RESPONSE ==========');
    console.log('✅ Success:', response.data.success);
    console.log('💬 Message:', response.data.message);
    console.log('==========================================');

    if (response.data.success === 1) {
      Alert.alert('Success', 'Your enquiry has been sent to the admin.', [
        {
          text: 'OK',
          onPress: () => {
            console.log('========== ENQUIRY NAVIGATION ==========');
            console.log('📲 Navigating to Home with params:');
            console.log('📱 Mobile:', storedMobile);
            console.log('📄 Type:', type);
            console.log('🆔 ID:', storedId);
            console.log('=========================================');

            router.push({
              pathname: '/components/Home',
              params: {
                mobile: storedMobile,
                type,
                id: storedId,
              },
            });
          },
        },
      ]);
      setMessage('');
    } else {
      Alert.alert('Failed', 'Failed to send enquiry. Please try again later.');
    }
  } catch (error) {
    console.error('❌ Enquiry API Error:', error);
    Alert.alert('Error', 'Something went wrong while sending enquiry.');
  }
};



  const renderCheckoutFlow = () => {
    const deliveryCharge = selectedPincode ? parseInt(selectedPincode.price) : 40;
    const taxes = 18;
    const discount = 20;
    const total = subtotal + deliveryCharge + taxes - discount;

    return (
      <>
        <Text style={styles.sectionTitle}>
          You are ordering as: {type === '1' ? 'Customer' : type === '2' ? 'Hotel' : 'Catering'}
        </Text>

        <Text style={styles.sectionTitle}>Invoice</Text>
        <View style={styles.invoiceBox}>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Subtotal</Text>
            <Text style={styles.invoiceValue}>₹{subtotal}</Text>
          </View>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Delivery</Text>
            <Text style={styles.invoicePositive}>+ ₹{deliveryCharge}</Text>
          </View>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Taxes</Text>
            <Text style={styles.invoicePositive}>+ ₹{taxes}</Text>
          </View>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Discount</Text>
            <Text style={styles.invoiceNegative}>- ₹{discount}</Text>
          </View>
          <View style={[styles.invoiceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Shipping Details</Text>
        <View style={styles.shippingBox}>
          <View style={styles.shippingHeader}>
            <Text style={styles.shippingName}>{userDetails.name || 'Name'}</Text>
            <Text style={styles.shippingType}>Home</Text>
          </View>
          <View style={styles.shippingRow}>
            <Ionicons name="location-outline" size={18} color="#555" />
            <Text style={styles.shippingText}>
              {userDetails.address || 'Your address'},{' '}
              {selectedPincode?.city || 'Chennai'}, Tamil Nadu
            </Text>
          </View>
          <View style={styles.shippingRow}>
            <Feather name="phone" size={18} color="#555" />
            <Text style={styles.shippingText}>+91 {userDetails.mobile || '9876543210'}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Edit Address</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.paymentOptions}>
          {/* Pay Online */}
          <TouchableOpacity
            style={[styles.paymentButton, styles.onlinePayment]}
            onPress={() => {
              const user_id = userDetails.id;
              const mobile = userDetails.mobile;
              const address = userDetails.address;
              const original_price = subtotal;
              const delivery_charge = deliveryCharge;
              const total_price = total;
              const delivery_date = deliveryDateTime;
              const order_date = new Date().toISOString().split('T')[0];
              const pincode = selectedPincode?.pincode || '';
              const pincode_city = selectedPincode?.city || '';
              const pincode_price = selectedPincode?.price || 0;

              router.push({
                pathname: '/components/PayOnline',
                params: {
                  user_id,
                  mobile,
                  address,
                  original_price,
                  delivery_charge,
                  total_price,
                  delivery_date,
                  order_date,
                  type,
                  pincode,
                  pincode_city,
                  pincode_price,
                },
              });
            }}
          >
            <Text style={styles.paymentButtonText}>Pay Online</Text>
          </TouchableOpacity>

          {/* Cash on Delivery */}
          <TouchableOpacity
            style={[styles.paymentButton, styles.codPayment]}
            onPress={async () => {
              try {
                const mobile = userDetails.mobile;
                const address = userDetails.address || 'Chengalpattu';
                const original_price = subtotal;
                const delivery_charge = deliveryCharge;
                const total_price = subtotal + delivery_charge + 18 - 20;
                const discount = 10;
                const delivery_date = deliveryDateTime;
                const order_date = new Date().toISOString().split('T')[0];
                const pincode = selectedPincode?.pincode || '';
                const second_mobile = mobile;
                const payment_type = 'cod';

                console.log('========== COD ORDER PARAMS ==========');
                console.log('📱 Mobile :', mobile);
                console.log('🏠 Address :', address);
                console.log('💰 Subtotal : ₹', original_price);
                console.log('🚚 Delivery Charge: ₹', delivery_charge);
                console.log('💸 Discount : ₹', discount);
                console.log('💵 Total Price : ₹', total_price);
                console.log('📅 Delivery Date :', delivery_date);
                console.log('🗓️ Order Date :', order_date);
                console.log('📍 Pincode :', pincode);
                console.log('💳 Payment Type :', payment_type);
                console.log('=======================================');

                const response = await axios.get(
                  'https://minsway.co.in/leaf/mb/Finalplaceorder/final_update',
                  {
                    params: {
                      mobile,
                      orginal_price: original_price,
                      delivery: delivery_charge,
                      discount,
                      total_price,
                      address,
                      second_mobile,
                      payment_type,
                      pincode,
                      order_date,
                      delivery_date,
                      type,
                    },
                  }
                );

                console.log('========== COD API RESPONSE ==========');
                console.log('✅ Success :', response.data.success);
                console.log('📦 Message :', response.data.message);
                console.log('🧾 Order Info:', response.data.data);
                console.log('=======================================');

                if (response.data.success === 1) {
                  Alert.alert(
                    'Order Confirmed',
                    'Your COD order has been placed successfully! Wait for confirmation.',
                    [
                      {
                        text: 'OK',
                        onPress: () => router.push('/components/Home'),
                      },
                    ]
                  );
                } else {
                  Alert.alert('Error', 'Something went wrong. Try again, choose pincode.');
                }
              } catch (error) {
                console.log('❌ COD Order Error:', error);
                Alert.alert('Error', 'Failed to place COD order.');
              }
            }}
          >
            <Text style={styles.paymentButtonText}>Cash on Delivery</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, styles.proceedButton]}
          onPress={handleProceed}
        >
          <Text style={styles.actionButtonText}>Proceed with Order</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderEnquiryFlow = () => (
    <View style={styles.enquiryContainer}>
      <Text style={styles.instructionsText}>
        Your delivery date is more than 5 days from today. Please send an enquiry and our team will
        confirm your order availability for this date.
      </Text>
      <TextInput
        style={styles.messageInput}
        placeholder="Enter your enquiry details..."
        placeholderTextColor="#999"
        multiline
        numberOfLines={5}
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity
        style={[styles.actionButton, styles.enquiryButton]}
        onPress={handleSendEnquiry}
      >
        <Text style={styles.actionButtonText}>Send Enquiry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/components/Cart')} style={styles.headerBackButton}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.locationBox}
          onPress={() => setShowPincodeModal(true)}
        >
          <Text style={styles.useLocationText}>
            {selectedPincode
              ? `📍 ${selectedPincode.city} (${selectedPincode.pincode}) - ₹${selectedPincode.price}`
              : 'Choose Pincode'}
          </Text>
        </TouchableOpacity>

        {deliveryDateTime && (
          <Text style={styles.sectionTitle}>Delivery DateTime: {deliveryDateTime}</Text>
        )}

        {showEnquiryFlow ? renderEnquiryFlow() : renderCheckoutFlow()}
      </ScrollView>

      <Modal
        visible={showPincodeModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPincodeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Delivery Pincode</Text>

            {pincodeLoading ? (
              <ActivityIndicator size="large" color="green" />
            ) : (
              <FlatList
                data={pincodes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.pincodeItem}
                    onPress={() => {
                      setSelectedPincode(item);
                      setShowPincodeModal(false);
                    }}
                  >
                    <Text style={styles.pincodeText}>
                      {item.city} ({item.pincode}) - ₹{item.price}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <TouchableOpacity
              onPress={() => setShowPincodeModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}













