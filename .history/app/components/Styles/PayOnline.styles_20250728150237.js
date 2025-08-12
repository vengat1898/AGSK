import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  centerBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#f6fff6',
  },
  infoText: {
    fontSize: 16,
    color: '#000',
  },
  qrSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  qrImage: {
    width: 200,
    height: 200,
  },
   uploadSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  uploadBtnDisabled: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  uploadText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  uploadedImageContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  uploadedImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  uploadSuccessIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  uploadSuccessText: {
    color: '#4CAF50',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  continueBtn: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueBtnDisabled: {
    backgroundColor: '#cccccc',
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueTextDisabled: {
    color: '#999',
  }, uploadedImageContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  
  uploadedImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  
  uploadSuccessIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  
  uploadSuccessText: {
    marginLeft: 5,
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500',
  },

  // New share-related styles
  shareContainer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
    gap: 15,
  },
  
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 100,
    justifyContent: 'center',
  },
  
  shareBtnText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  
  uploadSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  
  uploadBtnDisabled: {
    opacity: 0.6,
  },
  
  uploadText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  
  continueBtn: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  continueBtnDisabled: {
    backgroundColor: '#ccc',
  },
  
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  continueTextDisabled: {
    color: '#999',
  },
});
export default styles;