import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  // Banner Section
  bannerContainer: {
    position: 'relative',
    width: width,
    height: height * 0.35,
  },
  
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },

  // Logo Section
  logoSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -20,
    zIndex: 1,
  },
  
  logoContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
  },
  
  
  logo: {
    width: 200,
    height: 80,
  },
  optionImage: {
  width: 70,
  height: 70,
  borderRadius:4
  
},

  headerTextContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  
  subText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  // Options Section
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },

  card: {
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginVertical: 4,
  },

  cardGradient: {
    borderRadius: 16,
    overflow: 'hidden',
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    minHeight: 80,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  textContainer: {
    flex: 1,
    paddingRight: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.5,
  },

  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
  },

  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Footer Section
  footerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
  },

  footerText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },

  loginLink: {
    color: '#3498db',
    fontWeight: '600',  },

  // Animation and Interactive States
  cardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.25,
  },

  // Responsive Design
  '@media (max-width: 400)': {
    cardTitle: {
      fontSize: 16,
    },
    cardSubtitle: {
      fontSize: 13,
    },
    welcomeText: {
      fontSize: 22,
    },
  },


  ...Platform.select({
    ios: {
      card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
    },
    android: {
      card: {
        elevation: 6,
      },
    },
  }),
});