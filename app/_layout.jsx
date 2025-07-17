// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false,
//       }}
//     />
//   );
// }

// app/_layout.js or app/layout.jsx
import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from './components/CustomDrawerContent';

export default function Layout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    />
  );
}
