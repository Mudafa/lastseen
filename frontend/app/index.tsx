import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from '@/constants/app';

export default function HomeScreen() {
  const handleCameraMode = () => {
    // Camera mode screen — next milestone
  };

  const handleAskMode = () => {
    // Ask / search mode screen — next milestone
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Ionicons name="scan-outline" size={14} color="#F59E0B" />
            <Text style={styles.badgeText}>Object memory prototype</Text>
          </View>

          <Text style={styles.title}>{APP_NAME}</Text>
          <Text style={styles.tagline}>{APP_TAGLINE}</Text>
          <Text style={styles.description}>{APP_DESCRIPTION}</Text>
        </View>

        <View style={styles.actions}>
          <Text style={styles.sectionLabel}>Choose how to use this phone</Text>

          <PrimaryButton
            label="Use as camera"
            subtitle="Scan the room every few seconds"
            icon="camera"
            variant="primary"
            onPress={handleCameraMode}
          />

          <PrimaryButton
            label="Ask where something is"
            subtitle='e.g. "Where is my calculator?"'
            icon="search"
            variant="secondary"
            onPress={handleAskMode}
          />
        </View>

        <View style={styles.setupHint}>
          <Ionicons name="phone-portrait-outline" size={18} color="#64748B" />
          <Text style={styles.setupHintText}>
            Tip: use one phone as the camera station and another to search — or switch modes on
            the same device while testing.
          </Text>
        </View>

        <View style={styles.privacy}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#94A3B8" />
          <Text style={styles.privacyText}>
            This app uses a camera in your space. Only scan areas you have permission to record,
            and start with a desk or table before scanning a full room.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1220',
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
    fontSize: 40,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#94A3B8',
    maxWidth: 340,
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
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1F2937',
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
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
  },
});
