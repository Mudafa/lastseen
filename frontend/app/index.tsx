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

const PIXEL_ROOM = [
  '00000000000000',
  '00000111110000',
  '00001122221100',
  '00011233332110',
  '00112344443210',
  '00112344443210',
  '00011223332110',
  '00000111110000',
] as const;

const PIXEL_COLORS = ['transparent', '#1F2937', '#F59E0B', '#FBBF24', '#34D399'] as const;

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
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>PIXEL MODE</Text>
            </View>
            <View style={styles.badgeAlt}>
              <Text style={styles.badgeAltText}>v1.0</Text>
            </View>
          </View>

          <Text style={styles.title}>{APP_NAME}</Text>
          <Text style={styles.tagline}>{APP_TAGLINE}</Text>

          <View style={styles.subtitleRow}>
            <Ionicons name="scan" size={12} color="#A7F3D0" />
            <Text style={styles.description}>{APP_DESCRIPTION}</Text>
          </View>

          <View style={styles.heroVisual}>
            <View style={styles.pixelFrame}>
              <View style={styles.pixelHeader}>
                <Text style={styles.pixelHeaderText}>ROOM SCAN</Text>
                <Text style={styles.pixelHeaderMeta}>READY</Text>
              </View>

              <View style={styles.pixelCanvas}>
                {PIXEL_ROOM.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.pixelRow}>
                    {row.split('').map((cell, cellIndex) => {
                      const colorIndex = Number(cell);
                      return (
                        <View
                          key={`${rowIndex}-${cellIndex}`}
                          style={[
                            styles.pixelCell,
                            { backgroundColor: PIXEL_COLORS[colorIndex] },
                          ]}
                        />
                      );
                    })}
                  </View>
                ))}
              </View>

              <View style={styles.pixelFooter}>
                <Text style={styles.pixelFooterText}>keys / wallet / notebook</Text>
              </View>
            </View>
          </View>

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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 14,
  },
  heroCard: {
    gap: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#0B1220',
    borderWidth: 2,
    borderColor: '#334155',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  badgeAlt: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 2,
    borderColor: '#475569',
  },
  badgeText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    fontFamily: 'monospace',
  },
  badgeAltText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  title: {
    fontSize: 36,
    lineHeight: 38,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 1.5,
    fontFamily: 'monospace',
  },
  tagline: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: '#A7F3D0',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontFamily: 'monospace',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  description: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: '#CBD5E1',
    fontFamily: 'monospace',
  },
  heroVisual: {
    paddingTop: 4,
  },
  pixelFrame: {
    gap: 10,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#64748B',
  },
  pixelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  pixelHeaderText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.6,
    color: '#F8FAFC',
    fontFamily: 'monospace',
  },
  pixelHeaderMeta: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#FBBF24',
    fontFamily: 'monospace',
  },
  pixelCanvas: {
    alignSelf: 'center',
    padding: 8,
    backgroundColor: '#020617',
    borderWidth: 2,
    borderColor: '#334155',
  },
  pixelRow: {
    flexDirection: 'row',
  },
  pixelCell: {
    width: 10,
    height: 10,
    margin: 1,
  },
  pixelFooter: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#334155',
  },
  pixelFooterText: {
    fontSize: 11,
    color: '#A7F3D0',
    fontFamily: 'monospace',
    letterSpacing: 0.9,
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
    borderRadius: 6,
    backgroundColor: '#111827',
    borderWidth: 2,
    borderColor: '#475569',
  },
  metricValue: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900',
    color: '#F8FAFC',
    fontFamily: 'monospace',
    letterSpacing: 0.6,
  },
  metricLabel: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 14,
    color: '#94A3B8',
    fontFamily: 'monospace',
  },
  actionPanel: {
    gap: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#0B1220',
    borderWidth: 2,
    borderColor: '#334155',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FCD34D',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    fontFamily: 'monospace',
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
    borderRadius: 8,
    backgroundColor: '#0B1220',
    borderWidth: 2,
    borderColor: '#475569',
  },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  featureCopy: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
    color: '#F8FAFC',
    fontFamily: 'monospace',
  },
  featureBody: {
    fontSize: 11,
    lineHeight: 16,
    color: '#94A3B8',
    fontFamily: 'monospace',
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
    fontSize: 11,
    lineHeight: 16,
    color: '#94A3B8',
    fontFamily: 'monospace',
  },
});
