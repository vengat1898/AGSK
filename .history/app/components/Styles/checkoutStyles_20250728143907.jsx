import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeHeader: {
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerBackButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  locationBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  useLocationText: {
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  enquiryContainer: {
    marginTop: 10,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  invoiceBox: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    backgroundColor: '#fafafa',
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  invoiceLabel: {
    fontSize: 14,
    color: '#666',
  },
  invoiceValue: {
    fontSize: 14,
    color: '#333',
  },
  invoicePositive: {
    fontSize: 14,
    color: 'green',
  },
  invoiceNegative: {
    fontSize: 14,
    color: 'red',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  shippingBox: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  shippingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  shippingName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  shippingType: {
    fontSize: 14,
    color: '#666',
  },
  shippingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  shippingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  editButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  editText: {
    color: 'green',
    fontSize: 14,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  paymentButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  onlinePayment: {
    backgroundColor: '#e3f2fd',
    marginRight: 10,
  },
  codPayment: {
    backgroundColor: '#e8f5e9',
    marginLeft: 10,
  },
  paymentButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  actionButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  proceedButton: {
    backgroundColor: 'green',
  },
  enquiryButton: {
    backgroundColor: 'orange',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  pincodeItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pincodeText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#333',
  },



  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalBox: {
  width: '90%',
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20,
  maxHeight: '80%',
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 15,
  textAlign: 'center',
},
addressInput: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  padding: 15,
  minHeight: 120,
  textAlignVertical: 'top',
  marginBottom: 20,
},
modalButtonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},
modalButton: {
  padding: 12,
  borderRadius: 8,
  width: '48%',
  alignItems: 'center',
},
cancelButton: {
  backgroundColor: '#e74c3c',
},
saveButton: {
  backgroundColor: '#2ecc71',
},
modalButtonText: {
  color: 'white',
  fontWeight: 'bold',
},productSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productSize: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  }, paymentSelectBox: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentSelectText: {
    fontSize: 16,
    color: '#333',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  selectedPaymentOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#f8fff8',
  },
  paymentOptionText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  selectedPaymentOptionText: {
    color: '#4CAF50',
    fontWeight: '600',
  },

  // Enhanced Address Input
  addressInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },

  // Button States
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },

  // Modal Enhancements
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Existing styles that might need updates
  actionButton: {
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  proceedButton: {
    backgroundColor: '#4CAF50',
  },
  enquiryButton: {
    backgroundColor: '#2196F3',
  },

  couponBannerContainer: {
  width: '100%',
  height: 110,
  marginTop: 10,
  marginBottom: 10,
},
couponImageFullWidth: {
  width: '90%',
  height: '100%',
  marginLeft:14
},
couponTextOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.3)',
  paddingHorizontal: 20,
},
couponBannerText: {
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
  textShadowColor: 'rgba(0,0,0,0.5)',
  textShadowOffset: {width: 1, height: 1},
  textShadowRadius: 2,
},
couponBannerSubtext: {
  color: 'white',
  fontSize: 14,
  marginTop: 5,
  textAlign: 'center',
  textShadowColor: 'rgba(0,0,0,0.5)',
  textShadowOffset: {width: 1, height: 1},
  textShadowRadius: 2,
},

// Coupon Modal Styles
couponModalContent: {
  backgroundColor: '#fff',
  width: '90%',
  maxHeight: '80%',
  borderRadius: 10,
  padding: 20,
  paddingBottom: 10,
},
couponList: {
  marginVertical: 15,
},
couponItem: {
  backgroundColor: '#f8f9fa',
  padding: 15,
  borderRadius: 8,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: '#e9ecef',
},
selectedCouponItem: {
  borderColor: '#28a745',
  backgroundColor: '#e6f7ee',
},
couponCode: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#28a745',
  marginBottom: 5,
},
couponDescription: {
  fontSize: 14,
  color: '#495057',
  marginBottom: 3,
},
couponTerms: {
  fontSize: 12,
  color: '#6c757d',
},
couponSelectedIndicator: {
  position: 'absolute',
  right: 15,
  top: 15,
},
couponModalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 10,
  textAlign: 'center',
},

modalActions: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 15,
},
modalButton: {
  flex: 1,
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  marginHorizontal: 5,
},
cancelButton: {
  backgroundColor: '#f44336',
},
applyButton: {
  backgroundColor: '#4CAF50',
},
disabledButton: {
  opacity: 0.6,
},

removeCouponButton: {
  alignSelf: 'flex-end',
  backgroundColor: '#FFF0F0', // Light red background
  borderRadius: 8,
  paddingVertical: 8,
  paddingHorizontal: 12,
  // marginTop: 10,
  // marginRight: 15,
  marginBottom:10,
  borderWidth: 1,
  borderColor: '#FFCCCC',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
removeCouponText: {
  color: '#D32F2F', // Darker red for better contrast
  fontSize: 14,
  fontWeight: '500',
  marginLeft: 5,
},
couponSection: {
    marginBottom: 20,
  },
  couponDropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  couponDropdownText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  couponDropdownList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginTop: 5,
    maxHeight: 300,
  },
  couponDropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  selectedCouponDropdownItem: {
    backgroundColor: '#e8f5e8',
    borderColor: '#28a745',
  },
  couponItemContent: {
    flex: 1,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  couponDiscount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  couponDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  couponTerms: {
    fontSize: 12,
    color: '#999',
  },
  noCouponsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noCouponsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  removeCouponButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 5,
    alignItems: 'center',
  },
  removeCouponText: {
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: '500',
  },
});

