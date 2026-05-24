import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import SpaceBackground from '../components/SpaceBackground';
import { colors } from '@/constants/theme';

  const LastSeenTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: 'transparent',
      card: '#0B1224',
      primary: colors.primary,
      text: colors.textLight,
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
