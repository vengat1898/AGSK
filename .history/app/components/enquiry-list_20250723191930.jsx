import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState,useContext } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./Styles/enquiry.Styles";
import { SessionContext } from "@/context/SessionContext";

const Enquiry = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("pending");
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState("");
  const { session, getUserMobile, getUserId, getUserName, getUserType } =
    useContext(SessionContext);
  const tabs = ["pending", "accepted", "rejected"];

  useEffect(() => {
    const fetchMobile = async () => {
      const storedMobile = await getuse;
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
      const response = await api.get(
        `/Enquiry_status/enquiry_status?mobile=${mobile}`
      );

      if (response.data.success === 1) {
        setEnquiries(response.data.data);
      } else {
        setEnquiries([]);
      }
    } catch (error) {
      console.error("❌ Enquiry fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderEnquiryCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.product_name}</Text>
      <Text style={styles.cardText}>Count: {item.count}</Text>
      <Text style={styles.cardText}>Date: {item.customer_date}</Text>
      <Text style={styles.cardText}>Message: {item.message}</Text>
      <Text
        style={[
          styles.statusBadge,
          selectedTab === "accepted"
            ? styles.accepted
            : selectedTab === "rejected"
            ? styles.rejected
            : styles.pending,
        ]}
      >
        {selectedTab.toUpperCase()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/components/Home")}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Enquiry</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.activeTabButton,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="green"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={enquiries}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderEnquiryCard}
          ListEmptyComponent={
            <Text style={styles.noDataText}>
              No {selectedTab} enquiries found.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Enquiry;
