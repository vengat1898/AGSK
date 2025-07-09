import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  bannerImage: {
    width,
    height: 300,
    resizeMode: 'cover',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: -30,
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 120,
  },
  subText: {
    color: '#D10000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 6,
  },
  button: {
    backgroundColor: '#29CB56',
    width: width * 0.9,
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  icon: {
    marginRight: 10,
  },
});
