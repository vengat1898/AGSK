// import { Text, View, TouchableOpacity } from "react-native";
// import { useRouter } from "expo-router";
// import React, { useState, useEffect } from 'react';
// export default function Index() {
//   const router = useRouter();

//   useEffect(() => {
//   const redirect = async () => {
//     const isOtpVerified = await AsyncStorage.getItem('otpVerified');
//     if (isOtpVerified === 'true') {
//       router.replace('/components/Home');
//     }
//   };
//   redirect();
// }, []);


//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 20,


//       }}
//     >
//       <Text style={{ fontSize: 18, marginBottom: 20 }}>Welcome!</Text>

//       <TouchableOpacity
//         onPress={() => router.push('/components/Login')}
//         style={{
//           backgroundColor: "green",
//           paddingVertical: 12,
//           paddingHorizontal: 24,
//           borderRadius: 8,
 
//         }}
//       >
//         <Text style={{ color: "#fff", fontSize: 16 }}>Go to Login</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// app/index.js
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const verified = await AsyncStorage.getItem('otpVerified');
        const mobile = await AsyncStorage.getItem('customerMobile');
        const type = await AsyncStorage.getItem('type');
        const id = await AsyncStorage.getItem('customerId');

        console.log('✅ Session Check:', { verified, mobile, type, id });

        if (verified === 'true' && mobile && type && id) {
          router.replace({
            pathname: '/components/Home',
            params: { mobile, type, id },
          });
        } else {
          router.replace('/components/Login');
        }
      } catch (error) {
        console.error('Session check failed:', error);
        router.replace('/components/Login');
      }
    };

    checkSession();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="green" />
    </View>
  );
}

