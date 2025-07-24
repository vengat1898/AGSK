import React from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Invoice() {
  const router = useRouter();
  const { weburl, order_id, mobile, type, id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/components/Home")}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Invoice #{order_id}</Text>
          <TouchableOpacity
            onPress={() => router.push("/components/Home")}
            style={styles.homeButton}
          >
            <Ionicons name="home" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {weburl ? (
        <WebView
          source={{ uri: weburl }}
          style={styles.webview}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onError={(error) => {
            console.error('WebView Error:', error);
          }}
          onLoadStart={() => console.log('Loading invoice...')}
          onLoadEnd={() => console.log('Invoice loaded successfully')}
        />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load invoice</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.push("/components/Home")}
          >
            <Text style={styles.retryButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  homeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  webview: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});