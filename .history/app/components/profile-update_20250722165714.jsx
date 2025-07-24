import api from "@/services/api";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SessionContext } from "../../context/SessionContext";

const { width, height } = Dimensions.get("window");

export default function ProfileUpdate() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [cateringName, setCateringName] = useState("");
  const [image, setImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState(1); // 1: Customer, 2: Hotel, 3: Catering

  const { session, saveSession } = useContext(SessionContext);
  const router = useRouter();

  // Load user profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);

      if (session) {
        setName(session.name || "");
        setEmail(session.email || "");
        setMobile(session.mobile || "");
        setUserType(session.type || 1);

        const response = await api.get(
          `/Customer/fetch_profile_by_id?customer_id=${session.id}`
        );
        console.log("====================================");
        console.log(response.data);
        console.log("====================================");
        if (response.data.status === 1) {
          const profileData = response.data.data;
          setAddress(profileData.address || "");
          setCateringName(profileData.cat_name || profileData.hotel_name || "");
          setImage(
            profileData.image
              ? `${api.defaults.baseURL}/uploads/${profileData.image}`
              : null
          );
          setUploadedImageUrl(profileData.image || null);
        }
      }
    } catch (error) {
      console.error("❌ Profile Load Error:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Please allow media access to upload image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect for profile pictures
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await uploadImageToServer(result.assets[0]);
    }
  };

  const uploadImageToServer = async (imageAsset) => {
    if (!imageAsset) return;

    setIsUploading(true);
    try {
      const formData = new FormData();

      const fileExtension = imageAsset.fileName
        ? imageAsset.fileName.split(".").pop().toLowerCase()
        : "jpg";
      const mimeType =
        fileExtension === "png"
          ? "image/png"
          : fileExtension === "gif"
          ? "image/gif"
          : "image/jpeg";

      formData.append("file", {
        uri: imageAsset.uri,
        type: mimeType,
        name: imageAsset.fileName || `profile_${Date.now()}.${fileExtension}`,
      });

      const response = await api.post("/customer/upload_file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      if (response.data.success === true) {
        setUploadedImageUrl(response.data.filename);
        Alert.alert("Success", "Profile image updated successfully!");
      } else {
        Alert.alert(
          "Upload Failed",
          response.data.message || "Failed to upload image"
        );
        setImage(null);
      }
    } catch (error) {
      console.error("❌ Image Upload Error:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
        Alert.alert("Upload Error", errorMessage);
      } else if (error.request) {
        Alert.alert(
          "Network Error",
          "Cannot connect to server. Please check your internet connection and try again."
        );
      } else {
        Alert.alert(
          "Upload Error",
          "Failed to upload image. Please try again."
        );
      }

      setImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please allow location access to fetch address."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (place) {
        const addressParts = [
          place.name,
          place.street,
          place.city,
          place.region,
          place.postalCode,
        ].filter(Boolean);

        const fullAddress = addressParts.join(", ");
        setAddress(fullAddress);
      } else {
        Alert.alert("Error", "Could not retrieve address");
      }
    } catch (error) {
      console.error("❌ Location Error:", error);
      Alert.alert("Error", "Unable to fetch location");
    }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim() || !mobile.trim()) {
      Alert.alert("Missing Fields", "Name and Mobile are required fields");
      return;
    }

    if (mobile.length !== 10 || !/^\d{10}$/.test(mobile)) {
      Alert.alert(
        "Invalid Mobile Number",
        "Please enter a valid 10-digit number"
      );
      return;
    }

    // Email validation (optional field)
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    setIsUpdating(true);
    try {
      const updateData = {
        customer_id: session.id,
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
        image: uploadedImageUrl,
      };

      // Add business name based on user type
      if (userType === 2) {
        updateData.hotel_name = cateringName.trim();
      } else if (userType === 3) {
        updateData.cat_name = cateringName.trim();
      }
      console.log("====================================");
      console.log(updateData);
      console.log("====================================");
      const response = await api.post("/Customer/profile_update", updateData);
      console.log('====================================');
      console.log(response.data);
      console.log('====================================');
      if (response.data.status === 1) {
        await saveSession({
          ...session,
          name: name.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
        });

        Alert.alert("Success", "Profile updated successfully!", [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else {
        Alert.alert(
          "Update Failed",
          response.data.message || "Something went wrong"
        );
      }
    } catch (error) {
      console.error("❌ Profile Update Error:", error);
      Alert.alert("Error", "Something went wrong while updating profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 2:
        return "Hotel Name";
      case 3:
        return "Catering Name";
      default:
        return "Business Name";
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#29CB56" />
          <Text style={styles.loadingText}>Loading Profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#29CB56" />
            </TouchableOpacity>
            <Text style={styles.title}>Update Profile</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.formWrapper}>
            {/* Profile Image Section */}
            <View style={styles.profileImageSection}>
              <TouchableOpacity
                style={styles.profileImageContainer}
                onPress={handleImagePick}
                disabled={isUploading || isUpdating}
              >
                {isUploading ? (
                  <View style={styles.uploadingContainer}>
                    <ActivityIndicator size="large" color="#29CB56" />
                    <Text style={styles.uploadingText}>Uploading...</Text>
                  </View>
                ) : image ? (
                  <>
                    <Image
                      source={{ uri: image }}
                      style={styles.profileImage}
                    />
                    <View style={styles.editImageOverlay}>
                      <Feather name="edit-2" size={16} color="#fff" />
                    </View>
                  </>
                ) : (
                  <View style={styles.placeholderImage}>
                    <MaterialIcons name="add-a-photo" size={40} color="#999" />
                    <Text style={styles.addPhotoText}>Add Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
                returnKeyType="next"
              />

              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />

              <Text style={styles.inputLabel}>Mobile Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit mobile number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onChangeText={setMobile}
                returnKeyType="next"
              />

              {(userType === 2 || userType === 3) && (
                <>
                  <Text style={styles.inputLabel}>{getUserTypeLabel()}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={`Enter ${getUserTypeLabel().toLowerCase()}`}
                    placeholderTextColor="#999"
                    value={cateringName}
                    onChangeText={setCateringName}
                    returnKeyType="next"
                  />
                </>
              )}

              <Text style={styles.inputLabel}>Address</Text>
              <View style={styles.addressContainer}>
                <TextInput
                  style={[styles.input, styles.addressInput]}
                  placeholder="Enter your address"
                  placeholderTextColor="#999"
                  value={address}
                  onChangeText={setAddress}
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                  returnKeyType="done"
                />
                <TouchableOpacity
                  onPress={handleUseCurrentLocation}
                  style={styles.locationButton}
                  disabled={isUploading || isUpdating}
                >
                  <Ionicons name="location-outline" size={22} color="#29CB56" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.updateButton,
                (isUploading || isUpdating) && styles.buttonDisabled,
              ]}
              onPress={handleUpdateProfile}
              disabled={isUploading || isUpdating}
            >
              {isUpdating ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.buttonText}>Updating...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Update Profile</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#29CB56",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  formWrapper: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  profileImageSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#29CB56",
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 57,
    resizeMode: "cover",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  addPhotoText: {
    color: "#999",
    fontSize: 12,
    fontWeight: "500",
  },
  editImageOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#29CB56",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  uploadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  uploadingText: {
    color: "#29CB56",
    fontSize: 12,
    fontWeight: "500",
  },
  inputSection: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  addressInput: {
    flex: 1,
    marginRight: 10,
    minHeight: 80,
    paddingTop: 14,
  },
  locationButton: {
    padding: 12,
    backgroundColor: "#E6F6EC",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
  },
  updateButton: {
    backgroundColor: "#29CB56",
    paddingVertical: 16,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#A8E6C1",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
