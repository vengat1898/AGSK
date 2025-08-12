import { Feather, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Clipboard from 'expo-clipboard';
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
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import qrCodeImage from "../../assets/images/Qrcode.png";
import styles from "./Styles/PayOnline.styles";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
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
    Alert.alert('Copied!', 'UPI ID copied to clipboard');
  };

  // Copy WhatsApp number to clipboard
  const copyWhatsAppNumber = async () => {
    const whatsappNumber = upiDetails?.whatsapp_number || "+91 98765 43210";
    await Clipboard.setStringAsync(whatsappNumber);
    Alert.alert('Copied!', 'WhatsApp number copied to clipboard');
  };
const saveQRCodeToGallery = async () => {
  try {
    if (!upiDetails?.qr_code_photo) {
      Alert.alert('Info', 'QR code not available for saving');
      return;
    }

    // Request media library permissions
    const permission = await MediaLibrary.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please allow photo access to save QR code');
      return;
    }

    // Download the image to device's cache directory
    const fileUri = FileSystem.cacheDirectory + `qr_code_${Date.now()}.png`;
    
    const downloadResult = await FileSystem.downloadAsync(
      upiDetails.qr_code_photo,
      fileUri
    );

    if (downloadResult.status === 200) {
      // Save to device gallery
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      await MediaLibrary.createAlbumAsync('Minsway QR Codes', asset, false);
      
      Alert.alert('Success', 'QR code saved to your photo gallery!');
    } else {
      throw new Error('Failed to download QR code');
    }
  } catch (error) {
    console.error('Error saving QR code:', error);
    Alert.alert('Error', 'Failed to save QR code. Please try again.');
  }
};
  // Open UPI payment directly
  const openUPIPayment = async () => {
    const upiId = upiDetails?.upi_number || "vengat@ybl";
    const amount = params.total_price || "0";
    const merchantName = "Minsway";
    
    // Standard UPI payment URL format
    const upiUrl = `upi://pay?pa=${upiId}&pn=${merchantName}&am=${amount}&cu=INR&tn=Payment for Order`;
    
    try {
      const canOpen = await Linking.canOpenURL(upiUrl);
      if (canOpen) {
        await Linking.openURL(upiUrl);
      } else {
        // Fallback: try to open popular UPI apps
        const upiApps = [
          { name: 'Google Pay', url: 'tez://upi/pay' },
          { name: 'PhonePe', url: 'phonepe://pay' },
          { name: 'Paytm', url: 'paytmmp://pay' },
          { name: 'BHIM', url: 'bhim://pay' }
        ];

        let appFound = false;
        for (const app of upiApps) {
          const canOpenApp = await Linking.canOpenURL(app.url);
          if (canOpenApp) {
            Alert.alert(
              'Open UPI App',
              `Open ${app.name} to make payment?`,
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Open', 
                  onPress: () => Linking.openURL(app.url)
                }
              ]
            );
            appFound = true;
            break;
          }
        }

        if (!appFound) {
          Alert.alert(
            'No UPI App Found', 
            'Please install a UPI app like Google Pay, PhonePe, or Paytm to make payment',
            [
              { text: 'OK', style: 'default' },
              { 
                text: 'Install Google Pay', 
                onPress: () => {
                  const playStoreUrl = Platform.OS === 'android' 
                    ? 'market://details?id=com.google.android.apps.nbu.paisa.user'
                    : 'https://apps.apple.com/app/google-pay/id1193357041';
                  Linking.openURL(playStoreUrl);
                }
              }
            ]
          );
        }
      }
    } catch (error) {
      console.error('Error opening UPI app:', error);
      Alert.alert('Error', 'Failed to open UPI app. Please try scanning the QR code manually.');
    }
  };

  // Save QR code to device gallery
 const saveQRCode = async () => {
  try {
    if (upiDetails?.qr_code_photo) {
      // Download the image to device's cache directory
      const fileUri = FileSystem.cacheDirectory + 'qr_code.png';
      
      const downloadResult = await FileSystem.downloadAsync(
        upiDetails.qr_code_photo,
        fileUri
      );

      if (downloadResult.status === 200) {
        // Now share the local file
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(downloadResult.uri, {
            mimeType: 'image/png',
            dialogTitle: 'Save QR Code'
          });
        } else {
          Alert.alert('Info', 'Sharing not available on this device');
        }
      } else {
        throw new Error('Failed to download QR code');
      }
    } else {
      Alert.alert('Info', 'QR code not available for saving');
    }
  } catch (error) {
    console.error('Error saving QR code:', error);
    Alert.alert('Error', 'Failed to save QR code. Please try again.');
  }
};

  // Open WhatsApp chat
  const openWhatsApp = async () => {
    const whatsappNumber = upiDetails?.whatsapp_number?.replace(/[^\d]/g, '') || "9876543210";
    const message = `Hi, I need help with payment for order total: ₹${params.total_price || "N/A"}`;
    
    const whatsappUrl = Platform.OS === 'android'
      ? `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`
      : `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    try {
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('WhatsApp Not Found', 'WhatsApp is not installed on this device.');
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      Alert.alert('Error', 'Failed to open WhatsApp');
    }
  };

  // Rest of your existing functions (pickImage, shareToWhatsApp, etc.) remain the same...
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
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets.length > 0) {
      setScreenshot(result.assets[0].uri);
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
const handleQRCodeActions = () => {
  Alert.alert(
    'QR Code Options',
    'What would you like to do?',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Share', onPress: saveQRCode },
      { text: 'Save to Gallery', onPress: saveQRCodeToGallery }
    ]
  );
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
        pincode,
        confirmOrder
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
            <Text style={[styles.infoText, { fontSize: 24, fontWeight: 'bold', color: '#2E7D32' }]}>
              ₹{params.total_price || "0"}
            </Text>
          </View>
        </View>

        {/* UPI ID Box with enhanced functionality */}
        <View style={styles.centerBox}>
          <Text style={styles.label}>UPI ID</Text>
          <View style={styles.infoBox}>
            {loadingUpi ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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

        {/* WhatsApp Number Box with enhanced functionality */}
        <View style={styles.centerBox}>
          <Text style={styles.label}>WhatsApp Support</Text>
          <View style={styles.infoBox}>
            {loadingUpi ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.infoText}>
                  {upiDetails?.whatsapp_number || "+91 98765 43210"}
                </Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity onPress={copyWhatsAppNumber} style={{ padding: 5 }}>
                    <Ionicons name="copy-outline" size={20} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={openWhatsApp} style={{ padding: 5 }}>
                    <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Enhanced QR Code Section */}
        <View style={styles.qrSection}>
          {loadingUpi ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <>
              <TouchableOpacity onLongPress={saveQRCode} activeOpacity={0.8}>
                <Image
                  source={upiDetails?.qr_code_photo ? { uri: upiDetails.qr_code_photo } : qrCodeImage}
                  style={[styles.qrImage, { backgroundColor: 'white', padding: 10, borderRadius: 10 }]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              
              {/* QR Code Action Buttons */}
              <View style={{ marginTop: 15, gap: 10 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#007AFF',
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                  onPress={openUPIPayment}
                >
                  <Ionicons name="card-outline" size={20} color="white" />
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                    Pay with UPI App
                  </Text>
                </TouchableOpacity>

                <Text style={{
                  textAlign: 'center',
                  color: '#666',
                  fontSize: 12,
                  fontStyle: 'italic'
                }}>
                  Long press QR code to save • Scan with any UPI app
                </Text>
              </View>
            </>
          )}
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
                  <Text style={styles.uploadSuccessText}>Uploaded Successfully</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueBtn,
            (!screenshot || isUploading || !uploadedImageUrl) && styles.continueBtnDisabled,
          ]}
          onPress={handleContinue}
          disabled={!screenshot || isUploading || !uploadedImageUrl}
        >
          <Text
            style={[
              styles.continueText,
              (!screenshot || isUploading || !uploadedImageUrl) && styles.continueTextDisabled,
            ]}
          >
            {isUploading ? 'Uploading...' : 'Complete Order'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}