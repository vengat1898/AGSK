import api from "@/services/api";
import { Feather, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SessionContext } from "../../context/SessionContext";
import styles from "./Styles/checkoutStyles";

export default function Checkout() {
  const router = useRouter();
  const {
    deliveryDateTime,
    type,
    mobile,
    id,
    product_id,
    product_detaild_id,
    count,
    confirmOrder,
  } = useLocalSearchParams();

  const [showEnquiryFlow, setShowEnquiryFlow] = useState(false);
  const [message, setMessage] = useState("");
  const [pincodes, setPincodes] = useState([]);
  const [selectedPincode, setSelectedPincode] = useState(null);
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [userDetails, setUserDetails] = useState({});
  const [storedMobile, setStoredMobile] = useState("");
  const [storedId, setStoredId] = useState("");
  const [userType, setUserType] = useState("");
  const [productDetails, setProductDetails] = useState([]);

  const [isCouponModalVisible, setIsCouponModalVisible] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  // Enhanced address editing state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);

  // Payment type selection state
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { session, getUserMobile, getUserId, getUserName, getUserType } =
    useContext(SessionContext);

  const [discount, setDiscount] = useState(0);

  const paymentTypes = [
    { id: "online", label: "Pay Online", icon: "card-outline" },
    { id: "cod", label: "Cash on Delivery", icon: "cash-outline" },
  ];

  useEffect(() => {
    console.log("\n========== 🛒 Checkout Params Received ==========");
    console.log("🕒 Delivery DateTime:", deliveryDateTime);
    console.log("📱 Mobile:", mobile);
    console.log("🧾 ID:", id);
    console.log("📄 Type:", type);
    console.log("📦 Product ID:", product_id);
    console.log("🔍 Product Detail ID:", product_detaild_id);
    console.log("🔢 Count:", count);
    console.log("📝 Confirm Order:", confirmOrder);
    console.log("=================================================\n");
  }, []);

  // coupon

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const mobile = await getUserMobile();
        if (!mobile) return;

        const response = await api.get(`/Discount/discount_fetch?`, {
          params: { mobile },
        });
        console.log("====================================discount_fetch");
        console.log(response.data);
        console.log("====================================");
        if (response.data.success === 1) {
          const formattedCoupons = response.data.offers.map((offer) => ({
            id: offer.id,
            code: offer.offer_code,
            description: `Get ₹${offer.amount} off`,
            discount: parseFloat(offer.amount),
            minOrder: offer.min_order ? parseFloat(offer.min_order) : 0,
            validFrom: offer.starting_date,
            validTo: offer.ending_date,
            isActive: offer.status === "1",
          }));
          setAvailableCoupons(formattedCoupons);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
        Alert.alert(
          "Notice",
          "Couldn't load coupons. You can still proceed with your order."
        );
      }
    };

    fetchCoupons();
  }, []);

  const handleApplyCoupon = () => {
    if (!selectedCoupon) return;

    // Check if coupon is active
    if (!selectedCoupon.isActive) {
      Alert.alert("Coupon Expired", "This coupon is no longer valid.");
      return;
    }

    // Check minimum order amount
    if (subtotal < selectedCoupon.minOrder) {
      Alert.alert(
        "Minimum Order Required",
        `This coupon requires a minimum order of ₹${selectedCoupon.minOrder}`
      );
      return;
    }

    // Check coupon validity dates
    const today = new Date();
    const validFrom = new Date(selectedCoupon.validFrom);
    const validTo = new Date(selectedCoupon.validTo);

    if (today < validFrom) {
      Alert.alert(
        "Coupon Not Yet Valid",
        `This coupon will be valid from ${validFrom.toLocaleDateString()}`
      );
      return;
    }

    if (today > validTo) {
      Alert.alert(
        "Coupon Expired",
        `This coupon expired on ${validTo.toLocaleDateString()}`
      );
      return;
    }

    // If all checks pass, apply the discount
    setDiscount(selectedCoupon.discount);
    Alert.alert(
      "Coupon Applied",
      `${selectedCoupon.code} - ₹${selectedCoupon.discount} discount applied!`
    );
    setIsCouponModalVisible(false);
  };

  useEffect(() => {
    const fetchInvoiceAndUser = async () => {
      try {
        const mobile = await getUserMobile();
        const id = await getUserId();
        const userType = await getUserType();
        setUserType(userType);
        if (!mobile || !id) return;

        setStoredMobile(mobile);
        setStoredId(id);

        const response = await axios.get(
          "https://minsway.co.in/leaf/mb/Orderplace/Orderplace",
          { params: { mobile } }
        );
        console.log("====================================Orderplace");
        console.log(response.data);
        console.log("====================================");
        if (response.data.success === 1) {
          setSubtotal(response.data.total_price || 0);
          setUserDetails(response.data.data || {});
          setProductDetails(response.data.product_details || []);
          // Pre-fill address in edit modal
          setNewAddress(response.data.data?.address || "");
        }
      } catch (error) {
        console.error("❌ Error fetching invoice and user details:", error);
      }
    };

    fetchInvoiceAndUser();
  }, []);

  useEffect(() => {
    const fetchAllPincodes = async () => {
      try {
        setPincodeLoading(true);
        const response = await axios.get(
          "https://minsway.co.in/leaf/mb/Pincode/all_pincodes"
        );
        console.log("====================================");
        console.log(response.data);
        console.log("====================================");
        if (response.data.success === 1) {
          setPincodes(response.data.data);
        }
      } catch (error) {
        console.error("❌ Pincode Fetch Error:", error);
      } finally {
        setPincodeLoading(false);
      }
    };

    fetchAllPincodes();
  }, []);

  const handleFinalCheckout = async () => {
    try {
      const order_date = new Date().toISOString().split("T")[0];
      const deliveryCharge = selectedPincode
        ? parseInt(selectedPincode.price)
        : 40;
      const taxes = 0;
      const total = subtotal + deliveryCharge + taxes - discount;

      const params = {
        order_date,
        mobile: storedMobile,
        orginal_price: subtotal,
        delivery: deliveryCharge,
        discount,
        total_price: total,
        address: userDetails.address,
        second_mobile: storedMobile,
        payment_type: "cod",
        pincode: selectedPincode?.pincode || "",
        order_date,
        delivery_date: deliveryDateTime,
        type,
        order_id: "[" + confirmOrder + "]",
      };

      // Only include coupon code if one is applied
      if (selectedCoupon) {
        params.offer_code = selectedCoupon.code;
      }

      const response = await axios.get(
        "https://minsway.co.in/leaf/mb/Finalplaceorder/final_update",
        { params }
      );

      if (response.data.success === 1) {
        const { weburl, order_id, order_number } = response.data.data;
        Alert.alert(
          "Order Confirmed",
          "Your order has been placed successfully!",
          [
            {
              text: "View Invoice",
              onPress: () => {
                router.replace({
                  pathname: "/components/Invoice",
                  params: {
                    weburl: weburl,
                    order_id: order_id,
                    mobile: storedMobile,
                    type: type,
                    id: storedId,
                    order_number: order_number,
                  },
                });
              },
            },
            {
              text: "Go to Order Details",
              style: "cancel",
              onPress: () => router.replace("/components/OrderList"),
            },
          ]
        );
      } else {
        Alert.alert("Error", response.data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Final checkout error:", error);
      Alert.alert("Error", "Failed to place order. Please try again.");
    }
  };
  useEffect(() => {
    console.log("\n========== 📅 Date Comparison Logic ==========");
    console.log("Delivery DateTime param:", deliveryDateTime);

    if (!deliveryDateTime) {
      console.log("❌ No delivery date provided");
      setShowEnquiryFlow(false);
      return;
    }

    try {
      const deliveryDate = parseDeliveryDate(deliveryDateTime);

      if (!deliveryDate) {
        console.log(
          "❌ Failed to parse delivery date, defaulting to checkout flow"
        );
        setShowEnquiryFlow(false);
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const compareDate = new Date(deliveryDate);
      compareDate.setHours(0, 0, 0, 0);

      const fiveDaysLater = new Date(today);
      fiveDaysLater.setDate(today.getDate() + 5);

      const daysDifference = Math.ceil(
        (compareDate - today) / (1000 * 60 * 60 * 24)
      );

      console.log("📊 Date Comparison Details:");
      console.log("Today (midnight):", today.toISOString());
      console.log("Delivery Date (midnight):", compareDate.toISOString());
      console.log("Five Days Later:", fiveDaysLater.toISOString());
      console.log("Days difference:", daysDifference);

      const shouldShowEnquiry = compareDate > fiveDaysLater;

      console.log("🎯 Should show enquiry flow:", shouldShowEnquiry);
      console.log(
        "Logic: compareDate > fiveDaysLater =",
        compareDate.getTime(),
        ">",
        fiveDaysLater.getTime()
      );

      setShowEnquiryFlow(shouldShowEnquiry);
    } catch (error) {
      console.error("❌ Error in date comparison useEffect:", error);
      console.error("Stack trace:", error.stack);
      // Default to checkout flow on error
      setShowEnquiryFlow(false);
    }

    console.log("===============================================\n");
  }, [deliveryDateTime]);

  const safeDateComparison = (deliveryDateTime) => {
    if (!deliveryDateTime) return false;

    try {
      const dateStr = deliveryDateTime.split(",")[0];
      const [day, month, year] = dateStr
        .split("/")
        .map((num) => parseInt(num, 10));

      if (!day || !month || !year) return false;

      const deliveryDate = new Date(year, month - 1, day);
      const today = new Date();
      const fiveDaysFromNow = new Date(
        today.getTime() + 5 * 24 * 60 * 60 * 1000
      );

      return deliveryDate > fiveDaysFromNow;
    } catch (error) {
      console.error("Safe date comparison failed:", error);
      return false;
    }
  };

  const parseDeliveryDate = (dateString) => {
    if (!dateString) {
      console.log("❌ No delivery date string provided");
      return null;
    }

    console.log("🔍 Parsing delivery date:", dateString);

    try {
      let parsedDate = null;

      if (dateString.includes(",")) {
        const [datePart, timePart] = dateString.split(", ");
        const [day, month, year] = datePart.split("/");

        if (timePart) {
          const [hours, minutes, seconds] = timePart.split(":");
          parsedDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hours),
            parseInt(minutes),
            parseInt(seconds) || 0
          );
        } else {
          parsedDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
          );
        }
      } else if (dateString.includes("/")) {
        const [day, month, year] = dateString.split("/");
        parsedDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );
      } else {
        parsedDate = new Date(dateString);
      }

      if (isNaN(parsedDate.getTime())) {
        console.log("❌ Invalid date parsed:", parsedDate);
        return null;
      }

      console.log("✅ Successfully parsed date:", parsedDate);
      return parsedDate;
    } catch (error) {
      console.error("❌ Error parsing delivery date:", error);
      console.error("Original date string:", dateString);
      return null;
    }
  };

  useEffect(() => {
    console.log("\n========== 📅 Date Comparison Logic ==========");
    console.log("Delivery DateTime param:", deliveryDateTime);

    if (!deliveryDateTime) {
      console.log("❌ No delivery date provided");
      setShowEnquiryFlow(false);
      return;
    }

    // Use setTimeout to prevent blocking UI on low-end devices
    const processDateComparison = () => {
      try {
        const deliveryDate = parseDeliveryDate(deliveryDateTime);

        if (!deliveryDate) {
          console.log("❌ Primary parsing failed, trying fallback method");
          const fallbackResult = safeDateComparison(deliveryDateTime);
          setShowEnquiryFlow(fallbackResult);
          return;
        }

        // Create today's date at midnight for accurate comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Create comparison date at midnight
        const compareDate = new Date(deliveryDate);
        compareDate.setHours(0, 0, 0, 0);

        // Calculate 5 days from today
        const fiveDaysLater = new Date(today);
        fiveDaysLater.setDate(today.getDate() + 5);

        // Calculate difference in days for debugging
        const daysDifference = Math.ceil(
          (compareDate - today) / (1000 * 60 * 60 * 24)
        );

        console.log("📊 Date Comparison Details:");
        console.log("Today (midnight):", today.toISOString());
        console.log("Delivery Date (midnight):", compareDate.toISOString());
        console.log("Five Days Later:", fiveDaysLater.toISOString());
        console.log("Days difference:", daysDifference);

        // Check if delivery is more than 5 days away
        const shouldShowEnquiry = compareDate > fiveDaysLater;

        console.log("🎯 Should show enquiry flow:", shouldShowEnquiry);
        console.log(
          "Logic: compareDate > fiveDaysLater =",
          compareDate.getTime(),
          ">",
          fiveDaysLater.getTime()
        );

        setShowEnquiryFlow(shouldShowEnquiry);
      } catch (error) {
        console.error("❌ Error in date comparison:", error);
        // Try fallback method
        const fallbackResult = safeDateComparison(deliveryDateTime);
        setShowEnquiryFlow(fallbackResult);
      }

      console.log("===============================================\n");
    };

    // Use setTimeout to prevent blocking on low-end devices
    setTimeout(processDateComparison, 10);
  }, [deliveryDateTime]);
  const handleProceed = () => {
    if (!selectedPincode) {
      Alert.alert("Select Pincode", "Please choose a delivery pincode.");
      return;
    }
    if (!deliveryDateTime) {
      Alert.alert("Missing Date", "Delivery date is required.");
      return;
    }
    if (!selectedPaymentType) {
      Alert.alert("Select Payment", "Please choose a payment method.");
      return;
    }

    if (selectedPaymentType === "online") {
      if (!storedMobile || !storedId) {
        Alert.alert("Error", "User session not available");
        return;
      }

      const deliveryCharge = selectedPincode
        ? parseInt(selectedPincode.price)
        : 40;
      const total = subtotal + deliveryCharge;
      const order_date = new Date().toISOString().split("T")[0];

      router.replace({
        pathname: "/components/PayOnline",
        params: {
          user_id: storedId,
          mobile: storedMobile,
          address: userDetails.address,
          original_price: subtotal,
          delivery_charge: deliveryCharge,
          total_price: total,
          delivery_date: deliveryDateTime,
          order_date,
          type,
          pincode: selectedPincode?.pincode || "",
          pincode_city: selectedPincode?.city || "",
          pincode_price: selectedPincode?.price || 0,
          confirmOrder,
        },
      });
    } else if (selectedPaymentType === "cod") {
      handleFinalCheckout();
    }
  };

  const handleSendEnquiry = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please describe your enquiry.");
      return;
    }

    try {
      const address = userDetails.address || "No address";
      const enquiryMessage = message.trim();
      const parsedDate = parseDeliveryDate(deliveryDateTime);
      const customer_date = parsedDate
        ? parsedDate.toISOString().split("T")[0]
        : "";

      const response = await api.get("/Enquiry/enquiry", {
        params: {
          mobile: storedMobile,
          product_id,
          product_detaild_id,
          count,
          address,
          customer_date,
          message: enquiryMessage,
          order_id: "[" + confirmOrder + "]",
        },
      });

      if (response.data.success === 1) {
        Alert.alert("Success", "Your enquiry has been sent to the admin.", [
          {
            text: "OK",
            onPress: () => {
              router.push({
                pathname: "/components/Home",
                params: { mobile: storedMobile, type, id: storedId },
              });
            },
          },
        ]);
        setMessage("");
      } else {
        Alert.alert(
          "Failed",
          "Failed to send enquiry. Please try again later."
        );
      }
    } catch (error) {
      console.error("❌ Enquiry API Error:", error);
      Alert.alert("Error", "Something went wrong while sending enquiry.");
    }
  };

  const handleUpdateAddress = async () => {
    if (!newAddress.trim()) {
      Alert.alert("Error", "Please enter a valid address");
      return;
    }

    setIsUpdatingAddress(true);

    try {
      setTimeout(() => {
        setUserDetails((prev) => ({ ...prev, address: newAddress.trim() }));
        setShowAddressModal(false);
        setIsUpdatingAddress(false);
        Alert.alert("Success", "Address updated successfully!");
      }, 1500);
    } catch (error) {
      setIsUpdatingAddress(false);
      Alert.alert("Error", "Failed to update address. Please try again.");
    }
  };

  const renderProductDetails = () => (
    <View style={styles.productSection}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      {productDetails.map((product, index) => (
        <View key={index} style={styles.productItem}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productSize}>Size: {product.size}</Text>
            <Text style={styles.productPrice}>
              {product.count} × ₹{product.unit_price} = ₹{product.total}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderCheckoutFlow = () => {
    const deliveryCharge = selectedPincode
      ? parseInt(selectedPincode.price)
      : 40;
    const taxes = 0;
    const total = subtotal + deliveryCharge + taxes - discount;

    return (
      <>
        {renderProductDetails()}

        <Text style={styles.sectionTitle}>
          You are ordering as:{" "}
          {userType == 1 ? "Customer" : type == 2 ? "Hotel" : "Catering"}
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
          {discount > 0 && (
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>
                Coupon ({selectedCoupon?.code})
              </Text>
              <Text style={styles.invoiceNegative}>- ₹{discount}</Text>
            </View>
          )}
          <View style={[styles.invoiceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>

        {discount > 0 && (
          <TouchableOpacity
            style={styles.removeCouponButton}
            onPress={() => {
              setDiscount(0);
              setSelectedCoupon(null);
            }}
          >
            <Text style={styles.removeCouponText}>
              Remove {selectedCoupon?.code} coupon
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Shipping Details</Text>
        <TouchableOpacity
          style={styles.locationBox}
          onPress={() => setShowPincodeModal(true)}
        >
          <Text style={styles.useLocationText}>
            {selectedPincode
              ? `📍 ${selectedPincode.city} (${selectedPincode.pincode})`
              : "Choose delivery Pincode"}
          </Text>
        </TouchableOpacity>

        <View style={styles.shippingBox}>
          <View style={styles.shippingHeader}>
            <Text style={styles.shippingName}>
              {userDetails.name || "Name"}
            </Text>
            <Text style={styles.shippingType}>Home</Text>
          </View>
          <View style={styles.shippingRow}>
            <Ionicons name="location-outline" size={18} color="#555" />
            <Text style={styles.shippingText}>
              {userDetails.address || "Your address"},{" "}
              {selectedPincode?.city || "Chennai"}, Tamil Nadu
            </Text>
          </View>
          <View style={styles.shippingRow}>
            <Feather name="phone" size={18} color="#555" />
            <Text style={styles.shippingText}>
              +91 {userDetails.mobile || "9876543210"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setNewAddress(userDetails.address || "");
              setShowAddressModal(true);
            }}
          >
            <Text style={styles.editText}>Edit Address</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity
          style={styles.paymentSelectBox}
          onPress={() => setShowPaymentModal(true)}
        >
          <Text style={styles.paymentSelectText}>
            {selectedPaymentType
              ? paymentTypes.find((p) => p.id === selectedPaymentType)?.label
              : "Select Payment Method"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.proceedButton,
            (!selectedPaymentType || !selectedPincode) && styles.disabledButton,
          ]}
          onPress={handleProceed}
          disabled={!selectedPaymentType || !selectedPincode}
        >
          <Text style={styles.actionButtonText}>Proceed with Order</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderEnquiryFlow = () => (
    <View style={styles.enquiryContainer}>
      {renderProductDetails()}
      <Text style={styles.instructionsText}>
        Your delivery date is more than 5 days from today. Please send an
        enquiry and our team will confirm your order availability for this date.
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
          <TouchableOpacity
            onPress={() => router.replace("/components/Cart")}
            style={styles.headerBackButton}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {deliveryDateTime && (
          <Text style={styles.sectionTitle}>
            Delivery DateTime: {deliveryDateTime}
          </Text>
        )}

        {showEnquiryFlow ? renderEnquiryFlow() : renderCheckoutFlow()}
      </ScrollView>

      {/* Address Edit Modal */}
      <Modal
        visible={showAddressModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Delivery Address</Text>

            <TextInput
              style={styles.addressInput}
              placeholder="Enter your full address"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={newAddress}
              onChangeText={setNewAddress}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddressModal(false)}
                disabled={isUpdatingAddress}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateAddress}
                disabled={isUpdatingAddress}
              >
                {isUpdatingAddress ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Save Address</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Coupon Modal */}
      <Modal
        visible={isCouponModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCouponModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.couponModalContent}>
            <Text style={styles.couponModalTitle}>Available Offers</Text>

            <ScrollView style={styles.couponList}>
              {availableCoupons.map((coupon) => (
                <TouchableOpacity
                  key={coupon.id}
                  style={[
                    styles.couponItem,
                    selectedCoupon?.id === coupon.id &&
                      styles.selectedCouponItem,
                  ]}
                  onPress={() => setSelectedCoupon(coupon)}
                >
                  <Text style={styles.couponCode}>{coupon.code}</Text>
                  <Text style={styles.couponDescription}>
                    {coupon.description}
                  </Text>
                  <Text style={styles.couponTerms}>
                    Min. order: ₹{coupon.minOrder}
                    {coupon.freeShipping
                      ? " | Free Shipping"
                      : ` | ${coupon.discount}% off`}
                  </Text>
                  {selectedCoupon?.id === coupon.id && (
                    <View style={styles.couponSelectedIndicator}>
                      <Feather name="check" size={18} color="#28a745" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsCouponModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.applyButton,
                  !selectedCoupon && styles.disabledButton,
                ]}
                onPress={() => {
                  if (selectedCoupon) {
                    Alert.alert(
                      "Coupon Applied",
                      `${selectedCoupon.code} has been applied to your order`
                    );
                    // Add your coupon application logic here
                  }
                  setIsCouponModalVisible(false);
                }}
                disabled={!selectedCoupon}
              >
                <Text style={styles.modalButtonText}>Apply Coupon</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.applyButton,
                  !selectedCoupon && styles.disabledButton,
                ]}
                onPress={handleApplyCoupon}
                disabled={!selectedCoupon}
              >
                <Text style={styles.modalButtonText}>Apply Coupon</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Method Selection Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Payment Method</Text>

            {paymentTypes.map((payment) => (
              <TouchableOpacity
                key={payment.id}
                style={[
                  styles.paymentOption,
                  selectedPaymentType === payment.id &&
                    styles.selectedPaymentOption,
                ]}
                onPress={() => {
                  setSelectedPaymentType(payment.id);
                  setShowPaymentModal(false);
                }}
              >
                <Ionicons
                  name={payment.icon}
                  size={24}
                  color={
                    selectedPaymentType === payment.id ? "#4CAF50" : "#666"
                  }
                />
                <Text
                  style={[
                    styles.paymentOptionText,
                    selectedPaymentType === payment.id &&
                      styles.selectedPaymentOptionText,
                  ]}
                >
                  {payment.label}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setShowPaymentModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Pincode Selection Modal */}
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
                      {item.city} ({item.pincode})
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
