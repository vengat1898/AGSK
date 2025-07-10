import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useRouter } from 'expo-router';
import styles from './Styles/cartStyles';
import bananaLeaf from '../../assets/images/bananaleafOne.png';

const initialCartItems = [
  { id: '1', name: 'screen banana leaf | round', quantity: '200 leaf' },
  { id: '2', name: 'screen banana leaf | round', quantity: '200 leaf' },
  { id: '3', name: 'screen banana leaf | round', quantity: '200 leaf' },
  { id: '5', name: 'screen banana leaf | round', quantity: '200 leaf' },
  { id: '6', name: 'screen banana leaf | round', quantity: '200 leaf' },
  { id: '7', name: 'screen banana leaf | round', quantity: '200 leaf' },
  { id: '8', name: 'screen banana leaf | round', quantity: '200 leaf' },
  { id: '9', name: 'screen banana leaf | round', quantity: '200 leaf' },
  { id: '10', name: 'screen banana leaf | round', quantity: '200 leaf' },
  { id: '11', name: 'screen banana leaf | round', quantity: '200 leaf' },
];

export default function Cart() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [deliveryDateTime, setDeliveryDateTime] = useState('');

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setDeliveryDateTime(date.toLocaleString());
    hideDatePicker();
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={bananaLeaf} style={styles.productImage} resizeMode="cover" />
      <View style={styles.cardDetails}>
        <Text style={styles.orderStatus}>selected orders</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productQuantity}>{item.quantity}</Text>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Feather name="trash-2" size={20} color="#444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Safe header */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CART</Text>
        </View>
      </SafeAreaView>

      {/* List */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Date Picker */}
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

      {/* Safe footer */}
      <SafeAreaView style={styles.footerSafeArea}>
        <TouchableOpacity style={styles.checkoutButton}onPress={() => router.push('/components/Checkout')}>
          <Text style={styles.checkoutText}>Proceed To Checkout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}

