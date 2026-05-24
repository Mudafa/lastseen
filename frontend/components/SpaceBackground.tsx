import React from 'react';
import { StyleSheet, View } from 'react-native';

const STARS = [
  { l: 12, t: 18, s: 3, o: 0.85 },
  { l: 40, t: 8, s: 2, o: 0.75 },
  { l: 68, t: 24, s: 3, o: 0.8 },
  { l: 24, t: 62, s: 2, o: 0.7 },
  { l: 80, t: 72, s: 3, o: 0.82 },
  { l: 86, t: 16, s: 2, o: 0.76 },
  { l: 58, t: 76, s: 2, o: 0.7 },
  { l: 8, t: 78, s: 3, o: 0.68 },
] as const;

export default function SpaceBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <View style={styles.sky} />
      <View style={styles.softGlowTop} />
      <View style={styles.softGlowBottom} />
      <View style={styles.grid} />
      <View style={styles.scanline} />
      {STARS.map((s, i) => (
        <View
          key={i}
          pointerEvents="none"
          style={[
            styles.star,
            {
              left: `${s.l}%`,
              top: `${s.t}%`,
              width: s.s,
              height: s.s,
              opacity: s.o,
            },
          ]}
        />
      ))}
      <View style={styles.content} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D8E0D6',
  },
  sky: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D8E0D6',
  },
  softGlowTop: {
    position: 'absolute',
    left: -30,
    top: -30,
    width: 180,
    height: 180,
    backgroundColor: 'rgba(140, 162, 137, 0.14)',
    borderRadius: 180,
  },
  softGlowBottom: {
    position: 'absolute',
    right: -30,
    bottom: -30,
    width: 200,
    height: 200,
    backgroundColor: 'rgba(92, 114, 94, 0.09)',
    borderRadius: 200,
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'rgba(92, 114, 94, 0.08)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(92, 114, 94, 0.04)',
  },
  scanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
    backgroundColor: 'rgba(36, 60, 47, 0.06)',
  },
  star: {
    position: 'absolute',
    borderRadius: 0,
    backgroundColor: '#2F4A3A',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
  },
});
