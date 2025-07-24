import api from "@/services/api";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from "react-native";
import { SessionContext } from "@/context/SessionContext";

const OrderList = () => {
  const router = useRouter();
  const { session, getUserMobile, getUserId, getUserName, getUserType } =
    useContext(SessionContext);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrderList = async () => {
    try {
      setLoading(true);
      const mobile = await getUserMobile();
      const response = await api.get(`/Account/account?mobile=${mobile}`);
      
      if (response.data.success === 1) {
        setOrders(response.data.data);
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

  const getStatusText = (status) => {
    switch (status) {
      case "0": return "Pending";
      case "1": return "Accepted/Completed";
      case "2": return "Rejected";
      default: return "Unknown";
    }
  };

  const getDeliveryStatusText = (deliveryStatus) => {
    switch (deliveryStatus) {
      case "0": return "Not Complete";
      case "1": return "Complete";
      default: return "Unknown";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "0": return "#FFA500"; // Orange for pending
      case "1": return "#4CAF50"; // Green for accepted/completed
      case "2": return "#F44336"; // Red for rejected
      default: return "#757575";
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order ID: {item.ord_id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
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
            <Text style={styles.label}>Order Price: </Text>
            ₹{item.ordinal_price}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Delivery: </Text>
            ₹{item.delivery}
          </Text>
        </View>
        
        <Text style={styles.totalPrice}>
          <Text style={styles.label}>Total: </Text>
          ₹{item.total_price}
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
          {new Date(item.delivery_date).toLocaleDateString()}
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders found</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default OrderList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  orderDetails: {
    gap: 8,
  },
  label: {
    fontWeight: "600",
    color: "#333",
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
});