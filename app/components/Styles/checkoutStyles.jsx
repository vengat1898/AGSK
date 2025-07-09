import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  container: {
  flex: 1,
  backgroundColor: '#f9f9f9',
},

safeHeader: {
  backgroundColor: '#fff',
},

header: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderColor: '#ddd',
  marginTop:30
},

headerBackButton: {
  marginRight: 10,
},

headerTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#000',
},

scrollContent: {
  padding: 16,
  paddingBottom: 32,
},

  locationBox: {
  backgroundColor: '#fff',
  padding: 14,
  borderRadius: 8,
  marginBottom: 16,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#e5e5e5',
  },
  useLocationText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  invoiceBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderColor: '#e5e5e5',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    color: '#444',
  },
  value: {
    color: '#222',
  },
  positive: {
    color: 'red',
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1a3e2e',
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1a3e2e',
  },
  deliveryTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#1a3e2e',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  deliveryTimeText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1a3e2e',
  },
  shippingBox: {
    borderColor: '#e5e5e5',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  shippingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shippingName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  shippingType: {
    color: 'green',
    fontWeight: '600',
  },
  rowIcon: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  shippingText: {
    marginLeft: 8,
    color: '#333',
    flex: 1,
  },
  editButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  editText: {
    color: '#1a3e2e',
    fontWeight: '500',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10,
  },
  payButton: {
    borderColor: '#1a3e2e',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    alignItems: 'center',
  },
  payText: {
    color: '#1a3e2e',
    fontWeight: '500',
  },
  instructionsText: {
    textAlign: 'center',
    color: '#1a3e2e',
    marginTop: 20,
    fontWeight: '600',
  },
  checkoutButton: {
    backgroundColor: '#1a3e2e',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 14,
  },
  checkoutText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
