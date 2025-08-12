import { StatusBar } from "expo-status-bar";
import { Dimensions, Platform, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");
const getStatusBarHeight = () => {
  if (Platform.OS === "ios") {
    // iOS status bar heights vary by device
    if (height >= 812) {
      // iPhone X and newer
      return 44;
    } else {
      return 20;
    }
  } else {
    // Android
    return StatusBar.currentHeight || 24;
  }
};
const STATUS_BAR_HEIGHT = getStatusBarHeight();

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "relative",
    height:
      Platform.OS === "ios" ? 140 + STATUS_BAR_HEIGHT : 120 + STATUS_BAR_HEIGHT,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50, // Fixed: was borderBottomStartRadius
    overflow: "hidden", // Important: clips the image to rounded corners
    zIndex: 100,
  },

  headerBackground: {
    width: "100%",
    height: "100%",
    position: "absolute",
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },

  headerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: STATUS_BAR_HEIGHT -5, 
    justifyContent: "space-between",
    paddingBottom: 15,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5, // Reduced from 10
  },

  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  welcomeText: {
    color: "#fff",
    fontSize: 16,
  },
  userText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  // headerIcons: {
  //   flexDirection: 'row',
  //   position: 'absolute',
  //   top: 60,
  //   right: 20,
  // },
  // styles/homeStyles.js

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // Ensure spacing between icons
    marginTop: 10,
  },

  iconWrapper: {
    marginRight: 15,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 1,
    alignItems: "center",
    marginVertical: 10,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    color: "#000",
  },
  body: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  sortText: {
    fontWeight: "600",
    fontSize: 14,
    marginRight: 10,
    color: "#222",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 15,
    flexDirection: "row",
    maxHeight: 200,

  },
  productImage: {
    minWidth: "45%",
    height: "100%",
    borderRadius: 10,
    marginRight: 3,
    borderWidth: 0.5,
    elevation: 3,
  },
  cardDetails: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 5,
    marginLeft:"8%",
  },
  productName: {
    fontWeight: "600",
    fontSize: 16,
  },
  productPrice: {
    fontSize: 10,
    fontWeight: "500",
    color: "green",
    marginBottom: 10,
  },
  cartButton: {
    marginTop: 8,
  },
  cartText: {
    color: "#fff",
    fontWeight: "bold",
    marginRight: 5,
  },
  inputBelowCard: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: "#555",
  },
  arrowCircle: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 4,
    marginLeft: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  activeIconCircle: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 50,
  },

  activeIconCircle: {
    backgroundColor: "#28a745", // green
    padding: 10,
    borderRadius: 50,
  },
  footerSafeArea: {
    backgroundColor: "#fff",
    paddingBottom: 4, // optional soft spacing for iPhones with gesture nav
  },
  dateTimeSelector: {
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    backgroundColor: "#fff",
  },

  dateTimeWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  dateTimeText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#000",
  },

  dateTimeInput: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#000",
  },
  tickIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },

  footerNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    marginBottom: 0,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "100%",
    padding: 10,
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalCancel: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  modalConfirm: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  productSize: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28a745",
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: "column",
    marginBottom: 8,
  },
  unitPrice: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  quantityLabel: {
    fontSize: 14,
    color: "#333",
    marginRight: 8,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 8,
    minWidth: 60,
    textAlign: "center",
  },
  addToCartBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28a745",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
    minWidth: 120,
    justifyContent: "center",
  },
  removeFromCartBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc3545",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
    minWidth: 120,
    justifyContent: "center",
  },
  addCartText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  removeCartText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 10,
  },

  modalProductInfo: {
    marginBottom: 15,
    alignItems: "center",
  },
  modalProductName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  modalProductSize: {
    fontSize: 14,
    color: "#666",
  },
  modalPriceInfo: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  modalPriceLabel: {
    fontSize: 14,
    color: "#666",
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745",
  },
  modalUnitPrice: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  continueButtonContainer: {
    position: "absolute",
    bottom: 100, 
    left: 20,
    right: 20,
    backgroundColor: "transparent",
    zIndex: 1000,
  },
  continueButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  sortModalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    margin: 20,
    maxWidth: 300,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#f8f9fa",
  },

  sortOptionSelected: {
    backgroundColor: "#e8f5e8",
    borderColor: "#28a745",
    borderWidth: 1,
  },

  sortOptionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },

  sortOptionTextSelected: {
    color: "#28a745",
    fontWeight: "600",
  },

  sortModalClose: {
    marginTop: 15,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },

  sortModalCloseText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  }, clearSearchButton: {
    marginLeft: 8,
    padding: 4,
  },
  
  // Section header container
  sectionHeader: {
    marginBottom: 10,
  },
  
  // Search result text
  searchResultText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  
  // No results container
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  clearSearchLink: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#28a745',
    borderRadius: 6,
  },
  
  clearSearchLinkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },



  // Coupon Banner Styles
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


// In your StyleSheet.create() object, add/update these styles:

// Container for both sort and balance buttons
sortBalanceRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 15,
  marginBottom: 15,
  alignItems: 'center',
},

// Balance button - matches sort button style exactly
balanceButton: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#222',
  borderRadius: 6,
  paddingHorizontal: 15,
  paddingVertical: 8,
  backgroundColor: '#fff',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 1,
  elevation: 2,
  marginBottom:15
},

