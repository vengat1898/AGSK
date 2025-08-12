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
import Logo from "../assets/images/AGSKLogo.png"
import { SessionContext } from '../context/SessionContext';

export default function Index() {
  const router = useRouter();
  const { session, loadSession } = useContext(SessionContext);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.3));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

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
      startLogoAnimation();

      await loadSession();

      await new Promise(resolve => setTimeout(resolve, 2500));
      
    } catch (error) {
      console.error('❌ App initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startLogoAnimation = () => {
    // Initial entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
      // Gentle pulsing effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),
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

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fdf8" />
      
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: Animated.multiply(scaleAnim, pulseAnim) },
                { rotate: spin }
              ],
            },
          ]}
        >
          <View style={styles.shadowWrapper}>
            <Image
              source={Logo}
              style={styles.logo}
              contentFit="contain"
            />
          </View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0]
              })}]
            }
          ]}
        >
          <Text style={styles.appName}>AGSK</Text>
          {/* <Text style={styles.tagline}>Fresh Banana Leaves Delivered</Text> */}
          <Text style={styles.subtitle}>🍃 Natural • Fresh • Organic 🍃</Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        {isLoading ? (
          <Animated.View 
            style={[
              styles.loadingContainer,
              { opacity: fadeAnim }
            ]}
          >
            <ActivityIndicator size="small" color="#2d5a2d" />
            <Text style={styles.loadingText}>Preparing fresh experience...</Text>
          </Animated.View>
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
    backgroundColor: '#f8fdf8', // Light green background
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 50,
    shadowColor: '#2d5a2d',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20, 
  },
  shadowWrapper: {
    width: 200, 
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ffffff', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4a7c4a',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10, 
    borderWidth: 3,
    borderColor: 'rgba(45, 90, 45, 0.1)',
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2d5a2d',
    marginBottom: 8,
    letterSpacing: 3,
    textShadowColor: 'rgba(45, 90, 45, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: '#4a7c4a',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b8e6b',
    textAlign: 'center',
    fontWeight: '400',
    fontStyle: 'italic',
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#2d5a2d',
    fontWeight: '500',
  },
  versionText: {
    fontSize: 12,
    color: '#8fbc8f',
    fontWeight: '300',
  },
};