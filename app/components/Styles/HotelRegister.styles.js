import { StyleSheet, Dimensions,Platform } from "react-native";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
    minHeight: height,
  },
  formWrapper: { 
    width: width * 0.9, 
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#29CB56",
    marginBottom: 30,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    color: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  disabledInput: {
    backgroundColor: "#F5F5F5",
    color: "#666",
    borderColor: "#D0D0D0",
  },
  addressContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  addressInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 10,
    minHeight: 80,
    paddingTop: 14,
  },
  locationButton: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#E8F5E8",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Image Upload Styles
  imageSection: {
    width: "100%",
    marginBottom: 20,
  },
  uploadBox: {
    width: "100%",
    minHeight: 120,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  uploadingBox: {
    opacity: 0.7,
    borderColor: "#29CB56",
  },
  uploadContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  uploadText: {
    color: "#29CB56",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  uploadSubText: {
    color: "#999",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  
  // Image Preview Styles
  imagePreviewContainer: {
    width: "100%",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
    marginBottom: 10,
  },
  changeImageButton: {
    backgroundColor: "#29CB56",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginBottom:5
  },
  changeImageText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  
  // Success Message Styles
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    padding: 8,
    backgroundColor: "#E8F5E8",
    borderRadius: 6,
  },
  successText: {
    color: "#29CB56",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  
  // Button Styles
  button: {
    backgroundColor: "#29CB56",
    paddingVertical: 16,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#29CB56",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
    shadowOpacity: 0.1,
    elevation: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  uploadContent: {
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
},
uploadText: {
  marginTop: 10,
  fontSize: 16,
  fontWeight: '500',
  color: '#333',
},
uploadSubText: {
  marginTop: 5,
  fontSize: 12,
  color: '#777',
},
});

export default styles;