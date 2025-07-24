import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  logo: {
    width: 280,
    height: 150,
    marginBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#29CB56',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subheading: {
    fontSize: 16,
    color: '#555',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 12,
  },
  otpBox: {
    width: 56,
    height: 56,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  otpBoxFilled: {
    borderColor: '#29CB56',
    backgroundColor: '#f0fdf4',
    shadowColor: '#29CB56',
    shadowOpacity: 0.15,
  },
  button: {
    backgroundColor: '#29CB56',
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#29CB56',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resendContainer: {
    alignItems: 'center',
    gap: 16,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  resendText: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
  resendHighlight: {
    color: '#29CB56',
    fontWeight: '700',
  },
  resendDisabled: {
    color: '#94a3b8',
  },
  clearButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  clearText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  timerText: {
    color: '#f59e0b',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  // Additional utility styles
  errorState: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  successState: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  // Animation styles for better UX
  pulseAnimation: {
    transform: [{ scale: 1.02 }],
  },
  // Loading state styles
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});