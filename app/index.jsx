// import React, { useEffect } from 'react';
// import { View, ActivityIndicator, BackHandler } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';

// export default function Index() {
//   const router = useRouter();

//   useEffect(() => {
//     // Prevent hardware back button from interrupting session check
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => {
//         // Disable going back to this loading screen
//         return true; // block default behavior
//       }
//     );

//     const checkSession = async () => {
//       try {
//         const verified = await AsyncStorage.getItem('otpVerified');
//         const mobile = await AsyncStorage.getItem('customerMobile');
//         const type = await AsyncStorage.getItem('type');
//         const id = await AsyncStorage.getItem('customerId');

//         console.log('✅ Session Check:', { verified, mobile, type, id });

//         if (verified === 'true' && mobile && type && id) {
//           router.replace({
//             pathname: '/components/Home',
//             params: { mobile, type, id },
//           });
//         } else {
//           router.replace('/components/Login');
//         }
//       } catch (error) {
//         console.error('Session check failed:', error);
//         router.replace('/components/Login');
//       }
//     };

//     checkSession();

//     // Cleanup back handler on unmount
//     return () => {
//       backHandler.remove();
//     };
//   }, []);

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <ActivityIndicator size="large" color="green" />
//     </View>
//   );
// }


import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true
    );

    const checkSession = async () => {
      try {
        console.log('🔍 Starting session check...');
        
        // ✅ COMPLETE SESSION CHECK
        const allKeys = await AsyncStorage.getAllKeys();
        const allData = await AsyncStorage.multiGet(allKeys);
        
        console.log('📊 All AsyncStorage Data:', allData);
        
        // Check for explicit logout
        const isLoggingOut = await AsyncStorage.getItem('isLoggingOut');
        const loginStatus = await AsyncStorage.getItem('loginStatus');
        
        if (isLoggingOut === 'true' || loginStatus === 'loggedOut') {
          console.log('🚪 Logout detected, clearing all data');
          await AsyncStorage.clear();
          router.replace('/components/Login');
          return;
        }
        
        // Check for valid session
        const sessionData = await AsyncStorage.multiGet([
          'otpVerified',
          'customerMobile',
          'type',
          'customerId',
          'loginStatus'
        ]);

        const [verified, mobile, type, id, status] = sessionData.map(item => item[1]);

        console.log('✅ Session Data:', { verified, mobile, type, id, status });

        if (verified === 'true' && mobile && type && id && status === 'loggedIn') {
          console.log('✅ Valid session, navigating to Home');
          router.replace({
            pathname: '/components/Home',
            params: { mobile, type, id },
          });
        } else {
          console.log('❌ Invalid session, clearing and going to Login');
          await AsyncStorage.clear();
          router.replace('/components/Login');
        }
      } catch (error) {
        console.error('❌ Session check error:', error);
        await AsyncStorage.clear();
        router.replace('/components/Login');
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();

    return () => backHandler.remove();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="green" />
    </View>
  );
}


