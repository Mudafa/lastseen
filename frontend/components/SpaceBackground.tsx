import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { colors } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

const stars = Array.from({ length: 64 }).map((_, i) => {
  const left = Math.random() * 100;
  const top = Math.random() * 85; // keep stars above moon area
  const size = Math.random() * 2 + 1;
  const opacity = 0.3 + Math.random() * 0.9;
  return { id: `s-${i}`, left, top, size, opacity };
});

export default function SpaceBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <View style={styles.wallpaperTop} />
      <View style={styles.wallpaperMid} />
      <View style={styles.wallpaperBottom} />

      {stars.map(s => (
        <View
          key={s.id}
          style={[
            styles.star,
            { left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, opacity: s.opacity },
          ]}
        />
      ))}

      <View style={styles.bigMoon} />

      <View style={styles.softGlowTop} />
      <View style={styles.softGlowBottom} />

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
  waveTop: {
    position: 'absolute',
    top: '10%',
    left: -30,
    right: -30,
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 200,
    transform: [{ scaleX: 1.6 }],
  },
  softGlowTop: {
    position: 'absolute',
    left: -40,
    top: -40,
    width: 220,
    height: 220,
    backgroundColor: colors.softGlowTop,
    borderRadius: 220,
  },
  softGlowBottom: {
    position: 'absolute',
    right: -40,
    bottom: -40,
    width: 260,
    height: 260,
    backgroundColor: colors.softGlowBottom,
    borderRadius: 260,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
  },
});
