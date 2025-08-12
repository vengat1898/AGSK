import { Feather, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import qrCodeImage from "../../assets/images/Qrcode.png";
import styles from "./Styles/PayOnline.styles";
import Sa
export default function PayOnline() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [screenshot, setScreenshot] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [upiDetails, setUpiDetails] = useState(null); // Added state for UPI details
  const [loadingUpi, setLoadingUpi] = useState(true); // Added loading state

  useEffect(() => {
    const fetchUpiDetails = async () => {
      try {
        const response = await axios.get(
          `https://minsway.co.in/leaf/mb/Upi/upi?mobile=${params.mobile}`
        );
        
        if (response.data.success === 1) {
          setUpiDetails(response.data.data);
        } else {
          console.error("Failed to fetch UPI details:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching UPI details:", error);
      } finally {
        setLoadingUpi(false);
      }
    };

    fetchUpiDetails();
  }, [params.mobile]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow media access to upload image."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      aspect: [4, 3], // Good aspect ratio for screenshots
    });

    if (!result.canceled && result.assets.length > 0) {
      setScreenshot(result.assets[0].uri);
      // Upload image to server immediately after selection
      await uploadImageToServer(result.assets[0]);
    }
  };

  const shareToWhatsApp = async () => {
    if (!screenshot) {
      Alert.alert("No Image", "Please select a screenshot first to share.");
      return;
    }

    try {
      const message = `Payment Screenshot - Order Total: ₹${
        params.total_price || "N/A"
      }`;

      if (Platform.OS === "android") {
        // For Android, use WhatsApp intent with image
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(
          message
        )}`;

        const canOpen = await Linking.canOpenURL(whatsappUrl);
        if (canOpen) {
          // First share the image using expo-sharing
          const isAvailable = await Sharing.isAvailableAsync();
          if (isAvailable) {
            await Sharing.shareAsync(screenshot, {
              mimeType: "image/jpeg",
              dialogTitle: "Share Payment Screenshot",
            });
          } else {
            // Fallback to general share
            await Share.share({
              url: screenshot,
              message: message,
            });
          }
        } else {
          Alert.alert(
            "WhatsApp Not Found",
            "WhatsApp is not installed on this device."
          );
        }
      } else {
        // For iOS, use the general share sheet
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(screenshot, {
            mimeType: "image/jpeg",
            dialogTitle: "Share Payment Screenshot to WhatsApp",
          });
        } else {
          await Share.share({
            url: screenshot,
            message: message,
          });
        }
      }
    } catch (error) {
      console.error("WhatsApp Share Error:", error);
      Alert.alert(
        "Share Error",
        "Failed to share screenshot. Please try again."
      );
    }
  };

  const shareViaIntent = async () => {
    if (!screenshot) {
      Alert.alert("No Image", "Please select a screenshot first to share.");
      return;
    }

    try {
      const message = `Payment Screenshot\nOrder Details:\nTotal: ₹${
        params.total_price || "N/A"
      }\nDelivery Date: ${params.delivery_date || "N/A"}`;

      // Use Expo's sharing API which handles different platforms
      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        await Sharing.shareAsync(screenshot, {
          mimeType: "image/jpeg",
          dialogTitle: "Share Payment Screenshot",
        });
      } else {
        // Fallback to React Native's Share API
        await Share.share(
          {
            message: message,
            url: screenshot,
            title: "Payment Screenshot",
          },
          {
            dialogTitle: "Share Payment Screenshot",
            subject: "Payment Confirmation",
          }
        );
      }
    } catch (error) {
      console.error("Share Error:", error);
      Alert.alert(
        "Share Error",
        "Failed to share screenshot. Please try again."
      );
    }
  };

  const uploadImageToServer = async (imageAsset) => {
    if (!imageAsset) return;

    setIsUploading(true);
    try {
      const formData = new FormData();

      // Get file extension and determine MIME type
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
        name:
          imageAsset.fileName ||
          `payment_screenshot_${Date.now()}.${fileExtension}`,
      });

      // Replace with your actual API endpoint
      const apiUrl = "https://minsway.co.in/leaf/mb/customer/upload_file";

      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      console.log("Upload response:", response.data);

      if (response.data.success === true || response.data.success === 1) {
        setUploadedImageUrl(response.data.filename || response.data.file_name);
        Alert.alert("Success", "Payment screenshot uploaded successfully!");
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("❌ Image Upload Error:", error);

      // Clear the screenshot on upload failure
      setScreenshot(null);
      setUploadedImageUrl(null);

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
          error.message || "Failed to upload image. Please try again."
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinue = async () => {
    if (!screenshot) {
      Alert.alert(
        "Upload Required",
        "Please upload a payment screenshot before proceeding."
      );
      return;
    }

    if (!uploadedImageUrl) {
      Alert.alert(
        "Upload Pending",
        "Please wait for the image to finish uploading."
      );
      return;
    }

    try {
      const {
        user_id,
        mobile,
        address,
        original_price,
        delivery_charge,
        total_price,
        delivery_date,
        order_date,
        type,
        pincode,confirmOrder
      } = params;

      const apiUrl = `https://minsway.co.in/leaf/mb/Finalplaceorder/final_update`;

      const finalParams = {
        mobile,
        orginal_price: original_price, // Note: keeping original spelling from your code
        delivery: delivery_charge,
        total_price,
        address,
        second_mobile: mobile,
        payment_type: "online",
        order_image: uploadedImageUrl, // Use the uploaded filename from server
        pincode,
        order_date,
        delivery_date,
        type,
        order_id: "[" + confirmOrder + "]",
      };

      console.log("\n================ FINAL ORDER REQUEST ================");
      console.log("🧾 API URL:", apiUrl);
      console.log("📦 Params:", finalParams);
      console.log("====================================================\n");

      const response = await axios.get(apiUrl, { params: finalParams });

      console.log("\n================ FINAL ORDER RESPONSE ===============");
      console.log("✅ Response Data:", response.data);
      console.log("====================================================\n");

     if (response.data.success === 1) {
        const { weburl, order_id } = response.data.data;

        Alert.alert(
          "Order Confirmed",
          "Your COD order has been placed successfully!",
          [
            {
              text: "View Invoice",
              onPress: () => {
                router.replace({
                  pathname: "/components/Invoice",
                  params: {
                    weburl: weburl,
                    order_id: order_id,
                    mobile: mobile,
                    type: type,
                    id: user_id,
                  },
                });
              },
            },
            {
              text: "Go to Home",
              style: "cancel",
              onPress: () => router.replace("/components/Home"),
            },
          ]
        );
      } else {
        Alert.alert("Failed", response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("\n❌ FINAL ORDER ERROR ================================");
      console.error(error);
      console.error("====================================================\n");
      Alert.alert("Error", "Failed to place order. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/components/Checkout")}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pay Online</Text>
        </View>

      {/* UPI ID Box */}
        <View style={styles.centerBox}>
          <Text style={styles.label}>UPI ID</Text>
          <View style={styles.infoBox}>
            {loadingUpi ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.infoText}>
                {upiDetails?.upi_number || "vengat@ybl"}
              </Text>
            )}
          </View>
        </View>

        {/* GPay Number Box */}
        <View style={styles.centerBox}>
          <Text style={styles.label}>WhatsApp Number</Text>
          <View style={styles.infoBox}>
            {loadingUpi ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.infoText}>
                {upiDetails?.whatsapp_number || "+91 98765 43210"}
              </Text>
            )}
          </View>
        </View>

        {/* QR Code */}
        <View style={styles.qrSection}>
          {loadingUpi ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <Image
              source={upiDetails?.qr_code_photo ? { uri: upiDetails.qr_code_photo } : qrCodeImage}
              style={styles.qrImage}
              resizeMode="contain"
            />
          )}
        </View>


        {/* Upload Screenshot */}
        <View style={styles.uploadSection}>
          <Text style={styles.label}>Upload Payment Screenshot</Text>
          <TouchableOpacity
            style={[styles.uploadBtn, isUploading && styles.uploadBtnDisabled]}
            onPress={pickImage}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Feather name="image" size={20} color="#000" />
            )}
            <Text style={styles.uploadText}>
              {isUploading ? " Uploading..." : " Choose Image"}
            </Text>
          </TouchableOpacity>

          {screenshot && (
            <View style={styles.uploadedImageContainer}>
              <Image
                source={{ uri: screenshot }}
                style={styles.uploadedImage}
              />
              {uploadedImageUrl && (
                <View style={styles.uploadSuccessIndicator}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.uploadSuccessText}>Uploaded</Text>
                </View>
              )}

              {/* Share Options */}
              <View style={styles.shareContainer}>
                <TouchableOpacity
                  style={styles.shareBtn}
                  onPress={shareToWhatsApp}
                >
                  <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                  <Text style={styles.shareBtnText}>WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.shareBtn}
                  onPress={shareViaIntent}
                >
                  <Feather name="share-2" size={20} color="#007AFF" />
                  <Text style={styles.shareBtnText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueBtn,
            (!screenshot || isUploading) && styles.continueBtnDisabled,
          ]}
          onPress={handleContinue}
          disabled={!screenshot || isUploading || !uploadedImageUrl}
        >
          <Text
            style={[
              styles.continueText,
              (!screenshot || isUploading) && styles.continueTextDisabled,
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
