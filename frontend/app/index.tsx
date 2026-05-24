import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  const handleCameraMode = () => router.push('/camera');
  const handleAskMode = () => router.push('/ask');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>untitled.jpg</Text>
          </View>

          <Text style={styles.title}>LastSeen</Text>
          <Text style={styles.subtitle}>
            Stop wondering where you put things. Scan a room, then ask LastSeen what it saw.
          </Text>

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
      </View>
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
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCard: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 32,
    backgroundColor: 'rgba(7, 10, 18, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.24,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  badgeText: {
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: {
    color: colors.textLight,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 320,
  },
  actions: {
    width: '100%',
    marginTop: 8,
    gap: 10,
  },
  primaryButton: {
    width: '100%',
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
    width: '100%',
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
