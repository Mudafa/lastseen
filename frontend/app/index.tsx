import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/primary-button';
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from '@/constants/app';

export default function HomeScreen() {
  const router = useRouter();

  const handleCameraMode = () => {
    router.push('/camera');
  };

  const handleAskMode = () => {
    router.push('/ask');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.title}>{APP_NAME}</Text>
          <Text style={styles.tagline}>{APP_TAGLINE}</Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Camera" icon="camera" variant="primary" onPress={handleCameraMode} />
          <PrimaryButton label="Ask" icon="search" variant="secondary" onPress={handleAskMode} />
        </View>

        {/* Minimal home: no tips shown */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 28,
  },
  hero: {
    paddingTop: 12,
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.28)',
  },
  badgeText: {
    color: '#FCD34D',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: -0.2,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  description: {
    display: 'none',
  },
  actions: {
    gap: 14,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  setupHint: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(17,24,39,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(31,41,55,0.4)',
  },
  setupHintText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#94A3B8',
  },
  privacy: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 4,
    backgroundColor: 'transparent',
    paddingBottom: 24,
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
  },
});
