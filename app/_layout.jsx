import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from './components/CustomDrawerContent';
import { Stack } from "expo-router";
import { SessionProvider } from '../context/SessionContext';
export default function Layout() {
  return (
    // <Drawer
    //   screenOptions={{ headerShown: false }}
    //   drawerContent={(props) => <CustomDrawerContent {...props} />}
    // >
    //   <Drawer.Screen name="index" options={{ title: 'Home' }} />
    //   <Drawer.Screen name="(drawer)" options={{ title: 'More' }} />
    // </Drawer>
        <SessionProvider>
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
    </SessionProvider>
  );
}



