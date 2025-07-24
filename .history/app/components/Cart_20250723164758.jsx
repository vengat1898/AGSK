import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import fallbackImg from "../../assets/images/bananaleafOne.png";
import { SessionContext } from "../../context/SessionContext";
import styles from "./Styles/cartStyles";

export default function Cart() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [deliveryDateTime, setDeliveryDateTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState({});
  const [mobile, setMobile] = useState();
  const [id, setId] = useState();
  const [type, setType] = useState();
  // Get session data from context
  const { session, getUserMobile, getUserId, getUserName, getUserType } =
    useContext(SessionContext);

  useEffect(() => {
    const loadUserItems = async () => {
      setMobile(await getUserMobile());
      setId(await getUserId());
      setType(await getUserType());
    };
    loadUserItems();
  }, []);

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

      const sessionMobile = await getUserMobile();
      const sessionId = await getUserId();
      const sessionType = await getUserType();

      console.log(
        "\n=================== 🔍 FETCH CART DATA ==================="
      );
      console.log("Session Mobile:", sessionMobile);
      console.log("Session ID:", sessionId);
      console.log("Session Type:", sessionType);
      console.log(
        "=========================================================\n"
      );

      // Validate session data
      if (!sessionMobile || !sessionId) {
        console.log("❌ Session validation failed - missing user data");
        Alert.alert("Session Expired", "Please login again");
        router.replace("/components/login");
        return;
      }

      console.log(
        "🛒 Fetching cart for Mobile:",
        sessionMobile,
        "ID:",
        sessionId
      );

      const response = await axios.get(
        "https://minsway.co.in/leaf/mb/Checkout/checkout",
        {
          params: {
            mobile: sessionMobile,
            id: sessionId,
          },
        }
      );

      console.log(
        "\n=================== 📦 CART API RESPONSE ==================="
      );
      console.log("Response Status:", response.status);
      console.log("Response Data:", response.data);
      console.log(
        "=========================================================\n"
      );

      if (response.data.success === 1 && Array.isArray(response.data.data)) {
        setCartItems(response.data.data);
        console.log(
          "✅ Cart items set successfully. Count:",
          response.data.data.length
        );
      } else {
        setCartItems([]);
        console.log("⚠️ No cart items found or API returned error");
      }
    } catch (error) {
      console.error("❌ Fetch Cart Error:", error);
      console.error("Error Details:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to fetch cart");
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
        router.replace("/components/login");
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
        fetchCartData();
      } else {
        console.log("❌ Delete failed:", response.data.message);
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("❌ Delete Error:", error);
      Alert.alert("Error", "Failed to delete item");
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

  const proceedToCheckout = async () => {
    try {
      console.log(
        "\n=================== 🚀 PROCEED TO CHECKOUT ==================="
      );

      if (!mobile || !id) {
        console.log("❌ Session validation failed - user information missing");
        Alert.alert("Session Expired", "Please login again");
        router.replace("/components/login");
        return;
      }

      if (cartItems.length === 0) {
        console.log("❌ No items in cart");
        Alert.alert("Error", "No items in cart");
        return;
      }

      if (!deliveryDateTime) {
        console.log("❌ No delivery date selected");
        Alert.alert(
          "Select Delivery Date",
          "Please choose delivery date and time"
        );
        return;
      }

      console.log("📋 Current cart items:", cartItems.length);
      console.log("📅 Delivery date:", deliveryDateTime);
      console.log("👤 Session user info:", { mobile, id, type });

      const confirmOrderIds = cartItems.map((item) => item.order_id);
      console.log("📦 Order IDs to confirm:", confirmOrderIds);

      const firstItem = cartItems[0] || {};
      const product_id = firstItem.product_id || "";
      const product_detaild_id =
        firstItem.product_detaild_id || firstItem.product_detail_id || "";
      const count = firstItem.count || "";

      console.log("📦 First item data:", {
        product_id,
        product_detaild_id, 
        name: firstItem.name,
      });

      // Calculate total amount
      const totalAmount = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.count) || 0;
        return sum + price * quantity;
      }, 0);

      console.log("💰 Total amount calculated:", totalAmount);

      await AsyncStorage.setItem("delivery_date_time", deliveryDateTime);
      await AsyncStorage.setItem("total_amount", totalAmount.toString());

      const params = {
        mobile: mobile,
        id: id,
        delete_order: JSON.stringify([]),
        confirm_order: confirmOrderIds),
        order_date: deliveryDateTime,
      };

      console.log(
        "\n=================== 📡 CHECKOUT API PARAMS ==================="
      );
      console.log(JSON.stringify(params, null, 2));
      console.log(
        "===============================================================\n"
      );

      const response = await axios.get(
        "https://minsway.co.in/leaf/mb/Checkoutpay/checkoutpay",
        { params }
      );

      console.log(
        "\n=================== ✅ CHECKOUT API RESPONSE ==================="
      );
      console.log("Response Status:", response.status);
      console.log("Response Data:", JSON.stringify(response.data, null, 2));
      console.log(
        "================================================================\n"
      );

      if (response.data.success === 1) {
        console.log("✅ Checkout API call successful");

        // Prepare checkout navigation params - use session data
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

        console.log(
          "\n=================== 🧭 NAVIGATION PARAMS ==================="
        );
        console.log(JSON.stringify(checkoutParams, null, 2));
        console.log(
          "=============================================================\n"
        );

        Alert.alert("Success", response.data.message || "Checkout successful", [
          {
            text: "OK",
            onPress: () => {
              console.log("🧭 Navigating to checkout page...");
              router.push({
                pathname: "/components/Checkout",
                params: checkoutParams,
              });
            },
          },
        ]);
      } else {
        console.log("❌ Checkout failed:", response.data.message);
        Alert.alert("Failed", response.data.message || "Checkout failed");
      }
    } catch (error) {
      console.error("❌ Checkout API Error:", error);
      console.error("Error Details:", error.response?.data || error.message);
      Alert.alert("Error", "Something went wrong during checkout.");
    }
  };

  const renderItem = ({ item }) => {
    const itemTotal =
      (parseFloat(item.price) || 0) * (parseInt(item.count) || 0);

    return (
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

          <View style={{ marginTop: 6 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.quantityText}>
                {`${item.count} leaf × ₹${item.price}`}
              </Text>
              <Text style={styles.itemTotalText}>₹{itemTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeItem(item)}
          activeOpacity={0.7}
        >
          <Feather name="trash-2" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    );
  };
  const EmptyCartComponent = () => (
    <View style={styles.emptyContainer}>
      <Feather name="shopping-cart" size={48} color="#d1d5db" />
      <Text style={styles.emptyText}>No items in cart.</Text>
    </View>
  );
  // Early return if session is invalid
  if (!mobile || !id) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Session expired. Please login again.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/components/Home")}>
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CART</Text>
        </View>
      </SafeAreaView>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="green"
          style={{ marginTop: 40 }}
        />
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) =>
              item.order_id?.toString() || Math.random().toString()
            }
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={<EmptyCartComponent />}
          />

          <TouchableOpacity
            style={styles.dateTimeSelector}
            onPress={showDatePicker}
          >
            <View style={styles.dateTimeWrapper}>
              <Ionicons name="calendar-outline" size={20} color="#333" />
              <Text style={styles.dateTimeText}>
                {deliveryDateTime || "Choose delivery date and time"}
              </Text>
              <AntDesign
                name="down"
                size={14}
                color="green"
                style={{ marginLeft: "auto" }}
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
