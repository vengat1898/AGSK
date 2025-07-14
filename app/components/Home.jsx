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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    const cleanedPath = imagePath.replace(/^\/+/, '').replace(/\\/g, '/');
    return `https://minsway.co.in/${cleanedPath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedMobile = await AsyncStorage.getItem('customerMobile');
        const storedType = await AsyncStorage.getItem('type');
        const storedName = await AsyncStorage.getItem('customerName');

        if (!storedMobile || !storedType) {
          Alert.alert('Error', 'User info not found. Please register again.');
          return;
        }

        setMobile(storedMobile);
        setType(storedType);
        if (storedName) setName(storedName);

        const response = await axios.get('https://minsway.co.in/leaf/mb/Prod_fetch/fetch', {
          params: {
            mobile: storedMobile,
            type: storedType,
          },
        });

        if (response.data.success === 1) {
          setProducts(response.data.data);
        } else {
          Alert.alert('Error', response.data.message || 'Failed to fetch products.');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Something went wrong while fetching products.');
      }
    };

    fetchData();
  }, []);

  const toggleInput = (id) => {
    setSelectedProductId((prev) => (prev === id ? null : id));
  };

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const getPriceByType = (item) => {
    if (type === '1') return `₹ ${item.customer_price}/${item.size} Pieces`;
    if (type === '2') return `₹ ${item.hotel_price}/${item.size} Pieces`;
    if (type === '3') return `₹ ${item.catering_service}/${item.size} Pieces`;
    return '';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={headerImg} style={styles.headerBackground} resizeMode="cover" />
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.userText}>Mr.{paramName || name || mobile}</Text>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconWrapper}>
              <Feather name="bell" size={20} color="#fff" />
              <View style={styles.badge}><Text style={styles.badgeText}>1</Text></View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconWrapper}
              onPress={() => router.push('/components/Cart')}
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

        {products.map((item) => (
          <View key={item.product_id} style={styles.card}>
            <Image
              source={
                imageError[item.product_id]
                  ? fallbackImg
                  : { uri: getImageUrl(item.image) }
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
                  onPress={() =>
                    setAddedToCart((prev) => ({
                      ...prev,
                      [item.product_id]: true,
                    }))
                  }
                >
                  <Text style={styles.cartText}>Add to cart</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => toggleInput(item.product_id)}
                  style={styles.arrowCircle}
                >
                  <AntDesign name="down" size={14} color="green" />
                </TouchableOpacity>
              </View>

              {selectedProductId === item.product_id && (
                <TextInput
                  style={styles.inputBelowCard}
                  placeholder="Enter total number of leaf ex -100"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={quantities[item.product_id] || ''}
                  onChangeText={(value) => handleQuantityChange(item.product_id, value)}
                />
              )}
            </View>

            {addedToCart[item.product_id] && (
              <AntDesign name="checkcircle" size={20} color="green" style={styles.tickIcon} />
            )}
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













