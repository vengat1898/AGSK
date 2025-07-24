import Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  centerBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#f6fff6',
  },
  infoText: {
    fontSize: 16,
    color: '#000',
  },
  qrSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  uploadSection: {
    marginBottom: 24,
  },
  uploadBtn: {
    flexDirection: 'row',
    backgroundColor: '#e9f5ec',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  uploadText: {
    fontSize: 14,
    color: '#000',
    alignSelf: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    marginTop: 12,
    borderRadius: 10,
  },
  continueBtn: {
    backgroundColor: 'green',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});