import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from './components/CustomDrawerContent';
import { Stack } from "expo-router";
import { SessionProvider } from '../context/SessionContext';
export default function Layout() {
  return (

        <SessionProvider>
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
    </SessionProvider>
  );
}



