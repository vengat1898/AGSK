import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },

  scrollContentWithKeyboard: {
    paddingBottom: 10,
  },

  imageWrapper: {
    width: width,
    height: height * 0.35, // 35% of screen height
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  fogOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },

  gradientLayer: {
    flex: 1,
    width: '100%',
  },

  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  logoContainerCompact: {
    paddingVertical: 10,
  },

  logoImage: {
    width: width * 0.4,
    height: 60,
    marginBottom: 10,
  },

  logoImageSmall: {
    width: width * 0.3,
    height: 40,
    marginBottom: 5,
  },

  loginHeading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 2,
  },

  loginHeadingSmall: {
    fontSize: 20,
    letterSpacing: 1,
  },

  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
    minHeight: 200,
  },

  formContainerWithKeyboard: {
    flex: 0,
    paddingTop: 10,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    height: 55,
    paddingHorizontal: 15,
  },

  countryCode: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginRight: 10,
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
    paddingVertical: 0, // Remove default padding to center text
  },

  button: {
    backgroundColor: '#1DAB45',
    borderRadius: 12,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#1DAB45',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  buttonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  buttonTextDisabled: {
    color: '#999',
  },

  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },

  keyboardPadding: {
    height: 100,
  },

  // Loading state styles
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});