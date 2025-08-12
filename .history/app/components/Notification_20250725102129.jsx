import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Safe
import styles from "./Styles/notificationStyles";
const Notification = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style="light" backgroundColor="white" animated />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/components/Home")}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.infoText}>
          🔔 Notification functionality coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Notification;
