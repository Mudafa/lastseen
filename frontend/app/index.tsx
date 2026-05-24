import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        <View style={styles.device}>
          <View style={styles.topLabelRow}>
            <View style={styles.powerLight} />
            <Text style={styles.topLabel}>Nintendo GAME BOY</Text>
            <Text style={styles.topVersion}>DMG-01</Text>
          </View>

          <View style={styles.screenFrame}>
            <View style={styles.screenTopBar}>
              <Text style={styles.screenTopText}>DOT MATRIX WITH STEREO SOUND</Text>
            </View>

            <View style={styles.screenBezel}>
              <View style={styles.screen}>
                <View style={styles.screenGlow} />
                <View style={styles.screenOverlay} />
                <View style={styles.screenTextBlock}>
                  <Text style={styles.screenLabel}>{APP_NAME}</Text>
                  <Text style={styles.screenLine}>{APP_TAGLINE}</Text>
                  <Text style={styles.screenLine}>{APP_DESCRIPTION}</Text>
                </View>
              </View>
            </View>

            <View style={styles.logoRow}>
              <Text style={styles.logoText}>Nintendo</Text>
              <Text style={styles.gameBoyText}>GAME BOY</Text>
            </View>
          </View>

          <View style={styles.controlsBlock}>
            <View style={styles.controlsRow}>
              <View style={styles.dPad}>
                <View style={[styles.dPadArm, styles.dPadArmVertical]} />
                <View style={[styles.dPadArm, styles.dPadArmHorizontal]} />
                <View style={styles.dPadCenter} />
              </View>

              <View style={styles.actionArea}>
                <View style={styles.actionButtons}>
                  <View style={styles.actionButton} />
                  <View style={[styles.actionButton, styles.actionButtonSecond]} />
                </View>

                <View style={styles.startSelectRow}>
                  <View style={styles.startSelectButton} />
                  <View style={styles.startSelectButton} />
                </View>
              </View>
            </View>

            <View style={styles.speakerRow}>
              <View style={styles.speakerSlit} />
              <View style={styles.speakerSlit} />
              <View style={styles.speakerSlit} />
              <View style={styles.speakerSlit} />
              <View style={styles.speakerSlit} />
            </View>
          </View>
        </View>

        <View style={styles.actionPanel}>
          <PrimaryButton
            label="Camera"
            subtitle="Capture a new scan"
            icon="camera"
            variant="primary"
            onPress={handleCameraMode}
          />
          <PrimaryButton
            label="Ask"
            subtitle="Look things up"
            icon="search"
            variant="secondary"
            onPress={handleAskMode}
          />
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
    paddingTop: 10,
    paddingBottom: 24,
    gap: 12,
  },
  device: {
    gap: 12,
    padding: 16,
    borderRadius: 28,
    backgroundColor: '#ECEDE3',
    borderWidth: 2,
    borderColor: '#AFAF9D',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
  },
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
    color: '#6E5C8B',
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
    color: '#6F6A7C',
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
    backgroundColor: '#8E9738',
    borderWidth: 2,
    borderColor: '#262C1F',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  screenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27, 44, 18, 0.16)',
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
    color: '#182012',
    letterSpacing: 0.8,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
  screenLine: {
    fontSize: 11,
    lineHeight: 14,
    color: '#182012',
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
    borderColor: '#AFAF9D',
  },
});
