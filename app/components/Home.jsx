import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';

import headerImg from '../../assets/images/headerbackgroundimg.png';
import fallbackImg from '../../assets/images/fallback.png';
import styles from './Styles/homeStyles';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [addedToCart, setAddedToCart] = useState({});
  const [mobile, setMobile] = useState('');
  const [type, setType] = useState('');
  const [imageError, setImageError] = useState({});
  const [name, setName] = useState('');

  const { name: paramName } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedMobile = await AsyncStorage.getItem('customerMobile');
        const storedType = await AsyncStorage.getItem('type');
        const storedName = await AsyncStorage.getItem('customerName');

        console.log('📱 Retrieved mobile from AsyncStorage:', storedMobile);
        console.log('🆔 Retrieved type from AsyncStorage:', storedType);
        console.log('🙍‍♂️ Retrieved name from AsyncStorage:', storedName);

        if (!storedMobile || !storedType) {
          Alert.alert('Error', 'User info not found. Please register again.');
          return;
        }

        setMobile(storedMobile);
        setType(storedType);
        if (storedName) setName(storedName);

        const response = await axios.get('https://minsway.co.in/leaf/mb/Prod_fetch/fetch', {
          params: { mobile: storedMobile, type: storedType },
        });

        console.log('📦 Product Fetch Response:', response.data);

        if (response.data.success === 1) {
          setProducts(response.data.data);
        } else {
          Alert.alert('Error', response.data.message || 'Failed to fetch products.');
        }
      } catch (error) {
        console.error('❌ Product Fetch Error:', error);
        Alert.alert('Error', 'Something went wrong while fetching products.');
      }
    };

    fetchData();
  }, []);

  const toggleInput = (id) => {
    setSelectedProductId((prev) => {
      const isDeselecting = prev === id;
      if (isDeselecting) {
        setQuantities((prevQuantities) => {
          const newQuantities = { ...prevQuantities };
          delete newQuantities[id];
          return newQuantities;
        });
        setAddedToCart((prevCart) => {
          const newCart = { ...prevCart };
          delete newCart[id];
          return newCart;
        });
      }
      return isDeselecting ? null : id;
    });
  };

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const getPriceByType = (item) => {
    if (type === '1') return `₹ ${item.customer_price}/${item.size} Pieces`;
    if (type === '2') return `₹ ${item.hotel_price}/${item.size} Pieces`;
    if (type === '3') return `₹ ${item.catering_service}/${item.size} Pieces`;
    return '';
  };

  const addToCartApiCall = async (productId, detailId, count) => {
    try {
      const storedMobile = await AsyncStorage.getItem('customerMobile');

      console.log('🛒 Adding to cart with:');
      console.log('   - Mobile:', storedMobile);
      console.log('   - Product ID:', productId);
      console.log('   - Detail ID:', detailId);
      console.log('   - Count:', count);

      const response = await axios.get('https://minsway.co.in/leaf/mb/Order/addtocart', {
        params: {
          mobile: storedMobile,
          product_id: productId,
          product_detaild_id: detailId,
          count: count,
        },
      });

      console.log('✅ Add to Cart API Response:', response.data);

      if (response.data.success === 1) {
        Alert.alert('Success', response.data.message || 'Added to cart!');
        return true;
      } else {
        Alert.alert('Error', response.data.message || 'Failed to add to cart.');
        return false;
      }
    } catch (error) {
      console.error('❌ Add to Cart Error:', error);
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
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.userText}>Mr. {paramName || name || mobile}</Text>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconWrapper}>
              <Feather name="bell" size={20} color="#fff" />
              <View style={styles.badge}><Text style={styles.badgeText}>1</Text></View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconWrapper}
              onPress={() => {
                console.log('🛒 Navigating to Cart with mobile:', mobile);
                router.push({
                  pathname: '/components/Cart',
                  params: { mobile },
                });
              }}
            >
              <Feather name="shopping-cart" size={20} color="#fff" />
              <View style={styles.badge}><Text style={styles.badgeText}>0</Text></View>
            </TouchableOpacity>
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

      {/* Product List */}
      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 20 }}>
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
                source={
                  imageError[item.product_id]
                    ? fallbackImg
                    : { uri: `https://minsway.co.in/${item.image.replace(/^\/+/, '').replace(/\\/g, '/')}` }
                }
                style={styles.productImage}
                resizeMode="contain"
                onError={() =>
                  setImageError((prev) => ({ ...prev, [item.product_id]: true }))
                }
              />
              <View style={styles.cardDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{getPriceByType(item)}</Text>

                <View style={styles.cartButton}>
                  <TouchableOpacity
                    onPress={async () => {
                      if (isInCart) {
                        setAddedToCart((prev) => {
                          const newCart = { ...prev };
                          delete newCart[item.product_id];
                          return newCart;
                        });
                        setQuantities((prev) => {
                          const newQuantities = { ...prev };
                          delete newQuantities[item.product_id];
                          return newQuantities;
                        });
                        setSelectedProductId(null);
                      } else {
                        const quantity = quantities[item.product_id];
                        const count = parseInt(quantity, 10);
                        const detailId = item.price_id;

                        if (!isNaN(count) && count > 0 && detailId) {
                          const success = await addToCartApiCall(
                            item.product_id,
                            detailId,
                            count
                          );

                          if (success) {
                            setAddedToCart((prev) => ({
                              ...prev,
                              [item.product_id]: true,
                            }));
                            setSelectedProductId(null);
                          }
                        } else {
                          Alert.alert('Invalid Quantity', 'Please enter a valid number.');
                        }
                      }
                    }}
                  >
                    <Text style={styles.cartText}>
                      {isInCart ? 'Remove' : 'Add to cart'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => toggleInput(item.product_id)}
                    style={styles.arrowCircle}
                  >
                    <AntDesign
                      name={selectedProductId === item.product_id ? 'up' : 'down'}
                      size={14}
                      color="green"
                    />
                  </TouchableOpacity>
                </View>

                {selectedProductId === item.product_id && (
                  <TextInput
                    style={styles.inputBelowCard}
                    placeholder="Enter quantity"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={quantities[item.product_id] || ''}
                    onChangeText={(value) => handleQuantityChange(item.product_id, value)}
                  />
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}



















