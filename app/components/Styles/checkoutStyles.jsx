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
    marginTop: 30,
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
});

