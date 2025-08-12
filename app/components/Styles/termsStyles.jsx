import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f2fef5',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 30,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  backButton: {
    marginRight: 12,
    backgroundColor: '#e6f4ec',
    borderRadius: 8,
    padding: 6,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1b5e20',
  },

  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  scrollContent: {
    paddingTop: 10,
  },

  termsText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
    textAlign: 'left',
    whiteSpace: 'pre-line',
  },
});