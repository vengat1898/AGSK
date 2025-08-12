import { Feather, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import qrCodeImage from "../../assets/images/Qrcode.png";
import styles from "./Styles/PayOnline.styles";

export default function PayOnline() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [screenshot, setScreenshot] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [upiDetails, setUpiDetails] = useState(null);
  const [loadingUpi, setLoadingUpi] = useState(true);

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

  // Copy UPI ID to clipboard
  const copyUPIId = async () => {
    const upiId = upiDetails?.upi_number || "vengat@ybl";
    await Clipboard.setStringAsync(upiId);
    Alert.alert("Copied!", "UPI ID copied to clipboard");
  };

  // Copy WhatsApp number to clipboard
  const copyWhatsAppNumber = async () => {
    const whatsappNumber = upiDetails?.whatsapp_number || "+91 98765 43210";
    await Clipboard.setStringAsync(whatsappNumber);
    Alert.alert("Copied!", "WhatsApp number copied to clipboard");
  };

  // Save QR code to device gallery
  const saveQRCodeToGallery = async () => {
    try {
      if (!upiDetails?.qr_code_photo) {
        Alert.alert("Error", "QR code not available");
        return;
      }

      // Request permissions first
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow photo access to save QR code to gallery"
        );
        return;
      }

      // Create unique filename
      const timestamp = Date.now();
      const fileName = `minsway_qr_${timestamp}.png`;
      const fileUri = FileSystem.documentDirectory + fileName;

      // Download the QR code image
      const downloadResult = await FileSystem.downloadAsync(
        upiDetails.qr_code_photo,
        fileUri
      );

      if (downloadResult.status !== 200) {
        throw new Error("Failed to download QR code");
      }

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);

      // Try to create album (optional, will use default if fails)
      try {
        await MediaLibrary.createAlbumAsync("Minsway", asset, false);
      } catch (albumError) {
        console.log("Album creation failed, saved to default location");
      }

      // Clean up temporary file
      await FileSystem.deleteAsync(downloadResult.uri, { idempotent: true });

      Alert.alert("Success", "QR code saved to your photo gallery!");
    } catch (error) {
      console.error("Error saving QR code to gallery:", error);
      Alert.alert(
        "Error",
        "Failed to save QR code to gallery. Please try again."
      );
    }
  };

  // Share QR code
  const shareQRCode = async () => {
    try {
      if (!upiDetails?.qr_code_photo) {
        Alert.alert("Error", "QR code not available for sharing");
        return;
      }

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Error", "Sharing not available on this device");
        return;
      }

      // Create temporary file
      const timestamp = Date.now();
      const fileName = `minsway_qr_${timestamp}.png`;
      const fileUri = FileSystem.cacheDirectory + fileName;

      // Download the image
      const downloadResult = await FileSystem.downloadAsync(
        upiDetails.qr_code_photo,
        fileUri
      );

      if (downloadResult.status === 200) {
        // Share the downloaded file
        await Sharing.shareAsync(downloadResult.uri, {
          mimeType: "image/png",
          dialogTitle: "Share QR Code",
          UTI: "public.png",
        });

        // Clean up after sharing
        setTimeout(async () => {
          try {
            await FileSystem.deleteAsync(downloadResult.uri, {
              idempotent: true,
            });
          } catch (cleanupError) {
            console.log("Cleanup error:", cleanupError);
          }
        }, 5000);
      } else {
        throw new Error("Failed to download QR code for sharing");
      }
    } catch (error) {
      console.error("Error sharing QR code:", error);
      Alert.alert("Error", "Failed to share QR code. Please try again.");
    }
  };

  // QR code actions handler
  const handleQRCodeActions = () => {
    const actions = [
      { text: "Cancel", style: "cancel" },
      { text: "Share QR Code", onPress: shareQRCode },
    ];

    // Only add "Save to Gallery" option for mobile platforms
    if (Platform.OS === "android" || Platform.OS === "ios") {
      actions.push({ text: "Save to Gallery", onPress: saveQRCodeToGallery });
    }

    Alert.alert("QR Code Options", "Choose an action:", actions);
  };

  // Copy UPI payment details for manual entry
  const copyPaymentDetails = async () => {
    const upiId = upiDetails?.upi_number || "vengat@ybl";
    const amount = params.total_price || "0";
    const paymentDetails = `UPI ID: ${upiId}\nAmount: ₹${amount}\nMerchant: Minsway\nNote: Payment for Minsway Order`;

    await Clipboard.setStringAsync(paymentDetails);
    Alert.alert(
      "Payment Details Copied!",
      "You can now paste these details in your UPI app for manual payment."
    );
  };

  // Open WhatsApp chat
  const openWhatsApp = async () => {
    const whatsappNumber =
      upiDetails?.whatsapp_number?.replace(/[^\d]/g, "") || "9876543210";
    const message = `Hi, I need help with payment for order total: ₹${
      params.total_price || "N/A"
    }`;

    const whatsappUrl =
      Platform.OS === "android"
        ? `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(
            message
          )}`
        : `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    try {
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert(
          "WhatsApp Not Found",
          "WhatsApp is not installed on this device."
        );
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      Alert.alert("Error", "Failed to open WhatsApp");
    }
  };

  // Pick image for screenshot upload
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
      mediaTypes: [ImagePicker.MediaType.Images], 
      allowsEditing: true,
      quality: 0.8,
      aspect: [3, 4], // Portrait ratio (width:height)
    });

    if (!result.canceled && result.assets.length > 0) {
      setScreenshot(result.assets[0].uri);
      await uploadImageToServer(result.assets[0]);
    }
  };

  // Upload image to server
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
        name:
          imageAsset.fileName ||
          `payment_screenshot_${Date.now()}.${fileExtension}`,
      });

      const apiUrl = "https://minsway.co.in/leaf/mb/customer/upload_file";
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      });

      if (response.data.success === true || response.data.success === 1) {
        setUploadedImageUrl(response.data.filename || response.data.file_name);
        Alert.alert("Success", "Payment screenshot uploaded successfully!");
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("❌ Image Upload Error:", error);
      setScreenshot(null);
      setUploadedImageUrl(null);
      Alert.alert("Upload Error", "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle final order completion
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
        pincode,
        confirmOrder,
      } = params;

      const apiUrl = `https://minsway.co.in/leaf/mb/Finalplaceorder/final_update`;
      const finalParams = {
        mobile,
        orginal_price: original_price,
        delivery: delivery_charge,
        total_price,
        address,
        second_mobile: mobile,
        payment_type: "online",
        order_image: uploadedImageUrl,
        pincode,
        order_date,
        delivery_date,
        type,
        order_id: "[" + confirmOrder + "]",
      };

      const response = await axios.get(apiUrl, { params: finalParams });

      if (response.data.success === 1) {
        const { weburl, order_id } = response.data.data;

        Alert.alert(
          "Order Confirmed",
          "Your online order has been placed successfully!",
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
      console.error("❌ FINAL ORDER ERROR:", error);
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

        {/* Payment Amount Display */}
        <View style={styles.centerBox}>
          <Text style={styles.label}>Payment Amount</Text>
          <View style={styles.infoBox}>
            <Text
              style={[
                styles.infoText,
                { fontSize: 24, fontWeight: "bold", color: "#2E7D32" },
              ]}
            >
              ₹{params.total_price || "0"}
            </Text>
          </View>
        </View>

        {/* QR Code Section - Main Focus */}
        <View style={styles.qrSection}>
          <Text
            style={[
              styles.label,
              {
                textAlign: "center",
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 15,
              },
            ]}
          >
            Scan QR Code to Pay
          </Text>

          {loadingUpi ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <>
              <TouchableOpacity
                onPress={handleQRCodeActions}
                activeOpacity={0.8}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 15,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={
                      upiDetails?.qr_code_photo
                        ? { uri: upiDetails.qr_code_photo }
                        : qrCodeImage
                    }
                    style={[styles.qrImage, { width: 200, height: 200 }]}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>

              {/* QR Code Action Buttons */}
              <View style={{ marginTop: 20, gap: 12 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#007AFF",
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                  onPress={handleQRCodeActions}
                >
                  <Ionicons name="download-outline" size={20} color="white" />
                  <Text
                    style={{ color: "white", fontWeight: "600", fontSize: 16 }}
                  >
                    Save or Share QR Code
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#34C759",
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                  onPress={copyPaymentDetails}
                >
                  <Ionicons name="copy-outline" size={20} color="white" />
                  <Text
                    style={{ color: "white", fontWeight: "600", fontSize: 16 }}
                  >
                    Copy Payment Details
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    backgroundColor: "#F8F9FA",
                    padding: 15,
                    borderRadius: 10,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#666",
                      fontSize: 14,
                      lineHeight: 20,
                    }}
                  >
                    📱 Open any UPI app (Google Pay, PhonePe, Paytm, BHIM){"\n"}
                    📷 Scan the QR code above{"\n"}
                    💳 Complete your payment of ₹{params.total_price || "0"}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* UPI ID Box - Secondary Info */}
        <View style={styles.centerBox}>
          <Text style={styles.label}>UPI ID (For Manual Payment)</Text>
          <View style={styles.infoBox}>
            {loadingUpi ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.infoText}>
                  {upiDetails?.upi_number || "vengat@ybl"}
                </Text>
                <TouchableOpacity onPress={copyUPIId} style={{ padding: 5 }}>
                  <Ionicons name="copy-outline" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* WhatsApp Support */}
        <View style={styles.centerBox}>
          <Text style={styles.label}>Need Help? Contact Support</Text>
          <View style={styles.infoBox}>
            {loadingUpi ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.infoText}>
                  {upiDetails?.whatsapp_number || "+91 98765 43210"}
                </Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    onPress={copyWhatsAppNumber}
                    style={{ padding: 5 }}
                  >
                    <Ionicons name="copy-outline" size={20} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={openWhatsApp}
                    style={{ padding: 5 }}
                  >
                    <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Upload Screenshot Section */}
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
                  <Text style={styles.uploadSuccessText}>
                    Uploaded Successfully
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueBtn,
            (!screenshot || isUploading || !uploadedImageUrl) &&
              styles.continueBtnDisabled,
          ]}
          onPress={handleContinue}
          disabled={!screenshot || isUploading || !uploadedImageUrl}
        >
          <Text
            style={[
              styles.continueText,
              (!screenshot || isUploading || !uploadedImageUrl) &&
                styles.continueTextDisabled,
            ]}
          >
            {isUploading ? "Uploading..." : "Complete Order"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
