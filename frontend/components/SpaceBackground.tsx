import React from 'react';
import { View, StyleSheet } from 'react-native';

const STARS = [
  { l: 12, t: 18, s: 5, o: 0.9 },
  { l: 40, t: 8, s: 4, o: 0.82 },
  { l: 68, t: 24, s: 5, o: 0.84 },
  { l: 24, t: 62, s: 4, o: 0.78 },
  { l: 80, t: 72, s: 5, o: 0.88 },
  { l: 86, t: 16, s: 4, o: 0.8 },
  { l: 58, t: 76, s: 4, o: 0.76 },
  { l: 8, t: 78, s: 5, o: 0.72 },
  { l: 16, t: 42, s: 4, o: 0.7 },
  { l: 90, t: 54, s: 4, o: 0.72 },
];

export default function SpaceBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <View style={styles.sky} />
      <View style={styles.grid} />
      <View style={styles.scanlineTop} />
      <View style={styles.scanlineBottom} />
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
    backgroundColor: '#05060B',
  },
  sky: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#05060B',
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.16)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(148, 163, 184, 0.09)',
    borderStyle: 'solid',
  },
  scanlineTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  scanlineBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  star: {
    position: 'absolute',
    borderRadius: 0,
    backgroundColor: '#E2E8F0',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
  },
});
