import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },

  // SafeArea
  headerSafeArea: {
    backgroundColor: '#fff',
  },
  footerSafeArea: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  // Header
 header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 46,
    marginBottom: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#1a1a1a',
  },

  // Cart Card
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    minHeight: 100, // Ensure minimum height for better visual presence
  },
  productImage: {
    width: 55,
    height: 55,
    borderRadius: 8,
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
  },
  orderStatus: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    color: '#333',
  },
  productQuantity: {
    fontSize: 12,
    color: '#555',
  },

  // Date Picker
  dateTimeSelector: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    padding: 14,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateTimeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 10,
  },

  // Checkout Button
  checkoutButton: {
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom:20
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

