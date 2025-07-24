// Add these styles to your existing PayOnline.styles.js file

const additionalStyles = StyleSheet.create({
  // ... your existing styles ...

  uploadedImageContainer: {
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

export default additionalStyles;