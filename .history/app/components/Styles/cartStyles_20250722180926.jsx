import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },

  // SafeArea
  headerSafeArea: {
    backgroundColor: "#fff",
  },
  footerSafeArea: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 46,
    marginBottom: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    color: "#1a1a1a",
  },

  // Cart Card
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    minHeight: 100, // Ensure minimum height for better visual presence
  },
  productImage: {
    width: 75, // Increased from 55
    height: 75, // Increased from 55
    borderRadius: 10,
    marginRight: 16, // Increased spacing
    backgroundColor: "#f5f5f5", // Fallback background
  },

  cardDetails: {
    flex: 1,
    paddingRight: 12, // Add some padding before the delete button
    justifyContent: "center",
  },
   orderStatus: {
    color: '#22c55e',
    fontWeight: '600',
    fontSize: 11,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  productName: {
    fontSize: 16, // Increased from 14
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
    lineHeight: 20,
  },
  
  productQuantity: {
    fontSize: 14, // Increased from 12
    color: '#6b7280',
    fontWeight: '500',
  },
  
  // Delete button container for better touch target
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  
  // Date Picker - Enhanced
  dateTimeSelector: {
    borderWidth: 1.5,
    borderColor: '#22c55e',
    borderRadius: 12,
    padding: 16, // Increased padding
    marginTop: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  
  dateTimeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  dateTimeText: {
    fontSize: 15, // Slightly increased
    color: '#374151',
    marginLeft: 12,
    fontWeight: '500',
    flex: 1,
  },
  
  // Checkout Button - Enhanced
  checkoutButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 18, // Increased from 16
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#22c55e',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  checkoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17, // Slightly increased
    letterSpacing: 0.5,
  },
  
  // Empty state styling
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  
  // Price highlight
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22c55e',
  },
  
  quantityText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
});
