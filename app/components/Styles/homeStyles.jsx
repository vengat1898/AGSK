import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  header: {
    position: 'relative',
    height: 200,
  },
  headerBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
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
  headerIcons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 40,
    right: 20,
  },
  iconWrapper: {
    marginLeft: 15,
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
    marginTop: 20,
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
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 5,
  },
  productName: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: 'green',
    marginBottom: 10,
    
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
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

footerSafeArea: {
  backgroundColor: '#fff',
},

footer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  height: 60,
  borderTopWidth: 1,
  borderColor: '#eee',
  marginBottom: 20,
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



});

