import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SpaceBackground from '@/components/SpaceBackground';
import { colors } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  const handleCameraMode = () => router.push('/camera');
  const handleAskMode = () => router.push('/ask');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <SpaceBackground>
        <View style={styles.container}>
          <View style={styles.header} pointerEvents="none">
            <Text style={styles.kicker}>untitled.jpg</Text>
            <Text style={styles.title}>LastSeen</Text>
            <Text style={styles.subtitle}>
              Stop asking yourself where you left things. Scan a room, then ask LastSeen what it saw.
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.primaryButton} onPress={handleCameraMode} accessibilityRole="button">
              <Ionicons name="camera" size={20} color={colors.backgroundDeep} />
              <Text style={styles.primaryButtonText}>Camera</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={handleAskMode} accessibilityRole="button">
              <Ionicons name="search" size={20} color={colors.textLight} />
              <Text style={styles.secondaryButtonText}>Ask</Text>
            </Pressable>
          </View>
        </View>
      </SpaceBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 4,
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 26,
    backgroundColor: 'rgba(7, 10, 18, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  kicker: {
    color: colors.textMuted,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: {
    color: colors.textLight,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: '88%',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },
  primaryButtonText: {
    color: colors.backgroundDeep,
    fontSize: 16,
    fontWeight: '900',
  },
  secondaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '800',
  },
});
