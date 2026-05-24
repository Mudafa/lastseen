import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions, Text } from 'react-native';
import Constants from 'expo-constants';
import { colors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

const stars = Array.from({ length: 36 }).map((_, i) => {
  const left = Math.random() * 100;
  const top = Math.random() * 85;
  const size = Math.random() * 2 + 0.6;
  const opacity = 0.25 + Math.random() * 0.9;
  const driftX = (Math.random() * 2 - 1) * (8 + (i % 4) * 2);
  const driftY = (Math.random() * 2 - 1) * (8 + (i % 3) * 2);
  return { id: `s-${i}`, left, top, size, opacity, driftX, driftY };
});

export default function SpaceBackground({ children }: { children: React.ReactNode }) {
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const drift = useRef(new Animated.Value(0)).current;

  const animatedStars = useMemo(() => stars, []);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 22000,
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 22000,
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [drift]);

  return (
    <View style={styles.container}>
      <View style={styles.wallpaperTop} />
      <View style={styles.wallpaperMid} />
      <View style={styles.wallpaperBottom} />

      {/* stars */}
      {animatedStars.map((s) => (
        <Animated.View
          key={s.id}
          style={[
            styles.star,
            {
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              transform: [
                {
                  translateX: drift.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, s.driftX, 0],
                  }),
                },
                {
                  translateY: drift.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, s.driftY, 0],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      {/* large moon */}
      <View style={styles.bigMoon} />

      {/* soft glow and vignette */}
      <View style={styles.softGlowTop} />
      <View style={styles.softGlowBottom} />
      <View style={styles.vignetteLeft} />
      <View style={styles.vignetteRight} />

      <View style={styles.versionBadge} pointerEvents="none">
        <Text style={styles.versionText}>v{version}</Text>
      </View>

      <View style={styles.content} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDeep,
  },
  wallpaperTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '40%',
    backgroundColor: colors.wallpaperTop,
  },
  wallpaperMid: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '30%',
    height: '40%',
    backgroundColor: colors.wallpaperMid,
    opacity: 0.98,
  },
  wallpaperBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    backgroundColor: colors.wallpaperBottom,
  },
  star: {
    position: 'absolute',
    backgroundColor: colors.star,
    borderRadius: 2,
  },
  bigMoon: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: -height * 0.03,
    width: width * 0.96,
    height: width * 0.55,
    borderRadius: width * 0.48,
    backgroundColor: 'rgba(243,229,247,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 12 },
  },
  softGlowTop: {
    position: 'absolute',
    left: -40,
    top: -40,
    width: 220,
    height: 220,
    backgroundColor: colors.softGlowTop,
    borderRadius: 220,
    opacity: 0.9,
  },
  softGlowBottom: {
    position: 'absolute',
    right: -40,
    bottom: -40,
    width: 260,
    height: 260,
    backgroundColor: colors.softGlowBottom,
    borderRadius: 260,
    opacity: 0.9,
  },
  vignetteLeft: {
    position: 'absolute',
    left: -60,
    top: 0,
    bottom: 0,
    width: 140,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderTopRightRadius: 220,
    borderBottomRightRadius: 220,
  },
  vignetteRight: {
    position: 'absolute',
    right: -60,
    top: 0,
    bottom: 0,
    width: 140,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderTopLeftRadius: 220,
    borderBottomLeftRadius: 220,
  },
  versionBadge: {
    position: 'absolute',
    top: 32,
    right: 16,
    zIndex: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(7, 10, 18, 0.26)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  versionText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
  },
});
