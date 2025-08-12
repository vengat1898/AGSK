import { SessionContext } from "@/context/SessionContext"; // Adjust path as needed
import api from "@/services/api";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useContext, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import fallbackImg from "../../assets/images/fallback.png";
import headerImg from "../../assets/images/headerbackgroundimg.png";
import CustomDrawer from "./CustomDrawerContent"; // Adjust path as needed
import styles from "./Styles/homeStyles";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Home() {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]); // Store original order
  const [filteredProducts, setFilteredProducts] = useState([]); // Store filtered products
  const [quantities, setQuantities] = useState({});
  const [addedToCart, setAddedToCart] = useState({});
  const [imageError, setImageError] = useState({});
  const [isQuantityModalVisible, setIsQuantityModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [modalQuantity, setModalQuantity] = useState("");
  const [loadingProducts, setLoadingProducts] = useState({});
  const [showContinueButton, setShowContinueButton] = useState(false);
  
  // Search functionality state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  // Cart count state
  const [cartCount, setCartCount] = useState(0);
  const [loadingCartCount, setLoadingCartCount] = useState(false);
  
  // Sort functionality state
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [currentSort, setCurrentSort] = useState('default'); // 'default', 'price_low_high', 'price_high_low'

  // Custom Drawer State
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const router = useRouter();
  const { session, getUserMobile, getUserId, getUserName, getUserType } =
    useContext(SessionContext);

  // Search filter function
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setIsSearchActive(false);
      setFilteredProducts([]);
      return;
    }
    
    setIsSearchActive(true);
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      (product.size && product.size.toLowerCase().includes(query.toLowerCase())) ||
      (product.size_name && product.size_name.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredProducts(filtered);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setIsSearchActive(false);
    setFilteredProducts([]);
  };

  // Get current products to display (filtered or all)
  const getCurrentProducts = () => {
    return isSearchActive ? filteredProducts : products;
  };

  // function for user return show the same price and quantity
  const fetchCartItems = async () => {
    try {
      const mobile = await getUserMobile();
      const id = await getUserId();

      if (!mobile || !id) return;

      const response = await axios.get(
        "https://minsway.co.in/leaf/mb/Checkout/checkout",
        {
          params: {
            mobile: mobile,
            id: id,
          },
        }
      );

      if (response.data.success === 1 && Array.isArray(response.data.data)) {
        // Update quantities and addedToCart states
        const cartItems = response.data.data;
        const newQuantities = {};
        const newAddedToCart = {};

        cartItems.forEach(item => {
          newQuantities[item.product_id] = item.count.toString();
          newAddedToCart[item.product_id] = true;
        });

        setQuantities(newQuantities);
        setAddedToCart(newAddedToCart);
        
        // Show continue button if there are items
        setShowContinueButton(cartItems.length > 0);
      }
    } catch (error) {
      console.error("❌ Fetch Cart Items Error:", error);
    }
  };

  // Update the useFocusEffect to call fetchCartItems
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const mobile = await getUserMobile();
          const type = session.type;

          if (!mobile || !type) {
            Alert.alert("Error", "User info not found. Please register again.");
            router.replace("/components/Login");
            return;
          }

          console.log("🔄 Fetching products for:", { mobile, type });

          const response = await axios.get(
            "https://minsway.co.in/leaf/mb/Prod_fetch/fetch",
            {
              params: { mobile, type },
            }
          );

          if (response.data.success === 1) {
            setProducts(response.data.data);
            setOriginalProducts(response.data.data);
            // Reset search when new products are loaded
            setSearchQuery("");
            setIsSearchActive(false);
            setFilteredProducts([]);
          }

          // Fetch both cart count and cart items
          await Promise.all([fetchCartCount(), fetchCartItems()]);
        } catch (error) {
          console.log("❌ Product Fetch Error:", error);
        }
      };

      fetchData();
    }, [session])
  );

  // Fetch cart count function
  const fetchCartCount = async () => {
    try {
      setLoadingCartCount(true);
      const mobile = await getUserMobile();
      
      if (!mobile) {
        console.log("❌ No mobile number found for cart count");
        return;
      }

      console.log("🛒 Fetching cart count for mobile:", mobile);

      const response = await api.get("/Count/count", {
        params: { mobile }
      });

      console.log("🛒 Cart Count Response:", response.data);

      if (response.data.success === 1) {
        const count = parseInt(response.data.count || 0, 10);
        setCartCount(count);
        console.log("✅ Cart count updated:", count);
      } else {
        console.log("❌ Failed to fetch cart count:", response.data.message);
        setCartCount(0);
      }
    } catch (error) {
      console.error("❌ Cart Count Fetch Error:", error);
      setCartCount(0);
    } finally {
      setLoadingCartCount(false);
    }
  };

  const handleQuantityChange = (value, productId) => {
    setModalQuantity(value);
    setQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  // Calculate live price based on quantity
  const calculateLivePrice = (basePrice, quantity) => {
    if (!quantity || isNaN(quantity)) return basePrice;
    const qty = parseInt(quantity, 10);
    if (qty <= 0) return basePrice;
    return (parseFloat(basePrice) * qty).toFixed(2);
  };

  // Sort functionality - updated to work with current products
  const handleSort = (sortType) => {
    const currentData = isSearchActive ? filteredProducts : products;
    let sortedProducts = [...currentData];
    
    switch (sortType) {
      case 'price_low_high':
        sortedProducts.sort((a, b) => {
          const priceA = parseFloat(a.customer_price || a.price || 0);
          const priceB = parseFloat(b.customer_price || b.price || 0);
          return priceA - priceB;
        });
        break;
      case 'price_high_low':
        sortedProducts.sort((a, b) => {
          const priceA = parseFloat(a.customer_price || a.price || 0);
          const priceB = parseFloat(b.customer_price || b.price || 0);
          return priceB - priceA;
        });
        break;
      case 'default':
      default:
        if (isSearchActive) {
          // For search results, apply default sort to filtered results
          const filtered = originalProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.size && product.size.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (product.size_name && product.size_name.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          sortedProducts = filtered;
        } else {
          sortedProducts = [...originalProducts];
        }
        break;
    }
    
    if (isSearchActive) {
      setFilteredProducts(sortedProducts);
    } else {
      setProducts(sortedProducts);
    }
    
    setCurrentSort(sortType);
    setSortModalVisible(false);
  };

  const getSortButtonText = () => {
    switch (currentSort) {
      case 'price_low_high':
        return 'Price: Low to High';
      case 'price_high_low':
        return 'Price: High to Low';
      case 'default':
      default:
        return 'Sort';
    }
  };

  const addToCartApiCall = async (productId, detailId, count) => {
    setLoadingProducts((prev) => ({ ...prev, [productId]: true }));

    try {
      const mobile = await getUserMobile();

      console.log("🛒 Add to Cart Request:", {
        mobile,
        product_id: productId,
        product_detaild_id: detailId,
        count: count,
      });

      const response = await api.get("/Order/addtocart", {
        params: {
          mobile,
          product_id: productId,
          product_detaild_id: detailId,
          count: count,
        },
      });

      console.log("🛒 Add to Cart Response:", response.data);

      if (response.data.success === 1) {
        Alert.alert("Success", response.data.message || "Added to cart!");
        setShowContinueButton(true);
        
        // Refresh cart count after successful addition
        await fetchCartCount();
        
        return true;
      } else {
        Alert.alert("Error", response.data.message || "Failed to add to cart.");
        return false;
      }
    } catch (error) {
      console.error("❌ Add to Cart Error:", error);
      Alert.alert("Error", "Something went wrong while adding to cart.");
      return false;
    } finally {
      setLoadingProducts((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const removeItem = (item) => {
    Alert.alert(
      "Remove Item",
      `Are you sure you want to remove ${item.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", onPress: () => deleteCartItem(item.order_id) },
      ]
    );
  };

  const deleteCartItem = async (orderId) => {
    try {
      const sessionMobile = await getUserMobile();
      const sessionId = await getUserId();

      console.log(
        "\n=================== 🗑️ DELETE CART ITEM ==================="
      );
      console.log("Order ID to delete:", orderId);
      console.log("Current Session Mobile:", sessionMobile);
      console.log(
        "=========================================================\n"
      );

      if (!sessionMobile || !sessionId) {
        console.log("❌ Session validation failed during delete");
        Alert.alert("Session Expired", "Please login again");
        router.replace("/components/Login");
        return;
      }

      const response = await axios.get(
        "https://minsway.co.in/leaf/mb/Delete/delete",
        {
          params: {
            mobile: sessionMobile,
            delete: orderId,
          },
        }
      );

      console.log(
        "🗑️ Delete API Response:",
        JSON.stringify(response.data, null, 2)
      );

      if (response.data.success === 1) {
        console.log("✅ Item deleted successfully");
        
        // Show success notification
        Alert.alert(
          "Item Deleted", 
          "Item has been successfully removed from your cart",
          [{ text: "OK", style: "default" }]
        );
        
        // Refresh cart count after deletion
        await fetchCartCount();
        
        fetchCartData();
      } else {
        console.log("❌ Delete failed:", response.data.message);
        Alert.alert("Error", response.data.message || "Failed to delete item");
      }
    } catch (error) {
      console.error("❌ Delete Error:", error);
      Alert.alert(
        "Delete Failed", 
        "Something went wrong while removing the item. Please try again."
      );
    }
  };

  const handleAddToCartClick = async (item) => {
    if (addedToCart[item.product_id]) {
      // Handle removal from cart with confirmation
      Alert.alert(
        "Remove from Cart",
        `Are you sure you want to remove ${item.name} from your cart?`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Remove", 
            style: "destructive",
            onPress: async () => {
              console.log("🛒 Removing from cart:", item.product_id);

              setLoadingProducts((prev) => ({ ...prev, [item.product_id]: true }));

              try {
                const mobile = await getUserMobile();

                const response = await axios.get(
                  "https://minsway.co.in/leaf/mb/Delete/delete_sec",
                  {
                    params: {
                      mobile: mobile,
                      prod: item.product_id,
                    },
                  }
                );
                console.log("====================================");
                console.log(response);
                console.log("====================================");
                console.log("🗑️ Remove from Cart Response:", response.data);

                if (response.data.success === 1) {
                  // Update local state only after successful API call
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

                  // Check if cart is empty to hide continue button
                  const remainingItems = Object.keys(addedToCart).filter(
                    (id) => id !== item.product_id
                  );
                  if (remainingItems.length === 0) {
                    setShowContinueButton(false);
                  }

                  // Refresh cart count after removal
                  await fetchCartCount();

                  // Show success notification
                  Alert.alert(
                    "Removed Successfully", 
                    `${item.name} has been removed from your cart`,
                    [{ text: "OK", style: "default" }]
                  );
                } else {
                  Alert.alert(
                    "Error",
                    response.data.message || "Failed to remove from cart"
                  );
                }
              } catch (error) {
                console.error("❌ Remove from Cart Error:", error);
                Alert.alert(
                  "Remove Failed", 
                  "Something went wrong while removing the item. Please try again."
                );
              } finally {
                setLoadingProducts((prev) => ({ ...prev, [item.product_id]: false }));
              }
            }
          }
        ]
      );
    } else {
      // Show quantity modal for adding to cart (existing logic)
      setCurrentProduct(item);
      setModalQuantity(quantities[item.product_id] || "50"); // Default to minimum
      setIsQuantityModalVisible(true);
    }
  };

  const handleCartNavigation = async () => {
    try {
      const mobile = await getUserMobile();
      const id = await getUserId();
      const name = await getUserName();
      const type = await getUserType();

      console.log("🛒 Cart Navigation - Params:", {
        mobile,
        type,
        id,
        name,
      });

      if (!mobile || !id) {
        Alert.alert("Session Expired", "Please login again");
        router.replace("/components/Login");
        return;
      }

      router.replace({
        pathname: "/components/Cart",
        params: {
          mobile,
          type,
          id,
          name,
        },
      });
    } catch (error) {
      console.error("❌ Cart Navigation Error:", error);
      Alert.alert("Error", "Failed to navigate to cart.");
    }
  };

  const openDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  // Check if there are items in cart
  const hasItemsInCart = Object.keys(addedToCart).length > 0;

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={headerImg}
            style={styles.headerBackground}
            resizeMode="cover"
          />
          <View style={styles.headerContent}>
            <View style={styles.headerRow}>
              {/* Menu Button - Opens Custom Drawer */}
              <TouchableOpacity style={styles.iconWrapper} onPress={openDrawer}>
                <Feather name="menu" size={22} color="#fff" />
              </TouchableOpacity>

              <View style={styles.rightIcons}>
                <TouchableOpacity style={styles.iconWrapper}>
                  <Feather name="bell" size={20} color="#fff" />
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>1</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconWrapper}
                  onPress={handleCartNavigation}
                >
                  <Feather name="shopping-cart" size={20} color="#fff" />
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {loadingCartCount ? "..." : cartCount}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Enhanced Search Bar */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#999" />
              <TextInput
                placeholder="Search Leaf.."
                placeholderTextColor="#999"
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={handleSearch}
              />
              {isSearchActive && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearSearchButton}>
                  <Ionicons name="close" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Product list */}
        <ScrollView
          style={styles.body}
          contentContainerStyle={{
            paddingBottom: showContinueButton ? 140 : 80,
          }}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {isSearchActive 
                ? `Search Results (${filteredProducts.length})` 
                : "Banana leaf (Minimum 50)"
              }
            </Text>
            
            {/* Show search query if active */}
            {isSearchActive && (
              <Text style={styles.searchResultText}>
                Showing results for "{searchQuery}"
              </Text>
            )}
          </View>

          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => setSortModalVisible(true)}
          >
            <Text style={styles.sortText}>{getSortButtonText()}</Text>
            <AntDesign name="swap" size={20} color="#000" />
          </TouchableOpacity>

          {/* Show message if no search results */}
          {isSearchActive && filteredProducts.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search" size={48} color="#ccc" />
              <Text style={styles.noResultsText}>No products found</Text>
              <Text style={styles.noResultsSubtext}>
                Try searching with different keywords
              </Text>
              <TouchableOpacity onPress={clearSearch} style={styles.clearSearchLink}>
                <Text style={styles.clearSearchLinkText}>Clear search</Text>
              </TouchableOpacity>
            </View>
          )}

          {getCurrentProducts().map((item) => {
            const isInCart = addedToCart[item.product_id];
            const basePrice = item.customer_price || item.price || "0.00";
            const quantity = quantities[item.product_id] || "";
            const displayPrice = quantity
              ? calculateLivePrice(basePrice, quantity)
              : basePrice;

            return (
              <View key={item.product_id} style={styles.card}>
                <Image
                  source={
                    imageError[item.product_id]
                      ? fallbackImg
                      : { uri: item.image }
                  }
                  style={styles.productImage}
                  resizeMode="cover"
                  onError={() =>
                    setImageError((prev) => ({
                      ...prev,
                      [item.product_id]: true,
                    }))
                  }
                />
                <View style={styles.cardDetails}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productSize}>
                    Size: {item.size || item.size_name || "N/A"}
                  </Text>

                  {/* Price display with live calculation */}
                  <View style={styles.priceContainer}>
                    <Text style={styles.productPrice}>₹ {displayPrice}</Text>
                    {quantity && quantity !== "1" && (
                      <Text style={styles.unitPrice}>
                        (₹{basePrice} × {quantity})
                      </Text>
                    )}
                  </View>

                  {/* Quantity input if not in cart */}
                  {!isInCart && (
                    <View style={styles.quantityContainer}>
                      <Text style={styles.quantityLabel}>Quantity:</Text>
                      <TextInput
                        style={styles.quantityInput}
                        value={quantities[item.product_id] || ""}
                        onChangeText={(value) =>
                          handleQuantityChange(value, item.product_id)
                        }
                        placeholder="Min 50"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                      />
                    </View>
                  )}

                  <View style={styles.cartButton}>
                    <TouchableOpacity
                      onPress={() => handleAddToCartClick(item)}
                      style={[
                        isInCart
                          ? styles.removeFromCartBtn
                          : styles.addToCartBtn,
                        loadingProducts[item.product_id] && { opacity: 0.7 },
                      ]}
                      disabled={loadingProducts[item.product_id]}
                    >
                      {loadingProducts[item.product_id] ? (
                        <Text
                          style={
                            isInCart
                              ? styles.removeCartText
                              : styles.addCartText
                          }
                        >
                          {isInCart ? "Removing..." : "Adding..."}
                        </Text>
                      ) : (
                        <>
                          <Text
                            style={
                              isInCart
                                ? styles.removeCartText
                                : styles.addCartText
                            }
                          >
                            {isInCart ? "Remove from cart" : "Add to cart"}
                          </Text>
                          <Feather
                            name={isInCart ? "trash-2" : "shopping-cart"}
                            size={16}
                            color="#fff"
                            style={{ marginLeft: 6 }}
                          />
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {showContinueButton && hasItemsInCart && (
          <View style={styles.continueButtonContainer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleCartNavigation}
            >
              <Text style={styles.continueButtonText}>
                Continue to Cart ({cartCount} item{cartCount > 1 ? "s" : ""})
              </Text>
              <Feather
                name="arrow-right"
                size={20}
                color="#fff"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Sort Modal */}
        <Modal
          visible={sortModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setSortModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.sortModalContent}>
              <Text style={styles.modalTitle}>Sort Products</Text>
              
              <TouchableOpacity
                style={[
                  styles.sortOption,
                  currentSort === 'default' && styles.sortOptionSelected
                ]}
                onPress={() => handleSort('default')}
              >
                <Text style={[
                  styles.sortOptionText,
                  currentSort === 'default' && styles.sortOptionTextSelected
                ]}>
                  Default Order
                </Text>
                {currentSort === 'default' && (
                  <Feather name="check" size={18} color="#28a745" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sortOption,
                  currentSort === 'price_low_high' && styles.sortOptionSelected
                ]}
                onPress={() => handleSort('price_low_high')}
              >
                <Text style={[
                  styles.sortOptionText,
                  currentSort === 'price_low_high' && styles.sortOptionTextSelected
                ]}>
                  Price: Low to High
                </Text>
                {currentSort === 'price_low_high' && (
                  <Feather name="check" size={18} color="#28a745" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sortOption,
                  currentSort === 'price_high_low' && styles.sortOptionSelected
                ]}
                onPress={() => handleSort('price_high_low')}
              >
                <Text style={[
                  styles.sortOptionText,
                  currentSort === 'price_high_low' && styles.sortOptionTextSelected
                ]}>
                  Price: High to Low
                </Text>
                {currentSort === 'price_high_low' && (
                  <Feather name="check" size={18} color="#28a745" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sortModalClose}
                onPress={() => setSortModalVisible(false)}
              >
                <Text style={styles.sortModalCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Enhanced Quantity Modal */}
        <Modal
          visible={isQuantityModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsQuantityModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add to Cart</Text>
              {currentProduct && (
                <View style={styles.modalProductInfo}>
                  <Text style={styles.modalProductName}>
                    {currentProduct.name}
                  </Text>
                  <Text style={styles.modalProductSize}>
                    Size:{" "}
                    {currentProduct.size || currentProduct.size_name || "N/A"}
                  </Text>
                </View>
              )}

              <Text style={styles.quantityLabel}>
                Enter Quantity (Minimum 50):
              </Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                placeholder="e.g. 50"
                value={modalQuantity}
                onChangeText={(value) => setModalQuantity(value)}
                placeholderTextColor="#888"
              />

              {/* Live price display in modal */}
              {currentProduct &&
                modalQuantity &&
                !isNaN(modalQuantity) &&
                parseInt(modalQuantity) > 0 && (
                  <View style={styles.modalPriceInfo}>
                    <Text style={styles.modalPriceLabel}>Total Price:</Text>
                    <Text style={styles.modalPrice}>
                      ₹{" "}
                      {calculateLivePrice(
                        currentProduct.customer_price ||
                          currentProduct.price ||
                          "0.00",
                        modalQuantity
                      )}
                    </Text>
                    <Text style={styles.modalUnitPrice}>
                      (₹
                      {currentProduct.customer_price ||
                        currentProduct.price ||
                        "0.00"}{" "}
                      × {modalQuantity})
                    </Text>
                  </View>
                )}

              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={() => setIsQuantityModalVisible(false)}
                  style={styles.modalCancel}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    const qty = parseInt(modalQuantity, 10);
                    if (isNaN(qty) || qty <= 0) {
                      Alert.alert(
                        "Invalid input",
                        "Please enter a valid quantity"
                      );
                      return;
                    }

                    if (qty < 50) {
                      Alert.alert("Minimum Quantity", "Minimum quantity is 50");
                      return;
                    }

                    const detailId = currentProduct.price_id;
                    const productId = currentProduct.product_id;

                    console.log("🛒 Adding to Cart:", {
                      productId,
                      detailId,
                      count: qty,
                      productName: currentProduct.name,
                    });

                    if (detailId) {
                      const success = await addToCartApiCall(
                        productId,
                        detailId,
                        qty
                      );
                      if (success) {
                        setQuantities((prev) => ({
                          ...prev,
                          [productId]: modalQuantity,
                        }));
                        setAddedToCart((prev) => ({
                          ...prev,
                          [productId]: true,
                        }));
                        setIsQuantityModalVisible(false);
                      }
                    } else {
                      Alert.alert("Error", "Product details not found");
                    }
                  }}
                  style={styles.modalConfirm}
                >
                  <Text style={styles.modalButtonText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Custom Drawer */}
        <CustomDrawer isVisible={isDrawerVisible} onClose={closeDrawer} />

        {/* Bottom Navigation */}
        <View style={styles.footerSafeArea}>
          <View style={styles.footerNav}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => router.replace("components/Home")}
            >
              <Feather name="home" size={22} color="#28a745" />
              <Text style={styles.navLabel}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => router.replace("/components/enquiry-list")}
            >
              <Feather name="message-square" size={22} color="#555" />
              <Text style={styles.navLabel}>Enquiry</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => router.replace("/components/OrderList")}
            >
              <Feather name="list" size={22} color="#555" />
              <Text style={styles.navLabel}>My Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => router.replace("/components/profile-update")}
            >
              <Feather name="user" size={22} color="#555" />
              <Text style={styles.navLabel}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}