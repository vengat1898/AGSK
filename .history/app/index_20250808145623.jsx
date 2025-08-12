import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import agskGif from '../assets/images/agsk.gif';
import { SessionContext } from '../context/SessionContext';
import Logo from ""
export default function Index() {
  const router = useRouter();
  const { session, loadSession } = useContext(SessionContext);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    // Only navigate after session loading is complete and splash loading is done
    if (!isLoading) {
      handleNavigation();
    }
  }, [session, isLoading]);

  const initializeApp = async () => {
    try {
      // Start logo animation
      startLogoAnimation();

      // Load session data
      await loadSession();

      // Minimum splash duration for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error('❌ App initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startLogoAnimation = () => {
    // Fade in and scale up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNavigation = () => {
    if (isLoading) return;

    console.log('🔍 Session check:', session);

    if (session && session.id) {
      // User is logged in
      console.log('✅ User session found, redirecting to Home');
      console.log('👤 User details:', {
        id: session.id,
        name: session.name,
        mobile: session.mobile,
        type: session.type,
      });
      
      router.replace('/components/Home');
    } else {
      console.log('❌ No session found, redirecting to Login');
      router.replace('/components/Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.shadowWrapper}>
            <Image
              source={agskGif}
              style={styles.logo}
              contentFit="cover"
            />
          </View>
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={styles.appName}>AGSK</Text>
          <Text style={styles.tagline}>Welcome to your digital experience</Text>
        </View>
      </View>

      <View style={styles.footer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Initializing...</Text>
          </View>
        ) : (
          <Text style={styles.versionText}>Version 1.0.0</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16, 
  },
  shadowWrapper: {
    width: 256, 
    borderRadius: 10,
    backgroundColor: '#ffffff', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: -5, 
  },
  logo: {
    width: 380,
    height: 330,
    borderRadius: 20, 
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)', 
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '300',
  },
  footer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  versionText: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '300',
  },
};

