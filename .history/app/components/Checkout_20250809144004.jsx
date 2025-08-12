import api from "@/services/api";
import { Feather, Ionicons } from "@expo/vector-icons";
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
  const params = useLocalSearchParams();
  const {
    deliveryDateTime,
    type,
    mobile,
    id,
    product_id,
    product_detaild_id,
    count,
    confirmOrder,
  } = params;

  // Get price values separately
  const original_price = params.original_price || "0";
  const discount_price = params.discount_price || "0";
  const discounted_total = params.discounted_total || "0";

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

  const [selectedCoupon, setSelectedCoupon] = useState(0);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  // Enhanced address editing state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [showCouponDropdown, setShowCouponDropdown] = useState(false);
  // Payment type selection state
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [customerBalance, setCustomerBalance] = useState(0);
  const [adminBalance, setAdminBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(false);

  const {
    session,
    getUserMobile,
    getUserId,
    getUserName,
    getUserType,
    getSecondaryMobile,IsMultiUser
  } = useContext(SessionContext);

  const [discount, setDiscount] = useState(0);

  const paymentTypes = [
    { id: "online", label: "Pay Online", icon: "card-outline" },
    { id: "cod", label: "Cash on Delivery", icon: "cash-outline" },
    { id: "cheque", label: "Bank Cheque", icon: "document-text-outline" },
  ];

  useEffect(() => {
    fetchBalance();
  }, []);

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

  const fetchBalance = async () => {
    try {
      setLoadingBalance(true);
      const mobile = await getUserMobile();

      if (!mobile) {
        console.log("No mobile number found for balance fetch");
        return;
      }

      const response = await api.get("/Account/wallet", {
        params: { mobile },
      });

      console.log("Balance API Response:", response.data);

      if (response.data.success === 1 && response.data.data) {
        // Extract balances from the response
        const custBalance =
          parseFloat(response.data.data["Customer balance"]) || 0;
        const admBalance = parseFloat(response.data.data["Admin balance"]) || 0;

        setCustomerBalance(custBalance);
        setAdminBalance(admBalance);
      } else {
        console.log("Failed to fetch balance:", response.data.message);
        Alert.alert("Error", "Failed to fetch balance information");
      }
    } catch (error) {
      console.error("Balance fetch error:", error);
      Alert.alert("Error", "Something went wrong while fetching balance");
    } finally {
      setLoadingBalance(false);
    }
  };

  // coupon

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const mobile = await getUserMobile();
        if (!mobile) return;

        const response = await api.get(
          `/Discount/discount_fetch?mobile=${mobile}`
        );
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
  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
    setDiscount(0);
    Alert.alert("Coupon Removed", "Coupon has been removed from your order.");
  };
  const handleSelectCoupon = (coupon) => {
    // Check if coupon is active
    if (!coupon.isActive) {
      Alert.alert("Coupon Expired", "This coupon is no longer valid.");
      return;
    }

    // Check minimum order amount
    if (subtotal < coupon.minOrder) {
      Alert.alert(
        "Minimum Order Required",
        `This coupon requires a minimum order of ₹${coupon.minOrder}`
      );
      return;
    }

    // Check coupon validity dates
    const today = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validTo = new Date(coupon.validTo);

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

    // Apply the coupon
    setSelectedCoupon(coupon);
    setDiscount(coupon.discount);
    setShowCouponDropdown(false);

    Alert.alert(
      "Coupon Applied",
      `${coupon.code} - ₹${coupon.discount} discount applied successfully!`
    );
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

        const response = await api.get("Orderplace/Orderplace", {
          params: { mobile },
        });

        if (response.data.success === 1) {
          let subtotal = response.data.total_price || 0;
          const productDetails = response.data.product_details || [];

          // 1. First try to calculate from API response
          if (productDetails.length > 0) {
            const product = productDetails[0];
            if (product.discount_price && product.discount_price !== "0") {
              subtotal =
                parseFloat(product.discount_price) *
                parseInt(product.count || 1);
            }
          }

          // 2. Set the initial subtotal from API
          setSubtotal(subtotal);

          // 3. THEN add your fallback check (place it HERE)
          if (subtotal !== parseFloat(discounted_total || "0")) {
            console.warn(
              "API subtotal doesn't match cart calculation. Using cart value."
            );
            setSubtotal(parseFloat(discounted_total || "0"));
          }

          setUserDetails(response.data.data || {});
          setProductDetails(productDetails);
          setNewAddress(response.data.data?.address || "");
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
      }
    };

    fetchInvoiceAndUser();
  }, []);

  useEffect(() => {
    const fetchAllPincodes = async () => {
      try {
        setPincodeLoading(true);
        const response = await api.get("/Pincode/all_pincodes");
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
    const isMultiUser= await IsMultiUser();
    console.log('====================================isMultiUser');
    console.log(isMultiUser);
    console.log('====================================');
    try {
      let sec_mobile = "";
      if (isMultiUser == 1) {
        sec_mobile = await getSecondaryMobile();
      }
      // const order_date = new Date().toISOString().split("T")[0];
      // const deliveryCharge = selectedPincode
      //   ? parseInt(selectedPincode.price)
      //   : 40;
      // const taxes = 0;
      // const total = subtotal + deliveryCharge + taxes - discount;
      console.log("====================================sec_mobile");
      console.log(sec_mobile);
      console.log("====================================");
      const order_date = new Date().toISOString().split("T")[0];
      const deliveryCharge = selectedPincode
        ? parseInt(selectedPincode.price)
        : 40;
      const taxes = 0;
      const baseTotal = subtotal + deliveryCharge + taxes - discount;
      const total = Math.max(0, baseTotal + (adminBalance - customerBalance));

      const params = {
        order_date,
        mobile: storedMobile,
        orginal_price: subtotal,
        delivery: deliveryCharge,
        discount,
        total_price: total,
        address: userDetails.address,
        second_mobile: sec_mobile || "",
        payment_type: selectedPaymentType,
        pincode: selectedPincode?.pincode || "",
        order_date,
        delivery_date: deliveryDateTime,
        type,
        order_id: "[" + confirmOrder + "]",
        offer_code: selectedCoupon?.id || 0,
        customer_balance: customerBalance,
        admin_balance: adminBalance,
      };

      console.log(`Final checkout params: ${JSON.stringify(params)}`);

      const response = await api.get("/Finalplaceorder/final_update", {
        params,
      });
      console.log("====================================Finalplaceorder");
      console.log(response.data);
      console.log("====================================");
      if (response.data.success === 1) {
        const { weburl, order_id, order_number } = response.data.data;
        let successMessage = "Your order has been placed successfully!";

        if (selectedPaymentType === "cheque") {
          successMessage += " Please send your cheque to our office address.";
        } else if (selectedPaymentType === "cod") {
          successMessage += " Confirmation will be provided within 12 hours.";
        }

        Alert.alert("Order Confirmed", successMessage, [
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
        ]);
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

  // const parseDeliveryDate = (dateString) => {
  //   if (!dateString) {
  //     console.log("❌ No delivery date string provided");
  //     return null;
  //   }

  //   console.log("🔍 Parsing delivery date:", dateString);

  //   try {
  //     let parsedDate = null;

  //     if (dateString.includes(",")) {
  //       const [datePart, timePart] = dateString.split(", ");
  //       const [day, month, year] = datePart.split("/");

  //       if (timePart) {
  //         const [hours, minutes, seconds] = timePart.split(":");
  //         parsedDate = new Date(
  //           parseInt(year),
  //           parseInt(month) - 1,
  //           parseInt(day),
  //           parseInt(hours),
  //           parseInt(minutes),
  //           parseInt(seconds) || 0
  //         );
  //       } else {
  //         parsedDate = new Date(
  //           parseInt(year),
  //           parseInt(month) - 1,
  //           parseInt(day)
  //         );
  //       }
  //     } else if (dateString.includes("/")) {
  //       const [day, month, year] = dateString.split("/");
  //       parsedDate = new Date(
  //         parseInt(year),
  //         parseInt(month) - 1,
  //         parseInt(day)
  //       );
  //     } else {
  //       parsedDate = new Date(dateString);
  //     }

  //     if (isNaN(parsedDate.getTime())) {
  //       console.log("❌ Invalid date parsed:", parsedDate);
  //       return null;
  //     }

  //     console.log("✅ Successfully parsed date:", parsedDate);
  //     return parsedDate;
  //   } catch (error) {
  //     console.error("❌ Error parsing delivery date:", error);
  //     console.error("Original date string:", dateString);
  //     return null;
  //   }
  // };

  // useEffect(() => {
  //   console.log("\n========== 📅 Date Comparison Logic ==========");
  //   console.log("Delivery DateTime param:", deliveryDateTime);

  //   if (!deliveryDateTime) {
  //     console.log("❌ No delivery date provided");
  //     setShowEnquiryFlow(false);
  //     return;
  //   }

  //   // Use setTimeout to prevent blocking UI on low-end devices
  //   const processDateComparison = () => {
  //     try {
  //       const deliveryDate = parseDeliveryDate(deliveryDateTime);

  //       if (!deliveryDate) {
  //         console.log("❌ Primary parsing failed, trying fallback method");
  //         const fallbackResult = safeDateComparison(deliveryDateTime);
  //         setShowEnquiryFlow(fallbackResult);
  //         return;
  //       }

  //       // Create today's date at midnight for accurate comparison
  //       const today = new Date();
  //       today.setHours(0, 0, 0, 0);

  //       // Create comparison date at midnight
  //       const compareDate = new Date(deliveryDate);
  //       compareDate.setHours(0, 0, 0, 0);

  //       // Calculate 5 days from today
  //       const fiveDaysLater = new Date(today);
  //       fiveDaysLater.setDate(today.getDate() + 5);

  //       // Calculate difference in days for debugging
  //       const daysDifference = Math.ceil(
  //         (compareDate - today) / (1000 * 60 * 60 * 24)
  //       );

  //       console.log("📊 Date Comparison Details:");
  //       console.log("Today (midnight):", today.toISOString());
  //       console.log("Delivery Date (midnight):", compareDate.toISOString());
  //       console.log("Five Days Later:", fiveDaysLater.toISOString());
  //       console.log("Days difference:", daysDifference);

  //       // Check if delivery is more than 5 days away
  //       const shouldShowEnquiry = compareDate > fiveDaysLater;

  //       console.log("🎯 Should show enquiry flow:", shouldShowEnquiry);
  //       console.log(
  //         "Logic: compareDate > fiveDaysLater =",
  //         compareDate.getTime(),
  //         ">",
  //         fiveDaysLater.getTime()
  //       );

  //       setShowEnquiryFlow(shouldShowEnquiry);
  //     } catch (error) {
  //       console.error("❌ Error in date comparison:", error);
  //       // Try fallback method
  //       const fallbackResult = safeDateComparison(deliveryDateTime);
  //       setShowEnquiryFlow(fallbackResult);
  //     }

  //     console.log("===============================================\n");
  //   };

  //   // Use setTimeout to prevent blocking on low-end devices
  //   setTimeout(processDateComparison, 10);
  // }, [deliveryDateTime]);

  // Replace your parseDeliveryDate function with this improved version:
  const parseDeliveryDate = (dateString) => {
    if (!dateString) {
      console.log("❌ No delivery date string provided");
      return null;
    }

    console.log("🔍 Parsing delivery date:", dateString);

    try {
      // Extract just the date part before the parenthesis
      const datePart = dateString.split(" (")[0];

      // Parse the date (format: YYYY-MM-DD)
      const [year, month, day] = datePart.split("-").map(Number);
      const parsedDate = new Date(year, month - 1, day);

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

  // And update your date comparison logic:
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
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!deliveryDate) {
        console.log("❌ Failed to parse delivery date");
        setShowEnquiryFlow(false);
        return;
      }

      // Create comparison date at midnight
      const compareDate = new Date(deliveryDate);
      compareDate.setHours(0, 0, 0, 0);

      // Calculate 5 days from today
      const fiveDaysLater = new Date(today);
      fiveDaysLater.setDate(today.getDate() + 5);

      // Check if delivery is more than 5 days away
      const shouldShowEnquiry = compareDate > fiveDaysLater;

      console.log("🎯 Should show enquiry flow:", shouldShowEnquiry);
      setShowEnquiryFlow(shouldShowEnquiry);
    } catch (error) {
      console.error("❌ Error in date comparison:", error);
      setShowEnquiryFlow(false);
    }
  }, [deliveryDateTime]);

  // const handleProceed = () => {
  //   if (!selectedPincode) {
  //     Alert.alert("Select Pincode", "Please choose a delivery pincode.");
  //     return;
  //   }
  //   if (!deliveryDateTime) {
  //     Alert.alert("Missing Date", "Delivery date is required.");
  //     return;
  //   }
  //   if (!selectedPaymentType) {
  //     Alert.alert("Select Payment", "Please choose a payment method.");
  //     return;
  //   }

  //   if (selectedPaymentType === "online") {
  //     if (!storedMobile || !storedId) {
  //       Alert.alert("Error", "User session not available");
  //       return;
  //     }else if (selectedPaymentType === "cod" || selectedPaymentType === "cheque") {
  //   handleFinalCheckout();
  // }

  //     const deliveryCharge = selectedPincode
  //       ? parseInt(selectedPincode.price)
  //       : 40;
  //     const total = subtotal + deliveryCharge - discount;
  //     const order_date = new Date().toISOString().split("T")[0];

  //     router.replace({
  //       pathname: "/components/PayOnline",
  //       params: {
  //         user_id: storedId,
  //         mobile: storedMobile,
  //         address: userDetails.address,
  //         original_price: subtotal,
  //         delivery_charge: deliveryCharge,
  //         total_price: total,
  //         delivery_date: deliveryDateTime,
  //         order_date,
  //         type,
  //         pincode: selectedPincode?.pincode || "",
  //         pincode_city: selectedPincode?.city || "",
  //         pincode_price: selectedPincode?.price || 0,
  //         confirmOrder,
  //         coupon_code: selectedCoupon?.code || "",
  //         discount_amount: discount || 0,
  //       },
  //     });
  //   } else if (selectedPaymentType === "cod") {
  //     handleFinalCheckout();
  //   }
  // };

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
      const total = subtotal + deliveryCharge - discount;
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
          coupon_code: selectedCoupon?.code || "",
          discount_amount: discount || 0,
        },
      });
    } else if (
      selectedPaymentType === "cod" ||
      selectedPaymentType === "cheque"
    ) {
      handleFinalCheckout();
    }
  };
  const renderCouponSection = () => (
    <View style={styles.couponSection}>
      <Text style={styles.sectionTitle}>Available Offers</Text>

      <TouchableOpacity
        style={styles.couponDropdownButton}
        onPress={() => setShowCouponDropdown(!showCouponDropdown)}
      >
        <Text style={styles.couponDropdownText}>
          {selectedCoupon
            ? `${selectedCoupon.code} - ₹${selectedCoupon.discount} off`
            : "Select a coupon"}
        </Text>
        <Ionicons
          name={showCouponDropdown ? "chevron-up" : "chevron-down"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {showCouponDropdown && (
        <View style={styles.couponDropdownList}>
          {availableCoupons.length > 0 ? (
            availableCoupons.map((coupon) => (
              <TouchableOpacity
                key={coupon.id}
                style={[
                  styles.couponDropdownItem,
                  selectedCoupon?.id === coupon.id &&
                    styles.selectedCouponDropdownItem,
                ]}
                onPress={() => handleSelectCoupon(coupon)}
              >
                <View style={styles.couponItemContent}>
                  <View style={styles.couponHeader}>
                    <Text style={styles.couponCode}>{coupon.code}</Text>
                    <Text style={styles.couponDiscount}>
                      ₹{coupon.discount} OFF
                    </Text>
                  </View>
                  <Text style={styles.couponDescription}>
                    Save ₹{coupon.discount} on your order
                  </Text>
                  <Text style={styles.couponTerms}>
                    Min. order: ₹{coupon.minOrder} | Valid till:{" "}
                    {new Date(coupon.validTo).toLocaleDateString()}
                  </Text>
                </View>
                {selectedCoupon?.id === coupon.id && (
                  <Feather name="check-circle" size={20} color="#28a745" />
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noCouponsContainer}>
              <Text style={styles.noCouponsText}>No coupons available</Text>
            </View>
          )}
        </View>
      )}

      {selectedCoupon && (
        <TouchableOpacity
          style={styles.removeCouponButton}
          onPress={handleRemoveCoupon}
        >
          <Text style={styles.removeCouponText}>
            Remove {selectedCoupon.code} coupon
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
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
            {/* <Text style={styles.productPrice}>
              {product.count} × ₹{product.unit_price} = ₹{product.total}
            </Text> */}
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
    const baseTotal = subtotal + deliveryCharge + taxes - discount;
    const balanceAdjustment = adminBalance - customerBalance;
    // const total = subtotal + deliveryCharge + taxes - discount;
    const total = Math.max(0, baseTotal + balanceAdjustment);

    return (
      <>
        {renderProductDetails()}
        {renderCouponSection()}
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

          {customerBalance > 0 && (
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Balance Amount</Text>
              <Text style={styles.invoiceNegative}>
                - ₹{customerBalance.toFixed(2)}
              </Text>
            </View>
          )}
          {adminBalance > 0 && (
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Balance Amount</Text>
              <Text style={styles.invoicePositive}>
                + ₹{adminBalance.toFixed(2)}
              </Text>
            </View>
          )}
          <View style={[styles.invoiceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>

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
          <Ionicons name="chevron-down" size={20} color="red" />
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

      {/* Payment Method Selection Modal */}
      {/* <Modal
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
      </Modal> */}

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

            {/* Add the cheque instructions here */}
            {selectedPaymentType === "cheque" && (
              <View style={styles.paymentInstructions}>
                {/* <Text style={styles.instructionsText}>
            Please make the cheque payable to our company name and send it to our office address.
          </Text> */}
                <Text style={styles.instructionsText}>
                  Your order will be processed after we receive and clear the
                  cheque.
                </Text>
              </View>
            )}

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
              style={[styles.closeButton, { backgroundColor: "red" }]}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
