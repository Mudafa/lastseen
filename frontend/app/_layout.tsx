import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import SpaceBackground from '../components/SpaceBackground';

const LastSeenTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: 'transparent',
    card: '#0B1224',
    primary: '#F59E0B',
    text: '#E6F0FF',
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={LastSeenTheme}>
      <SpaceBackground>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
            animation: 'slide_from_right',
            animationDuration: 140,
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="camera" />
          <Stack.Screen name="ask" />
        </Stack>
      </SpaceBackground>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
