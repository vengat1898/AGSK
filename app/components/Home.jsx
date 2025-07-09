import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useRouter } from 'expo-router';
import headerImg from '../../assets/images/headerbackgroundimg.png';
import bananaLeaf from '../../assets/images/bananaleafOne.png';
import styles from './Styles/homeStyles';

const products = [
  {
    id: 1,
    name: 'Green Banana leaf',
    price: '₹ 200/20 Pieces',
    image: bananaLeaf,
  },
  {
    id: 2,
    name: 'Round Banana leaf',
    price: '₹ 100/20 Pieces',
    image: bananaLeaf,
  },
  {
    id: 3,
    name: 'Small Banana leaf',
    price: '₹ 80/20 Pieces',
    image: bananaLeaf,
  },
  {
    id: 4,
    name: 'Premium Banana leaf',
    price: '₹ 250/20 Pieces',
    image: bananaLeaf,
  },
  {
    id: 5,
    name: 'Banana leaf for Food Wrap',
    price: '₹ 150/20 Pieces',
    image: bananaLeaf,
  },
];

export default function Home() {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [deliveryDateTime, setDeliveryDateTime] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const router = useRouter();

  const toggleInput = (id) => {
    setSelectedProductId((prev) => (prev === id ? null : id));
  };

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toLocaleString(); // You can customize this format
    setDeliveryDateTime(formattedDate);
    hideDatePicker();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={headerImg} style={styles.headerBackground} resizeMode="cover" />
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.userText}>Mr.vengat</Text>

          <View style={styles.headerIcons}>
            <View style={styles.iconWrapper}>
              <Feather name="bell" size={20} color="#fff" />
              <View style={styles.badge}><Text style={styles.badgeText}>1</Text></View>
            </View>
            <View style={styles.iconWrapper}>
              <Feather name="shopping-cart" size={20} color="#fff" />
              <View style={styles.badge}><Text style={styles.badgeText}>0</Text></View>
            </View>
          </View>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              placeholder="Search Leaf.."
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
          </View>
        </View>
      </View>

      {/* Choose Delivery Date and Time */}
      <TouchableOpacity
        style={styles.dateTimeSelector}
        onPress={showDatePicker}
      >
        <View style={styles.dateTimeWrapper}>
          <Ionicons name="calendar-outline" size={20} color="#555" />
          <Text style={styles.dateTimeText}>
            {deliveryDateTime || 'Choose delivery date and time'}
          </Text>
          <AntDesign
            name="down"
            size={14}
            color="green"
            style={{ marginLeft: 'auto' }}
          />
        </View>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        minimumDate={new Date()}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {/* Product List */}
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 20 }}>
        <Text style={styles.sectionTitle}>Banana leaf (Minimum 50)</Text>

        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortText}>sort</Text>
          <AntDesign name="swap" size={20} color="#000" />
        </TouchableOpacity>

        {products.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.productImage} resizeMode="contain" />
            <View style={styles.cardDetails}>
              <Text style={styles.productName}>{item.name}</Text>

              <View style={styles.cartButton}>
                <TouchableOpacity onPress={() => router.push('/components/Checkout')}>
                  <Text style={styles.cartText}>Add to cart</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => toggleInput(item.id)}
                  style={styles.arrowCircle}
                >
                  <AntDesign name="down" size={14} color="green" />
                </TouchableOpacity>
              </View>

              {selectedProductId === item.id && (
                <TextInput
                  style={styles.inputBelowCard}
                  placeholder="Enter total number of leaf  ex -100"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={quantities[item.id] || ''}
                  onChangeText={(value) => handleQuantityChange(item.id, value)}
                />
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <SafeAreaView style={styles.footerSafeArea}>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.navItem}>
            <View style={styles.activeIconCircle}>
              <Ionicons name="home-outline" size={18} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="pricetags-outline" size={18} color="#1a3e2e" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="document-text-outline" size={18} color="#1a3e2e" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person-outline" size={18} color="#1a3e2e" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}









