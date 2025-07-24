import { StyleSheet, Dimensions,Platform } from 'react-native';
const { width,height } = Dimensions.get('window');
const getStatusBarHeight = () => {
  if (Platform.OS === 'ios') {
    // iOS status bar heights vary by device
    if (height >= 812) { // iPhone X and newer
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
    backgroundColor: '#fff',
  }, 
  header: {
    position: 'relative',
    height: 120,
    borderBottomRightRadius:50,
    borderBottomStartRadius:50
  },
  headerBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',  borderBottomRightRadius:10,
    borderBottomLeftRadius:10
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop:25,
    justifyContent:"space-between"
  },
  headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 10,
},

rightIcons: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},

  welcomeText: {
    color: '#fff',
    fontSize: 16,
  },
  userText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
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
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10, // Ensure spacing between icons
  marginTop: 10,
},

  iconWrapper: {
    marginRight: 15,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,

  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 1,
    alignItems: 'center',
    marginVertical: 10,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    color: '#000',
  },
  body: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  sortText: {
    fontWeight: '600',
    fontSize: 14,
    marginRight: 10,
    color: '#222',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    flexDirection: 'row',
  },
  productImage: {
    width: 125,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 5,
    marginLeft:40,
    marginBottom:5
  },
  productName: {
    fontWeight: '600',
    fontSize: 16,
   
  },
  productPrice: {
    fontSize: 10,
    fontWeight: '500',
    color: 'green',
    marginBottom: 10,
    
  },
 cartButton: {
  marginTop: 8,
},
  cartText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5,
  },
  inputBelowCard: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: '#555',
  },
  arrowCircle: {
  backgroundColor: '#fff',
  borderRadius: 15,
  padding: 4,
  marginLeft: 6,
  alignItems: 'center',
  justifyContent: 'center',
},

navItem: {
  alignItems: 'center',
  justifyContent: 'center',
},

activeIconCircle: {
  backgroundColor: '#28a745',
  padding: 10,
  borderRadius: 50,
},


activeIconCircle: {
  backgroundColor: '#28a745', // green
  padding: 10,
  borderRadius: 50,
},
footerSafeArea: {
  backgroundColor: '#fff',
  paddingBottom: 4, // optional soft spacing for iPhones with gesture nav
},
dateTimeSelector: {
  borderWidth: 1,
  borderColor: 'green',
  borderRadius: 8,
  marginHorizontal: 16,
  marginTop: 16,
  padding: 12,
  backgroundColor: '#fff',
},

dateTimeWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
},

dateTimeText: {
  marginLeft: 10,
  fontSize: 14,
  color: '#000',
},

dateTimeInput: {
  marginHorizontal: 16,
  marginTop: 8,
  padding: 12,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  backgroundColor: '#fff',
  color: '#000',
},
tickIcon: {
  position: 'absolute',
  top: 10,
  right: 10,
},

  footerNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    marginBottom:0
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },


  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContent: {
  backgroundColor: '#fff',
  width: '80%',
  padding: 20,
  borderRadius: 10,
  alignItems: 'center',
},
modalTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 10,
},
modalInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  width: '100%',
  padding: 10,
  marginBottom: 20,
  textAlign: 'center',
  color: '#000',
},
modalActions: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
},
modalCancel: {
  backgroundColor: '#ccc',
  padding: 10,
  borderRadius: 8,
  flex: 1,
  marginRight: 5,
  alignItems: 'center',
},
modalConfirm: {
  backgroundColor: 'green',
  padding: 10,
  borderRadius: 8,
  flex: 1,
  marginLeft: 5,
  alignItems: 'center',
},
modalButtonText: {
  color: '#fff',
  fontWeight: 'bold',
},
productSize: {
  fontSize: 14,
  color: '#555',
  marginTop: 4,
},
productPrice: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#28a745',
  marginTop: 2,
},
priceContainer: {
  flexDirection: 'column',
  marginBottom: 8,
},
unitPrice: {
  fontSize: 12,
  color: '#666',
  fontStyle: 'italic',
},
quantityContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
},
quantityLabel: {
  fontSize: 14,
  color: '#333',
  marginRight: 8,
},
quantityInput: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 4,
  padding: 8,
  minWidth: 60,
  textAlign: 'center',
},
addToCartBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#28a745',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 6,
  alignSelf: 'flex-start',
  minWidth: 120,
  justifyContent: 'center',
},
removeFromCartBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#dc3545',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 6,
  alignSelf: 'flex-start',
  minWidth: 120,
  justifyContent: 'center',
},
addCartText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 14,
},
removeCartText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 14,
},

modalProductInfo: {
  marginBottom: 15,
  alignItems: 'center',
},
modalProductName: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 4,
},
modalProductSize: {
  fontSize: 14,
  color: '#666',
},
modalPriceInfo: {
  alignItems: 'center',
  marginTop: 15,
  marginBottom: 15,
  padding: 10,
  backgroundColor: '#f8f9fa',
  borderRadius: 8,
},
modalPriceLabel: {
  fontSize: 14,
  color: '#666',
},
modalPrice: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#28a745',
},
modalUnitPrice: {
  fontSize: 12,
  color: '#666',
  fontStyle: 'italic',
}, continueButtonContainer: {
    position: 'absolute',
    bottom: 80, // Above the bottom navigation
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  continueButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

});


