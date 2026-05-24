import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/constants/theme';
import SpaceBackground from '@/components/SpaceBackground';

export default function HomeScreen() {
  const router = useRouter();

  const handleCameraMode = () => router.push('/camera');
  const handleAskMode = () => router.push('/ask');

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <SpaceBackground>
        <View style={styles.fullContainer}>
          <View style={styles.buttonRow}>
            <Pressable style={styles.bigButton} onPress={handleCameraMode}>
              <Ionicons name="camera" size={24} color={colors.primary} />
              <Text style={styles.buttonLabel}>Camera</Text>
            </Pressable>

            <Pressable style={styles.bigButton} onPress={handleAskMode}>
              <Ionicons name="search" size={24} color={colors.primary} />
              <Text style={styles.buttonLabel}>Ask</Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  centerContent: { alignItems: 'center', marginTop: 6 },
  fullContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buttonRow: { flexDirection: 'row', gap: 20 },
  bigButton: { width: 160, height: 64, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  buttonLabel: { color: colors.textLight, marginTop: 6, fontWeight: '700' },
  greeting: { color: colors.textMuted, fontSize: 16, marginBottom: 6 },
  bigTime: { color: colors.textLight, fontSize: 48, fontWeight: '700' },
  alarmChip: { marginTop: 8, backgroundColor: 'rgba(255,255,255,0.06)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, flexDirection: 'row', alignItems: 'center' },
  alarmText: { color: colors.textLight, marginLeft: 6, fontSize: 12 },
  statusRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  coinCounter: { flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 6 },
  coinDot: { width: 12, height: 12, borderRadius: 8, backgroundColor: colors.retroCoin, borderWidth: 1, borderColor: '#E6A800' },
  coinCount: { color: colors.textDark, fontWeight: '800' },
  searchBar: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 10,
    borderRadius: 12,
  },
  searchText: { color: colors.muted, marginLeft: 6 },
  moonArea: { alignItems: 'center', marginTop: -20 },
  pillButton: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.buttonPrimaryBg, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 28, borderWidth: 1, borderColor: colors.buttonPrimaryBorder },
  pillLabel: { color: colors.backgroundDeep, fontWeight: '800', marginLeft: 6 },
  description: { color: colors.textMuted, marginTop: 12, textAlign: 'center', paddingHorizontal: 24 },
  actionRow: { flexDirection: 'row', gap: 18, marginTop: 18 },
  headerAction: { alignItems: 'center', width: '45%' },
  headerActionIcon: { width: 76, height: 76, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', justifyContent: 'center' },
  headerActionLabel: { color: colors.textMuted, marginTop: 8 },
  figure: { width: 140, height: 180, marginBottom: -24 },
  grid: { paddingHorizontal: 12, gap: 18 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  iconCard: { width: '30%', alignItems: 'center' },
  iconCardDisabled: { width: '30%', alignItems: 'center', opacity: 0.5 },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  /* 4-column variants */
  iconRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  iconCard4: { width: '22%', alignItems: 'center' },
  iconCircle4: { width: 64, height: 64, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  iconLabel: { marginTop: 8, color: colors.textDark, fontWeight: '600' },
  iconLabelMuted: { marginTop: 8, color: colors.muted },
  topWidgets: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginTop: 6 },
  largeWidget: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  widgetTitle: { fontSize: 12, color: colors.muted },
  widgetValue: { fontSize: 28, fontWeight: '800', color: colors.textDark, marginTop: 6 },
  widgetMeta: { fontSize: 12, color: colors.muted, marginTop: 4 },
  smallWidget: { width: 88, height: 88, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  smallWidgetInner: { width: 60, height: 60, borderRadius: 12, backgroundColor: colors.primary },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 28, paddingVertical: 18, alignItems: 'center' },
  navItem: { alignItems: 'center' },
  navLabel: { color: colors.textMuted, marginTop: 6, fontSize: 11 },
  homeIndicator: { alignSelf: 'center', width: 134, height: 6, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.06)', marginTop: 10 },
  topLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  powerLight: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#D33C33',
    borderWidth: 1,
    borderColor: '#8E211D',
  },
  topLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.muted,
    letterSpacing: 0.8,
    fontFamily: 'monospace',
  },
  topVersion: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8C8C7C',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  screenFrame: {
    gap: 8,
    alignItems: 'stretch',
  },
  screenTopBar: {
    paddingHorizontal: 8,
  },
  screenTopText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.muted,
    letterSpacing: 1.4,
    fontFamily: 'monospace',
  },
  screenBezel: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: '#5D5870',
    borderWidth: 2,
    borderColor: '#464156',
  },
  screen: {
    minHeight: 220,
    borderRadius: 14,
    backgroundColor: colors.screenGreen,
    borderWidth: 2,
    borderColor: colors.screenBorder,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.screenGlow,
  },
  screenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.screenOverlay,
  },
  screenTextBlock: {
    width: '78%',
    gap: 8,
    alignItems: 'flex-start',
  },
  screenLabel: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '900',
    color: colors.screenText,
    letterSpacing: 0.8,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
  screenLine: {
    fontSize: 11,
    lineHeight: 14,
    color: colors.screenText,
    fontFamily: 'monospace',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    paddingLeft: 8,
  },
  logoText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3A465A',
    fontFamily: 'monospace',
  },
  gameBoyText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#5B76A6',
    letterSpacing: 0.8,
    fontFamily: 'monospace',
  },
  controlsBlock: {
    gap: 14,
    paddingTop: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  dPad: {
    width: 94,
    height: 94,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dPadArm: {
    position: 'absolute',
    backgroundColor: '#202020',
    borderWidth: 2,
    borderColor: '#0D0D0D',
  },
  dPadArmVertical: {
    width: 22,
    height: 78,
    borderRadius: 7,
  },
  dPadArmHorizontal: {
    width: 78,
    height: 22,
    borderRadius: 7,
  },
  dPadCenter: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#111111',
    borderWidth: 2,
    borderColor: '#3D3D3D',
  },
  actionArea: {
    gap: 18,
    alignItems: 'center',
    paddingRight: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  actionButton: {
    width: 32,
    height: 56,
    borderRadius: 999,
    backgroundColor: '#A61F31',
    borderWidth: 2,
    borderColor: '#5A0D18',
    transform: [{ rotate: '-27deg' }],
  },
  actionButtonSecond: {
    backgroundColor: '#A61F31',
  },
  startSelectRow: {
    flexDirection: 'row',
    gap: 12,
    transform: [{ rotate: '-10deg' }],
  },
  startSelectButton: {
    width: 42,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#B8B6BC',
    borderWidth: 1,
    borderColor: '#86838A',
  },
  speakerRow: {
    alignSelf: 'flex-end',
    width: 92,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 8,
    paddingBottom: 2,
    transform: [{ rotate: '-16deg' }],
  },
  speakerSlit: {
    width: 6,
    height: 30,
    borderRadius: 999,
    backgroundColor: '#9B9A9F',
    borderWidth: 1,
    borderColor: '#6B6A70',
  },
  actionPanel: {
    gap: 10,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(232, 233, 221, 0.94)',
    borderWidth: 2,
    borderColor: colors.shellBorder,
  },
});
