import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 260,
    height: 140,
    marginBottom: 80,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#29CB56',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: '#333',
    marginBottom: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '80%',
    marginBottom: 30,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 1.5,
    borderColor: '#29CB56',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#29CB56',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  resendHighlight: {
    color: '#29CB56',
    fontWeight: 'bold',
  },
});

export default styles;

