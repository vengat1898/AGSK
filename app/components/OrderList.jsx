import { SessionContext } from "@/context/SessionContext";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OrderList = () => {
  const router = useRouter();
  const { session, getUserMobile, getUserId, getUserName, getUserType } =
    useContext(SessionContext);

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("0"); // 'all', '0', '1', '2'

  const fetchOrderList = async () => {
    try {
      setLoading(true);
      const mobile = await getUserMobile();
      const response = await api.get(`/Account/account?mobile=${mobile}`);

      if (response.data.success === 1) {
        console.log("response checl date====",response.data.data)
        setOrders(response.data.data);
        setFilteredOrders(response.data.data); // Initially show all orders
      } else {
        Alert.alert("Error", response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Error", "Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, []);

  useEffect(() => {
    if (activeFilter === "pending") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => order.status === activeFilter);
      setFilteredOrders(filtered);
    }
  }, [activeFilter, orders]);

  const getStatusText = (status) => {
    switch (status) {
      case "0":
        return "Pending";
      case "1":
        return "accepted";
      case "2":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getDeliveryStatusText = (deliveryStatus) => {
    switch (deliveryStatus) {
      case "0":
        return "Not Complete";
      case "1":
        return "Complete";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "0":
        return "#FF8C00"; // Orange for pending
      case "1":
        return "#2E7D32"; // Dark green for accepted/completed
      case "2":
        return "#D32F2F"; // Red for rejected
      default:
        return "#757575";
    }
  };

  const handleOrderPress = async (item) => {
    try {
      const mobile = await getUserMobile();
      const type = await getUserType();
      const id = await getUserId();

      router.push({
        pathname: "/components/Invoice",
        params: {
          order_id: item.id,
          weburl: item.invoice_web_url,
          mobile: mobile,
          type: type,
          id: id,
          order_number: item.order_number,
        },
      });
    } catch (error) {
      console.error("Error getting user details:", error);
      Alert.alert("Error", "Failed to load order details");
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => handleOrderPress(item)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order ID: {item.order_number}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Address: </Text>
          {item.address}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Order Price: </Text>₹{item.ordinal_price}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Delivery: </Text>₹{item.delivery}
          </Text>
        </View>

        <Text style={styles.totalPrice}>
          <Text style={styles.label}>Total: </Text>₹{item.total_price}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Payment: </Text>
            {item.payment_type.toUpperCase()}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Delivery Status: </Text>
            {getDeliveryStatusText(item.delivery_status)}
          </Text>
        </View>

        <Text style={styles.dateText}>
          <Text style={styles.label}>Order Date: </Text>
          {new Date(item.date).toLocaleDateString()}
        </Text>

       <Text style={styles.dateText}>
  <Text style={styles.label}>Delivery Date: </Text>
  {item.status === "0"
    ? " -"
    : item.delivery_date !== ""
      ? new Date(item.delivery_date).toLocaleDateString()
      : " -"}
</Text>

        {item.secondary_mobile && (
          <Text style={styles.detailText}>
            <Text style={styles.label}>Contact: </Text>
            {item.secondary_mobile}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === "0" && styles.activeFilter,
        ]}
        onPress={() => setActiveFilter("0")}
      >
        <Text
          style={[
            styles.filterText,
            activeFilter === "0" && styles.activeFilterText,
          ]}
        >
          Pending
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === "1" && styles.activeFilter,
        ]}
        onPress={() => setActiveFilter("1")}
      >
        <Text
          style={[
            styles.filterText,
            activeFilter === "1" && styles.activeFilterText,
          ]}
        >
          Accepted
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === "2" && styles.activeFilter,
        ]}
        onPress={() => setActiveFilter("2")}
      >
        <Text
          style={[
            styles.filterText,
            activeFilter === "2" && styles.activeFilterText,
          ]}
        >
          Rejected
        </Text>
      </TouchableOpacity>

       {/* <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === "all" && styles.activeFilter,
        ]}
        onPress={() => setActiveFilter("all")}
      >
        <Text
          style={[
            styles.filterText,
            activeFilter === "all" && styles.activeFilterText,
          ]}
        >
          All
        </Text>
      </TouchableOpacity> */}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" translucent animated />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" translucent animated />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("components/Home")}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>🍃 Banana Leaf Orders</Text>
        
        {/* Filter tabs */}
        {renderFilterTabs()}
        
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="leaf-outline" size={64} color="#66BB6A" />
            <Text style={styles.emptyText}>
              {activeFilter === "all"
                ? "No orders found"
                : `No ${getStatusText(activeFilter).toLowerCase()} orders`}
            </Text>
            <Text style={styles.emptySubText}>
              {activeFilter === "all"
                ? "Your banana leaf orders will appear here"
                : `You don't have any ${getStatusText(
                    activeFilter
                  ).toLowerCase()} orders`}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrderList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E8",
  },
  header: {
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1B5E20",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#2E7D32",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#2E7D32",
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#66BB6A",
    marginTop: 8,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeft: 5,
    borderLeftColor: "#4CAF50",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B5E20",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 1,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  orderDetails: {
    gap: 10,
  },
  label: {
    fontWeight: "700",
    color: "#1B5E20",
  },
  detailText: {
    fontSize: 12,
    color: "#2E7D32",
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F1F8E9",
    padding: 10,
    borderRadius: 8,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B5E20",
    backgroundColor: "#C8E6C9",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F1F8E9",
    padding: 10,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#388E3C",
    backgroundColor: "#E8F5E8",
    padding: 8,
    borderRadius: 6,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    backgroundColor: "#E8F5E8",
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeFilter: {
    backgroundColor: "#2E7D32",
  },
  filterText: {
    color: "#2E7D32",
    fontWeight: "600",
  },
  activeFilterText: {
    color: "#fff",
  },
});