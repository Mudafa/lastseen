import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from '@/constants/app';

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

const PIXEL_COLORS = ['transparent', '#163326', '#4ADE80', '#86EFAC', '#E5F2E9'] as const;

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
        <View style={styles.shell}>
          <View style={styles.headerRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>GAME BOY</Text>
            </View>
            <Text style={styles.version}>v1</Text>
          </View>

          <Text style={styles.title}>{APP_NAME}</Text>
          <Text style={styles.tagline}>{APP_TAGLINE}</Text>

          <View style={styles.screenFrame}>
            <View style={styles.screenTopBar}>
              <Text style={styles.screenTopText}>STATUS</Text>
              <View style={styles.statusLight} />
            </View>

            <View style={styles.screen}>
              <View style={styles.screenTextBlock}>
                <Text style={styles.screenLabel}>LAST SCAN</Text>
                <Text style={styles.screenLine}>KEYS: NEAR DESK</Text>
                <Text style={styles.screenLine}>WALLET: BY SOFA</Text>
                <Text style={styles.screenLine}>NOTEBOOK: UNKNOWN</Text>
              </View>

              <View style={styles.roomMiniMap}>
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
            </View>

            <View style={styles.screenBottomBar}>
              <Text style={styles.screenBottomText}>{APP_DESCRIPTION}</Text>
            </View>
          </View>

          <View style={styles.controlsRow}>
            <View style={styles.dPad}>
              <View style={[styles.dPadArm, styles.dPadArmVertical]} />
              <View style={[styles.dPadArm, styles.dPadArmHorizontal]} />
              <View style={styles.dPadCenter} />
            </View>

            <View style={styles.actionButtons}>
              <View style={styles.pillButton} />
              <View style={[styles.pillButton, styles.pillButtonSecond]} />
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
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
  shell: {
    gap: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#D8E6D5',
    borderWidth: 2,
    borderColor: '#9EB59C',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#243C2F',
    borderWidth: 2,
    borderColor: '#E5F2E9',
  },
  badgeText: {
    color: '#E5F2E9',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
    fontFamily: 'monospace',
  },
  version: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: '#466355',
    fontFamily: 'monospace',
  },
  title: {
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '900',
    color: '#243C2F',
    letterSpacing: 1.4,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    color: '#466355',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontFamily: 'monospace',
  },
  screenFrame: {
    gap: 8,
    padding: 10,
    borderRadius: 16,
    backgroundColor: '#2B4436',
    borderWidth: 2,
    borderColor: '#18261F',
  },
  screenTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  screenTopText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#E5F2E9',
    letterSpacing: 1.4,
    fontFamily: 'monospace',
  },
  statusLight: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#86EFAC',
    borderWidth: 1,
    borderColor: '#E5F2E9',
  },
  screen: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#DCEFD8',
    borderWidth: 2,
    borderColor: '#A6BFA2',
  },
  screenTextBlock: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  screenLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: '#243C2F',
    fontFamily: 'monospace',
  },
  screenLine: {
    fontSize: 11,
    lineHeight: 15,
    color: '#243C2F',
    fontFamily: 'monospace',
  },
  roomMiniMap: {
    alignSelf: 'center',
    padding: 6,
    backgroundColor: '#B8D0B5',
    borderWidth: 2,
    borderColor: '#7D957B',
  },
  pixelRow: {
    flexDirection: 'row',
  },
  pixelCell: {
    width: 9,
    height: 9,
    margin: 1,
  },
  screenBottomBar: {
    paddingHorizontal: 4,
  },
  screenBottomText: {
    fontSize: 10,
    lineHeight: 14,
    color: '#466355',
    fontFamily: 'monospace',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingTop: 2,
  },
  dPad: {
    width: 72,
    height: 72,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dPadArm: {
    position: 'absolute',
    backgroundColor: '#243C2F',
    borderWidth: 2,
    borderColor: '#E5F2E9',
  },
  dPadArmVertical: {
    width: 18,
    height: 64,
    borderRadius: 5,
  },
  dPadArmHorizontal: {
    width: 64,
    height: 18,
    borderRadius: 5,
  },
  dPadCenter: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#163326',
    borderWidth: 2,
    borderColor: '#E5F2E9',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  pillButton: {
    width: 26,
    height: 48,
    borderRadius: 999,
    backgroundColor: '#E45A76',
    borderWidth: 2,
    borderColor: '#F8FAFC',
    transform: [{ rotate: '-25deg' }],
  },
  pillButtonSecond: {
    backgroundColor: '#5C7CFA',
    transform: [{ rotate: '-25deg' }],
  },
  actionPanel: {
    gap: 10,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(217, 230, 213, 0.9)',
    borderWidth: 2,
    borderColor: '#9EB59C',
  },
});