balanceText: {
  fontWeight: '600',
  fontSize: 14,
  marginRight: 10,
  color: '#222',
},

// Balance modal - matches your other modal styles
balanceModalContent: {
  backgroundColor: '#fff',
  width: '85%',
  borderRadius: 12,
  padding: 20,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},

balanceModalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 20,
  color: '#222',
},

balanceRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},

balanceLabel: {
  fontSize: 16,
  color: '#333',
  fontWeight: '500',
},

balanceAmount: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#28a745',
},

balanceTotalRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  paddingVertical: 12,
  marginTop: 10,
  borderTopWidth: 1,
  borderTopColor: '#ddd',
},

balanceTotalLabel: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#222',
},

balanceTotalAmount: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#28a745',
},

modalCloseButton: {
  marginTop: 20,
  paddingVertical: 12,
  paddingHorizontal: 24,
  backgroundColor: '#28a745',
  borderRadius: 8,
  width: '100%',
  alignItems: 'center',
},

modalCloseButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},

// Loading state
balanceLoading: {
  padding: 20,
  justifyContent: 'center',
  alignItems: 'center',
},

deliveryNotificationsContainer: {
  backgroundColor: '#FF8C00',
  paddingVertical: 8,
  marginTop:10,
},
deliveryScrollContent: {
  paddingHorizontal: 20,
  gap: 10,
  marginLeft:20
},
deliveryNotification: {
  backgroundColor: 'rgba(255,255,255,0.2)',
  borderRadius: 20,
  paddingVertical: 8,
  paddingHorizontal: 15,
  minWidth: 250,
},
notificationContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
notificationText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: '500',
  flex: 1,
  marginHorizontal: 10,
},

discountedPriceContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
},
originalPrice: {
  fontSize: 14,
  color: '#999',
  textDecorationLine: 'line-through',
  marginRight: 8,
},
discountedPrice: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#28a745',
},
discountBadge: {
  backgroundColor: '#ff6b6b',
  color: '#fff',
  fontSize: 12,
  fontWeight: 'bold',
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 4,
  marginLeft: 8,
  overflow: 'hidden',
},


imageModalContainer: {
  flex: 1,
  backgroundColor: 'black',
},
imageModalHeader: {
  position: 'absolute',
  top: 40,
  left: 0,
  right: 0,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  zIndex: 1,
},
closeButton: {
  padding: 8,
},
imageCounter: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
imageSlide: {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  justifyContent: 'center',
  alignItems: 'center',
},
fullSizeImage: {
  width: '100%',
  height: '80%',
},
dotsContainer: {
  position: 'absolute',
  bottom: 30,
  flexDirection: 'row',
  alignSelf: 'center',
},
dot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.4)',
  margin: 5,
},
activeDot: {
  backgroundColor: 'white',
},

// bannerContainer: {
//   width: '100%',
//   height: 120, // Adjust height as needed
//   marginTop: 10,
//   marginBottom: 10,
//   paddingHorizontal: 10,
// },
// bannerImage: {
//   width: '100%',
//   height: '100%',
//   borderRadius: 8,
// },

// bannerContainer: {
//   width: '100%',
//   height: 100, // Adjust as needed
//   marginTop: 10,
//   marginBottom: 10,
//   position: 'relative',
// },
// bannerImage: {
//   width: Dimensions.get('window').width - 30,
//   height: '100%',
//   borderRadius: 8,
//   // marginHorizontal: 15,
// },
// indicatorContainer: {
//   flexDirection: 'row',
//   position: 'absolute',
//   bottom: 10,
//   alignSelf: 'center',
// },
// indicatorDot: {
//   width: 8,
//   height: 8,
//   borderRadius: 4,
//   backgroundColor: 'rgba(255,255,255,0.4)',
//   marginHorizontal: 4,
// },
// activeDot: {
//   backgroundColor: '#fff',
//   width: 16,
// },

bannerSection: {
  marginBottom: 20,
},
bannerContainer: {
  height: 150,
  position: 'relative',
},
bannerSlide: {
  width: Dimensions.get('window').width - 40,
  marginHorizontal: 5,
},
bannerImage: {
  width: '100%',
  height: '100%',
  borderRadius: 10,
},
bannerLoading: {
  height: 180,
  justifyContent: 'center',
  alignItems: 'center',
},
fallbackBanner: {
  height: 180,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f8f8f8',
  borderRadius: 10,
},
noBannersContainer: {
  height: 180,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f8f8f8',
  borderRadius: 10,
  padding: 20,
},
noBannersText: {
  marginTop: 10,
  color: '#666',
  fontSize: 16,
},
retryButton: {
  marginTop: 15,
  paddingVertical: 8,
  paddingHorizontal: 20,
  backgroundColor: '#28a745',
  borderRadius: 5,
},
retryButtonText: {
  color: '#fff',
  fontWeight: 'bold',
},
indicatorContainer: {
  position: 'absolute',
  bottom: 10,
  flexDirection: 'row',
  alignSelf: 'center',
},
indicatorDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: 'rgba(255,255,255,0.5)',
  marginHorizontal: 3,
},
activeDot: {
  backgroundColor: '#fff',
  width: 20,
  borderRadius: 5,
},

});
