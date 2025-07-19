import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import headerImg from '../../assets/images/headerbackgroundimg.png';
import fallbackImg from '../../assets/images/fallback.png';
import styles from './Styles/homeStyles';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [addedToCart, setAddedToCart] = useState({});
  const [mobile, setMobile] = useState('');
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [imageError, setImageError] = useState({});

  const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [modalQuantity, setModalQuantity] = useState('');

  const router = useRouter();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const storedMobile = await AsyncStorage.getItem('customerMobile');
          const storedType = await AsyncStorage.getItem('type');
          const storedName = await AsyncStorage.getItem('customerName');
          const storedId = await AsyncStorage.getItem('customerId');

          if (!storedMobile || !storedType || !storedId) {
            Alert.alert('Error', 'User info not found. Please register again.');
            return;
          }

          setMobile(storedMobile);
          setType(storedType);
          setCustomerId(storedId);
          setName(storedName || '');

          const response = await axios.get('https://minsway.co.in/leaf/mb/Prod_fetch/fetch', {
            params: { mobile: storedMobile, type: storedType },
          });

          if (response.data.success === 1) {
            setProducts(response.data.data);
          } else {
            Alert.alert('Error', response.data.message || 'Failed to fetch products.');
          }
        } catch (error) {
          console.error('❌ Product Fetch Error:', error);
        }
      };

      fetchData();
    }, [])
  );

  const handleQuantityChange = (value) => {
    setModalQuantity(value);
  };

  const addToCartApiCall = async (productId, detailId, count) => {
    try {
      console.log('🛒 Add to Cart Request:', {
        mobile,
        product_id: productId,
        product_detaild_id: detailId,
        count: count,
      });

      const response = await axios.get('https://minsway.co.in/leaf/mb/Order/addtocart', {
        params: {
          mobile,
          product_id: productId,
          product_detaild_id: detailId,
          count: count,
        },
      });

      console.log('🛒 Add to Cart Response:', response.data);
      console.log('🛒 Full Response Object:', response);

      if (response.data.success === 1) {
        Alert.alert('Success', response.data.message || 'Added to cart!');
        return true;
      } else {
        Alert.alert('Error', response.data.message || 'Failed to add to cart.');
        return false;
      }
    } catch (error) {
      console.error('❌ Add to Cart Error:', error);
      console.error('❌ Error Details:', error.response?.data || error.message);
      Alert.alert('Error', 'Something went wrong while adding to cart.');
      return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={headerImg} style={styles.headerBackground} resizeMode="cover" />
        <View style={styles.headerContent}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.iconWrapper} onPress={() => navigation.openDrawer()}>
              <Feather name="menu" size={22} color="#fff" />
            </TouchableOpacity>

            <View style={styles.rightIcons}>
              <TouchableOpacity style={styles.iconWrapper}>
                <Feather name="bell" size={20} color="#fff" />
                <View style={styles.badge}><Text style={styles.badgeText}>1</Text></View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconWrapper}
                onPress={async () => {
                  const currentMobile = await AsyncStorage.getItem('customerMobile');
                  const currentId = await AsyncStorage.getItem('customerId');
                  const currentType = await AsyncStorage.getItem('type');
                  const currentName = await AsyncStorage.getItem('customerName');

                  console.log('🛒 Cart Navigation - Params:', {
                    mobile: currentMobile,
                    type: currentType,
                    id: currentId,
                    name: currentName,
                  });

                  if (!currentMobile || !currentId) {
                    Alert.alert('Session Expired', 'Please login again');
                    router.replace('/components/Login');
                    return;
                  }

                  router.push({
                    pathname: '/components/Cart',
                    params: {
                      mobile: currentMobile,
                      type: currentType,
                      id: currentId,
                      name: currentName,
                    },
                  });
                }}
              >
                <Feather name="shopping-cart" size={20} color="#fff" />
                <View style={styles.badge}><Text style={styles.badgeText}>0</Text></View>
              </TouchableOpacity>
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

      {/* Product list */}
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 80 }}>
        <Text style={styles.sectionTitle}>Banana leaf (Minimum 50)</Text>

        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortText}>sort</Text>
          <AntDesign name="swap" size={20} color="#000" />
        </TouchableOpacity>

        {products.map((item) => {
          const isInCart = addedToCart[item.product_id];
          return (
            <View key={item.product_id} style={styles.card}>
              <Image
                source={imageError[item.product_id] ? fallbackImg : { uri: item.image }}
                style={styles.productImage}
                resizeMode="cover"
                onError={() => setImageError((prev) => ({ ...prev, [item.product_id]: true }))}
              />
              <View style={styles.cardDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productSize}>Size: {item.size || item.size_name || 'N/A'}</Text>
                <Text style={styles.productPrice}>₹ {item.customer_price || item.price || '0.00'}</Text>

                <View style={styles.cartButton}>
                  <TouchableOpacity
                    onPress={async () => {
                      const count = parseInt(quantities[item.product_id], 10);
                      const detailId = item.price_id;
                      const productId = item.product_id;

                      console.log('🛒 Cart Button Pressed:', {
                        productId,
                        detailId,
                        count,
                        isInCart,
                        productName: item.name,
                      });

                      if (isInCart) {
                        console.log('🛒 Removing from cart:', productId);
                        setAddedToCart((prev) => {
                          const newCart = { ...prev };
                          delete newCart[productId];
                          return newCart;
                        });
                        setQuantities((prev) => {
                          const newQuantities = { ...prev };
                          delete newQuantities[productId];
                          return newQuantities;
                        });
                      } else {
                        if (!isNaN(count) && count > 0 && detailId) {
                          const success = await addToCartApiCall(productId, detailId, count);
                          if (success) {
                            console.log('🛒 Successfully added to cart:', productId);
                            setAddedToCart((prev) => ({ ...prev, [productId]: true }));
                          } else {
                            console.log('🛒 Failed to add to cart:', productId);
                          }
                        } else {
                          console.log('🛒 Invalid quantity or detail ID:', { count, detailId });
                          Alert.alert('Invalid Quantity', 'Please enter a valid number.');
                        }
                      }
                    }}
                  >
                    <Text style={styles.cartText}>{isInCart ? 'Remove' : 'Add to cart'}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setCurrentProduct(item);
                      setModalQuantity(quantities[item.product_id] || '');
                      setIsQuantityModalVisible(true);
                    }}
                    style={styles.arrowCircle}
                  >
                    <AntDesign name="down" size={14} color="green" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Quantity Modal */}
      <Modal
        visible={isQuantityModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsQuantityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Quantity</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              placeholder="e.g. 50"
              value={modalQuantity}
              onChangeText={handleQuantityChange}
              placeholderTextColor="#888"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setIsQuantityModalVisible(false)}
                style={styles.modalCancel}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (!isNaN(modalQuantity) && parseInt(modalQuantity) > 0) {
                    console.log('🛒 Quantity Set:', {
                      productId: currentProduct.product_id,
                      quantity: modalQuantity,
                      productName: currentProduct.name,
                    });
                    setQuantities((prev) => ({
                      ...prev,
                      [currentProduct.product_id]: modalQuantity,
                    }));
                    setIsQuantityModalVisible(false);
                  } else {
                    Alert.alert('Invalid input', 'Enter a valid number');
                  }
                }}
                style={styles.modalConfirm}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <SafeAreaView style={styles.footerSafeArea}>
        <View style={styles.footerNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/Home')}>
            <Feather name="home" size={22} color="#28a745" />
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/components/Enquiry')}>
            <Feather name="message-square" size={22} color="#555" />
            <Text style={styles.navLabel}>Enquiry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/components/MyOrder')}>
            <Feather name="list" size={22} color="#555" />
            <Text style={styles.navLabel}>My Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/components/Profile')}>
            <Feather name="user" size={22} color="#555" />
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}




