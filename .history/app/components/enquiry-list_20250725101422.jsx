import { SessionContext } from "@/context/SessionContext";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import sa
const Enquiry = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("pending");
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const { session, getUserMobile, getUserId, getUserName, getUserType } =
    useContext(SessionContext);

  const tabs = [
    { key: "pending", label: "PENDING", status: "1" },
    { key: "accepted", label: "ACCEPTED", status: "2" },
    { key: "rejected", label: "REJECTED", status: "3" },
  ];

  useEffect(() => {
    const fetchMobile = async () => {
      const storedMobile = await getUserMobile();
      setMobile(storedMobile || "");
    };
    fetchMobile();
  }, []);

  useEffect(() => {
    if (mobile) fetchEnquiries();
  }, [selectedTab, mobile]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const mobile = await getUserMobile();
      const response = await api.get(
        `/Enquiry_status/enquiry_status?mobile=${mobile}`
      );
      console.log("====================================");
      console.log(response.data);
      console.log("====================================");
      if (response.data.success === 1) {
        const currentTabStatus = tabs.find(
          (tab) => tab.key === selectedTab
        )?.status;
        const filteredEnquiries = response.data.data.filter(
          (enquiry) => enquiry.status === currentTabStatus
        );
        setEnquiries(filteredEnquiries);
      } else {
        setEnquiries([]);
      }
    } catch (error) {
      console.error("❌ Enquiry fetch error:", error);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "1":
        return "#FF8C00"; // Orange for pending
      case "2":
        return "#2E7D32"; // Dark green for accepted
      case "3":
        return "#D32F2F"; // Red for rejected
      default:
        return "#757575";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "1":
        return "PENDING";
      case "2":
        return "ACCEPTED";
      case "3":
        return "REJECTED";
      default:
        return "UNKNOWN";
    }
  };

  const renderEnquiryCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>🍃 {item.name}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>📦 Orders:</Text>
          <Text style={styles.value}>{item.orders} pieces</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>💰 Total Price:</Text>
          <Text style={styles.priceText}>₹{item.total_price}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>📅 Customer Date:</Text>
          <Text style={styles.value}>
            {new Date(item.Customer_date).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>🚚 Delivery Date:</Text>
          <Text style={styles.value}>
            {new Date(item.delivery_date).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.label}>📍 Address:</Text>
          <Text style={styles.addressText}>{item.address}</Text>
        </View>

        {item.message && (
          <View style={styles.messageContainer}>
            <Text style={styles.label}>💬 Message:</Text>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        )}

        {item.supplier_message && (
          <View style={styles.supplierMessageContainer}>
            <Text style={styles.label}>🏪 Supplier Response:</Text>
            <Text style={styles.supplierMessageText}>
              {item.supplier_message}
            </Text>
          </View>
        )}

        <View style={styles.contactInfo}>
          <Text style={styles.label}>📞 Contact:</Text>
          <Text style={styles.value}>{item.mobile}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
     <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("components/Home")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🍃 My Enquiries</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                selectedTab === tab.key && styles.activeTabButton,
              ]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab.key && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={styles.loadingText}>Loading enquiries...</Text>
          </View>
        ) : (
          <FlatList
            data={enquiries}
            keyExtractor={(item) => item.id}
            renderItem={renderEnquiryCard}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="leaf-outline" size={64} color="#66BB6A" />
                <Text style={styles.noDataText}>
                  No {selectedTab} enquiries found
                </Text>
                <Text style={styles.emptySubText}>
                  Your banana leaf enquiries will appear here
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
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
  tabContainer: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 15,
    backgroundColor: "#F1F8E9",
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: "#2E7D32",
    elevation: 2,
  },
  tabText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#388E3C",
  },
  activeTabText: {
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
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
    paddingVertical: 60,
  },
  noDataText: {
    fontSize: 18,
    color: "#2E7D32",
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
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
  card: {
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B5E20",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 1,
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  cardContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F1F8E9",
    padding: 10,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B5E20",
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1B5E20",
    flex: 1,
    textAlign: "right",
  },
  addressContainer: {
    backgroundColor: "#F1F8E9",
    padding: 12,
    borderRadius: 8,
  },
  addressText: {
    fontSize: 13,
    color: "#2E7D32",
    marginTop: 4,
    lineHeight: 18,
  },
  messageContainer: {
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 8,
    borderLeft: 3,
    borderLeftColor: "#2196F3",
  },
  messageText: {
    fontSize: 13,
    color: "#1565C0",
    marginTop: 4,
    fontStyle: "italic",
  },
  supplierMessageContainer: {
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 8,
    borderLeft: 3,
    borderLeftColor: "#FF9800",
  },
  supplierMessageText: {
    fontSize: 13,
    color: "#E65100",
    marginTop: 4,
    fontWeight: "500",
  },
  contactInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#C8E6C9",
    padding: 10,
    borderRadius: 8,
  },
});

export default Enquiry;
