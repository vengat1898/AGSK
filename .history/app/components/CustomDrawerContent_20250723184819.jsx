import { SessionContext } from "@/context/SessionContext"; // Adjust path as needed
import api from "@/services/api";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const { width } = Dimensions.get("window");

const CustomDrawer = ({ isVisible, onClose }) => {
  const router = useRouter();
  const {
    session,
    clearSession,
    getUserName,
    getUserMobile,
    getUserType,
    saveSession,
  } = useContext(SessionContext);
  const [userName, setUserName] = useState("");
  const [userMobile, setUserMobile] = useState("");
  const [userType, setUserType] = useState("");
  const [userTypeNumber, setUserTypeNumber] = useState(1);
  const [slideAnim] = useState(new Animated.Value(-width * 0.8));

  useEffect(() => {
    loadUserData();
  }, [session]);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width * 0.8,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const loadUserData = async () => {
    try {
      const name = await getUserName();
      const mobile = await getUserMobile();
      const type = await getUserType();

      // Ensure type is a number
      const numericType = parseInt(type);
      setUserTypeNumber(numericType);

      console.log("====================================");
      console.log(`User Type Number: ${numericType}`);
      console.log(`Type of userTypeNumber: ${typeof numericType}`);
      console.log("====================================");

      if (numericType === 1) {
        setUserType("Customer");
      } else if (numericType === 2) {
        setUserType("Hotel");
      } else if (numericType === 3) {
        setUserType("Catering");
      }
      setUserName(name || "User");
      setUserMobile(mobile || "");
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };
  {
    (() => {
      console.log("Checking switch button visibility:", {
        userTypeNumber,
        typeOfUserTypeNumber: typeof userTypeNumber,
        shouldShow: userTypeNumber === 2 || userTypeNumber === 3,
      });

      return (
        (userTypeNumber === 2 || userTypeNumber === 3) && (
          <TouchableOpacity
            style={styles.switchProfileButton}
            onPress={handleProfileSwitch}
            activeOpacity={0.8}
          >
            <Feather name="refresh-cw" size={16} color="#fff" />
            <Text style={styles.switchProfileText}>
              Switch to {userTypeNumber === 2 ? "Catering" : "Hotel"}
            </Text>
          </TouchableOpacity>
        )
      );
    })();
  }

  const handleProfileSwitch = async () => {
    const currentType = userTypeNumber;
    let newType;
    let newTypeLabel;

    if (currentType === 2) {
      newType = 3;
      newTypeLabel = "Catering";
    } else if (currentType === 3) {
      newType = 2;
      newTypeLabel = "Hotel";
    }

    Alert.alert(
      "Switch Profile",
      `Are you sure you want to switch from ${userType} to ${newTypeLabel}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Switch",
          style: "default",
          onPress: async () => {
            try {
              const response = await api.get(
                `/Convert_type/convert_type?mobile=${userMobile}&type=${newType}`
              );

              if (response.data.success === 1) {
                await saveSession({
                  ...session,
                  type: newType,
                });

                setUserTypeNumber(newType);
                setUserType(newTypeLabel);

                Alert.alert(
                  "Success",
                  `Profile switched to ${newTypeLabel} successfully!`,
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        onClose();
                        router.replace("/components/Home");
                      },
                    },
                  ]
                );
              } else {
                Alert.alert(
                  "Error",
                  "Failed to switch profile. Please try again."
                );
              }
            } catch (error) {
              console.error("Profile switch error:", error);
              Alert.alert(
                "Error",
                "Failed to switch profile. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes, Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await clearSession();
            onClose();
            router.replace("/components/login");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const menuItems = [
    {
      id: 1,
      title: "Home",
      icon: "home",
      route: "/components/Home",
      iconType: "Feather",
    },
    {
      id: 2,
      title: "My Orders",
      icon: "list",
      route: "/components/MyOrder",
      iconType: "Feather",
    },
    {
      id: 3,
      title: "Cart",
      icon: "shopping-cart",
      route: "/components/Cart",
      iconType: "Feather",
    },
    {
      id: 4,
      title: "Profile",
      icon: "user",
      route: "/components/profile-update",
      iconType: "Feather",
    },
    {
      id: 5,
      title: "Enquiry",
      icon: "message-square",
      route: "/components/Enquiry",
      iconType: "Feather",
    },
    {
      id: 6,
      title: "Notifications",
      icon: "bell",
      route: "/components/Notifications",
      iconType: "Feather",
    },
    {
      id: 7,
      title: "Help & Support",
      icon: "help-circle",
      route: "/components/Support",
      iconType: "Feather",
    },
    {
      id: 8,
      title: "Settings",
      icon: "settings",
      route: "/components/Settings",
      iconType: "Feather",
    },
  ];

  const renderIcon = (iconName, iconType, color = "#666", size = 20) => {
    switch (iconType) {
      case "Feather":
        return <Feather name={iconName} size={size} color={color} />;
      case "MaterialIcons":
        return <MaterialIcons name={iconName} size={size} color={color} />;
      default:
        return <Feather name={iconName} size={size} color={color} />;
    }
  };

  const navigateToRoute = async (route, title) => {
    onClose();

    if (route === "/components/Cart") {
      // Handle cart navigation with proper params
      const mobile = await getUserMobile();
      router.replace({
        pathname: route,
        params: {
          mobile: mobile,
          type: session?.type,
          id: session?.id,
          name: userName,
        },
      });
    } else {
      router.replace(route);
    }
  };

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      <View style={styles.overlay}>
        {/* Background Overlay */}
        <TouchableOpacity
          style={styles.backgroundOverlay}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Drawer Content */}
        <Animated.View
          style={[
            styles.drawerContainer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Header Section */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Feather name="x" size={24} color="#fff" />
              </TouchableOpacity>

              <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {userName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{userName}</Text>
                  <Text style={styles.userMobile}>{userMobile}</Text>
                  <View style={styles.userTypeBadge}>
                    <Text style={styles.userType}>{userType || "Guest"}</Text>
                  </View>
                </View>
              </View>

              {/* Profile Switch Button - Only show for Hotel (2) and Catering (3) */}
              {(userTypeNumber === 2 || userTypeNumber === 3) && (
                <TouchableOpacity
                  style={styles.switchProfileButton}
                  onPress={handleProfileSwitch}
                  activeOpacity={0.8}
                >
                  <Feather name="refresh-cw" size={16} color="#fff" />
                  <Text style={styles.switchProfileText}>
                    Switch to {userTypeNumber === 2 ? "Catering" : "Hotel"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => navigateToRoute(item.route, item.title)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIcon}>
                    {renderIcon(item.icon, item.iconType, "#555")}
                  </View>
                  <Text style={styles.menuText}>{item.title}</Text>
                  <Feather name="chevron-right" size={16} color="#ccc" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Footer with Logout */}
            <View style={styles.footer}>
              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Feather name="log-out" size={20} color="#dc3545" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>

              <View style={styles.appInfo}>
                <Text style={styles.appName}>AGSK Mobile App</Text>
                <Text style={styles.appVersion}>Version 1.0.0</Text>
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backgroundOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawerContainer: {
    width: width * 0.8,
    backgroundColor: "#fff",
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    backgroundColor: "#28a745",
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 8,
    marginBottom: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userMobile: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  userTypeBadge: {
    alignSelf: "flex-start",
  },
  userType: {
    fontSize: 12,
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  switchProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  switchProfileText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  menuIcon: {
    width: 24,
    alignItems: "center",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 16,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dc3545",
    marginBottom: 20,
  },
  logoutText: {
    color: "#dc3545",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  appInfo: {
    alignItems: "center",
    paddingTop: 10,
  },
  appName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 12,
    color: "#999",
  },
});

export default CustomDrawer;
