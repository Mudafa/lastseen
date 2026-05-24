import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackButton from '@/components/BackButton';
import { API_BASE_URL } from '@/constants/api';
import { useDeviceWarnings } from '@/hooks/use-device-warnings';
import { colors } from '@/constants/theme';
import { uploadFrame, type UploadFrameResponse } from '@/lib/api';

const INTERVAL_OPTIONS = [3, 5, 10] as const;

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const uploadingRef = useRef(false);
  const scanningRef = useRef(false);

  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [intervalSec, setIntervalSec] = useState<(typeof INTERVAL_OPTIONS)[number]>(5);
  const [lastResult, setLastResult] = useState<UploadFrameResponse | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [scanCount, setScanCount] = useState(0);

  const { warnings, isOffline } = useDeviceWarnings();


  scanningRef.current = scanning;

  const captureAndUpload = useCallback(async () => {
    if (!cameraRef.current || uploadingRef.current || !scanningRef.current) {
      return;
    }
    if (isOffline) {
      setLastError('No internet — frame not uploaded.');
      return;
    }

    uploadingRef.current = true;
    setUploading(true);
    setLastError(null);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.35,
        skipProcessing: true,
        shutterSound: false,
      });

      if (!photo?.uri) {
        throw new Error('Could not capture photo.');
      }

      const result = await uploadFrame(photo.uri);
      setLastResult(result);
      setScanCount((c) => c + 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed.';
      setLastError(message);
    } finally {
      uploadingRef.current = false;
      setUploading(false);
    }
  }, [isOffline]);

  useEffect(() => {
    if (!scanning) return;

    void captureAndUpload();
    const timer = setInterval(() => {
      void captureAndUpload();
    }, intervalSec * 1000);

    return () => clearInterval(timer);
  }, [scanning, intervalSec, captureAndUpload]);

  if (!permission) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator color="#7C3AED" />
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text style={styles.title}>Camera</Text>
        </View>
        <View style={styles.centered}>
          <Ionicons name="camera-outline" size={48} color="#94A3B8" />
          <Text style={styles.permissionText}>Camera access is required to scan the room.</Text>
          <Pressable style={styles.primaryBtn} onPress={requestPermission}>
            <Text style={styles.primaryBtnText}>Allow camera</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text style={styles.title}>Camera station</Text>
        {scanning ? (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      {/* square camera preview centered */}
      <View style={styles.previewWrap}>
        <CameraView ref={cameraRef} style={styles.preview} facing="back" />
        {uploading ? (
          <View style={styles.previewOverlay}>
            <ActivityIndicator color={colors.textLight} />
          </View>
        ) : null}
      </View>

      <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent}>
        {warnings.length > 0 ? (
          <View style={styles.warningBox}>
            <Ionicons name="warning-outline" size={18} color="#FBBF24" />
            <Text style={styles.warningText}>{warnings.join(' · ')}</Text>
          </View>
        ) : null}

        <Text style={styles.apiHint}>Backend: {API_BASE_URL}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Scan every</Text>
          <View style={styles.intervalRow}>
            {INTERVAL_OPTIONS.map((sec) => (
              <Pressable
                key={sec}
                disabled={scanning}
                onPress={() => setIntervalSec(sec)}
                style={[
                  styles.intervalChip,
                  intervalSec === sec && styles.intervalChipActive,
                  scanning && styles.intervalChipDisabled,
                ]}>
                <Text
                  style={[
                    styles.intervalChipText,
                    intervalSec === sec && styles.intervalChipTextActive,
                  ]}>
                  {sec}s
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          style={[styles.primaryBtn, scanning && styles.stopBtn]}
          onPress={() => setScanning((s) => !s)}>
          <Ionicons name={scanning ? 'stop' : 'play'} size={20} color={scanning ? '#fff' : '#0F172A'} />
          <Text style={[styles.primaryBtnText, scanning && styles.stopBtnText]}>
            {scanning ? 'Stop scanning' : 'Start scanning'}
          </Text>
        </Pressable>

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Last scan</Text>
          <Text style={styles.statusMeta}>
            {scanCount === 0
              ? scanning
                ? 'Waiting for first frame…'
                : 'Not started'
              : `${scanCount} frame(s) sent`}
          </Text>

          {lastError ? <Text style={styles.errorText}>{lastError}</Text> : null}

          {lastResult ? (
            <>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Status</Text>
                <Text style={styles.statusValue}>{lastResult.status}</Text>
              </View>
              {lastResult.difference_score != null ? (
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Change</Text>
                  <Text style={styles.statusValue}>
                    {(lastResult.difference_score * 100).toFixed(1)}%
                  </Text>
                </View>
              ) : null}
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Events saved</Text>
                <Text style={styles.statusValue}>{lastResult.events_saved}</Text>
              </View>
              <Text style={styles.messageText}>{lastResult.message}</Text>
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerSpacer: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700', color: colors.textLight, flex: 1 },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  liveText: { color: colors.textLight, fontSize: 12, fontWeight: '700' },
  previewWrap: {
    width: '86%',
    aspectRatio: 1,
    marginTop: 12,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignSelf: 'center',
  },
  preview: { flex: 1 },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panel: { flex: 1 },
  panelContent: { padding: 16, gap: 14, paddingBottom: 32 },

  
  warningBox: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.25)',
  },
  warningText: { flex: 1, color: colors.textLight, fontSize: 13, lineHeight: 18 },
  apiHint: { color: colors.textMuted, fontSize: 11 },
  row: { gap: 8 },
  label: { color: colors.textLight, fontSize: 13, fontWeight: '600' },
  intervalRow: { flexDirection: 'row', gap: 8 },
  intervalChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  intervalChipActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  intervalChipDisabled: { opacity: 0.5 },
  intervalChipText: { color: colors.textLight, fontWeight: '600' },
  intervalChipTextActive: { color: colors.textLight },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    paddingVertical: 14,
    borderRadius: 12,
  },
  stopBtn: { backgroundColor: '#EF4444' },
  primaryBtnText: { color: colors.backgroundDeep, fontWeight: '700', fontSize: 16 },
  stopBtnText: { color: colors.backgroundDeep },
  statusCard: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 8,
  },
  statusTitle: { color: colors.textLight, fontWeight: '700', fontSize: 15 },
  statusMeta: { color: colors.textLight, fontSize: 12 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statusLabel: { color: colors.textMuted, fontSize: 13 },
  statusValue: { color: colors.textLight, fontSize: 13, fontWeight: '600' },
  messageText: { color: colors.textLight, fontSize: 13, lineHeight: 18, marginTop: 4 },
  errorText: { color: colors.textLight, fontSize: 13 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  permissionText: { color: '#94A3B8', textAlign: 'center', lineHeight: 22 },
});
