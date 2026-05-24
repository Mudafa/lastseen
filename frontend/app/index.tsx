import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [showDescription, setShowDescription] = useState(false);

  const handleCameraMode = () => router.push('/camera');
  const handleAskMode = () => router.push('/ask');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.headerArea}>
          <View style={styles.topBar}>
            <View style={styles.brandDot} />
            <Pressable
              style={styles.sparkleButton}
              onPress={() => setShowDescription((current) => !current)}
              accessibilityRole="button"
              accessibilityLabel="Show app description">
              <Ionicons name="sparkles-outline" size={16} color={colors.textLight} />
            </Pressable>
          </View>

          {showDescription ? (
            <View style={styles.descriptionPopout}>
              <Text style={styles.descriptionTitle}>About LastSeen</Text>
              <Text style={styles.descriptionText}>
                Scan a room to save what you saw, then ask where something was last seen in plain
                language.
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Find things faster</Text>
          </View>

          <Text style={styles.title}>LastSeen</Text>
          <Text style={styles.subtitle}>
            Scan a room, track what changed, and ask where you left the things you care about.
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

        <View style={styles.footer}>
          <Text style={styles.footerText}>untitled.jpg · all rights reserved</Text>
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
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  headerArea: {
    position: 'relative',
    alignSelf: 'stretch',
    zIndex: 2,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 6,
  },
  brandDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.45,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  sparkleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  descriptionPopout: {
    position: 'absolute',
    top: 46,
    right: 6,
    width: 230,
    padding: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(11, 14, 24, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  heroCard: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderRadius: 28,
    backgroundColor: 'rgba(7, 10, 18, 0.26)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  badgeText: {
    color: colors.textMuted,
    fontSize: 12,
    letterSpacing: 0.4,
    fontWeight: '700',
  },
  title: {
    color: colors.textLight,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 340,
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
  descriptionTitle: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '800',
  },
  descriptionText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  footerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    letterSpacing: 0.8,
  },
});
