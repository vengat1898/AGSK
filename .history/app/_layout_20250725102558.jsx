import { Stack, useRouter, usePathname } from "expo-router";
import { SessionProvider } from "../context/SessionContext";
import { useEffect } from "react";
import { BackHandler, Alert } from "react-native";

export default function Layout() {
  return (
    <SessionProvider>
      <BackHandlerWrapper>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </BackHandlerWrapper>
    </SessionProvider>
  );
}

function BackHandlerWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const backAction = () => {
      // Check if current route is '/components/Home'
      if (pathname === '/components/Home') {
        // Show alert to exit app
        Alert.alert(
          "Exit App",
          "Are you sure you want to exit the app?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            {
              text: "Exit",
              onPress: () => BackHandler.exitApp()
            }
          ]
        );
        return true; // Prevent default behavior
      } else {
        // If not on home route, navigate to home
        Alert.alert(
          "Go to Home",
          "Do you want to go to Home or exit the app?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            {
              text: "Home",
              onPress: () => router.replace('/components/Home')
            },
            {
              text: "Exit",
              onPress: () => BackHandler.exitApp()
            }
          ]
        );
        return true; // Prevent default behavior
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [pathname, router]);

  return children;
}