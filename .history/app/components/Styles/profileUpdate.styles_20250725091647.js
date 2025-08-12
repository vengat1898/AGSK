import { StyleSheet, StatusBar, Platform } from "react-native";

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
    paddingVertical: 15, // Reduced from 20 for better proportion
    paddingHorizontal: 5,
    minHeight: 40,
    borderBottomWidth:1,
    borderBottomColor:"green"
  },
  backButton: {
    padding: 8,
    // Ensure touchable area
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#29CB56",
    flex: 1,
    textAlign: "center",
    // Ensure text is vertically centered
    lineHeight: 24,
  },
  placeholder: {
    width: 40, // Match backButton minWidth for symmetry
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

export default styles;