import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome5, MaterialIcons, Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./Styles/registerStyles";

// Images
import login1 from "../../assets/images/login1.png";
import agskLogo from "../../assets/images/AGSKLogo.png";

const registrationOptions = [
  {
    id: "customer",
    title: "New Customer",
    subtitle: "Join as a customer and enjoy our services",
    icon: "users",
    iconType: FontAwesome5,
    route: "/components/NewCustomerRegister",
    gradient: ["#4facfe", "#00f2fe"],
  },
  {
    id: "hotel",
    title: "Hotel Supply",
    subtitle: "Register your hotel for bulk supplies",
    icon: "location-city",
    iconType: MaterialIcons,
    route: "/components/HotelSupplyRegister",
    gradient: ["#43e97b", "#38f9d7"],
  },
  {
    id: "catering",
    title: "Catering Service",
    subtitle: "Provide catering services to customers",
    icon: "bowl",
    iconType: Entypo,
    route: "/components/CateringRegister",
    gradient: ["#fa709a", "#fee140"],
  },
];

export default function Register() {
  const router = useRouter();
  const { mobile } = useLocalSearchParams();
  const renderOptionCard = (option, index) => {
    const IconComponent = option.iconType;

    return (
      <TouchableOpacity
        key={option.id}
        style={[styles.card, { transform: [{ scale: 1 }] }]}
        onPress={() => router.replace({pathname:option.route, params: {mobile: mobile}})}
        activeOpacity={0.9}
        delayPressIn={0}
      >
        <LinearGradient
          colors={option.gradient}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <IconComponent name={option.icon} size={28} color="#fff" />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardSubtitle}>{option.subtitle}</Text>
            </View>

            <View style={styles.arrowContainer}>
              <MaterialIcons
                name="arrow-forward-ios"
                size={20}
                color="rgba(255,255,255,0.8)"
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Enhanced Banner with Overlay */}
        <View style={styles.bannerContainer}>
          <Image
            source={login1}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={[
              "transparent",
              "transparent",
              "rgba(255,255,255,0.1)",
              "rgba(255,255,255,0.8)",
              "#fff",
            ]}
            style={styles.bannerOverlay}
          />
        </View>

        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Image source={agskLogo} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={styles.headerTextContainer}>
            <Text style={styles.welcomeText}>
              Choose Your Registration Type
            </Text>
            <Text style={styles.subText}>
              Select the option that best describes you
            </Text>
          </View>
        </View>

        {/* Registration Options */}
        <View style={styles.optionsContainer}>
          {registrationOptions.map((option, index) => (
            <React.Fragment key={option.id}>
              {renderOptionCard(option, index)}
            </React.Fragment>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
