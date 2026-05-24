import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from '@/constants/app';

const HIGHLIGHTS = [
  { icon: 'scan', title: 'Scan first', body: 'Capture room frames so search has context.' },
  { icon: 'chatbubble-ellipses', title: 'Ask naturally', body: 'Type a question the way you would ask a person.' },
  { icon: 'sparkles', title: 'See the result', body: 'Get the last known location with a matching image.' },
] as const;

const METRICS = [
  { label: '2 modes', value: 'Capture or ask' },
  { label: 'Fast setup', value: 'One tap to start' },
  { label: 'Private by default', value: 'Your room, your data' },
] as const;

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
        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <Ionicons name="scan" size={14} color="#FBBF24" />
            <Text style={styles.badgeText}>Room memory, simplified</Text>
          </View>

          <Text style={styles.title}>{APP_NAME}</Text>
          <Text style={styles.tagline}>{APP_TAGLINE}</Text>
          <Text style={styles.description}>{APP_DESCRIPTION}</Text>

          <View style={styles.metricsRow}>
            {METRICS.map((metric) => (
              <View key={metric.label} style={styles.metricCard}>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionPanel}>
          <Text style={styles.sectionLabel}>Start here</Text>
          <View style={styles.actions}>
            <PrimaryButton
              label="Camera"
              subtitle="Scan the room and record what is visible."
              icon="camera"
              variant="primary"
              onPress={handleCameraMode}
            />
            <PrimaryButton
              label="Ask"
              subtitle="Search for an item by asking where it was last seen."
              icon="search"
              variant="secondary"
              onPress={handleAskMode}
            />
          </View>
        </View>

        <View style={styles.featureSection}>
          <Text style={styles.sectionLabel}>What it does</Text>
          <View style={styles.featureList}>
            {HIGHLIGHTS.map((item) => (
              <View key={item.title} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name={item.icon} size={18} color="#E6F0FF" />
                </View>
                <View style={styles.featureCopy}>
                  <Text style={styles.featureTitle}>{item.title}</Text>
                  <Text style={styles.featureBody}>{item.body}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footerNote}>
          <Ionicons name="lock-closed-outline" size={14} color="#94A3B8" />
          <Text style={styles.footerNoteText}>
            Last Seen keeps the interface light and focused so the search workflow feels fast.
          </Text>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    gap: 18,
  },
  heroCard: {
    gap: 14,
    padding: 18,
    borderRadius: 24,
    backgroundColor: 'rgba(7, 16, 41, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
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
    fontSize: 42,
    lineHeight: 44,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -1.1,
  },
  tagline: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#94A3B8',
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 6,
  },
  metricCard: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 100,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.68)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  metricValue: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  metricLabel: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    color: '#94A3B8',
  },
  actionPanel: {
    gap: 12,
    padding: 16,
    borderRadius: 22,
    backgroundColor: 'rgba(2, 6, 23, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  actions: {
    gap: 10,
  },
  featureSection: {
    gap: 10,
  },
  featureList: {
    gap: 10,
  },
  featureCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(7, 16, 41, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  featureCopy: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  featureBody: {
    fontSize: 13,
    lineHeight: 18,
    color: '#94A3B8',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 6,
    paddingTop: 2,
    paddingBottom: 8,
  },
  footerNoteText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#94A3B8',
  },
});
