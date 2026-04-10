import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import App from '@/AppContent';

export default function RootLayout() {
  return (
    <>
      <App />
      <StatusBar style="auto" />
    </>
  );
}
