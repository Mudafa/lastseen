import React from 'react';
import { View, StyleSheet } from 'react-native';

const STARS = [
  { l: 12, t: 18, s: 2.5, o: 0.35 },
  { l: 40, t: 8, s: 2, o: 0.28 },
  { l: 68, t: 24, s: 2.2, o: 0.3 },
  { l: 24, t: 62, s: 2, o: 0.22 },
  { l: 80, t: 72, s: 2.6, o: 0.3 },
  { l: 86, t: 16, s: 1.8, o: 0.22 },
  { l: 58, t: 76, s: 1.6, o: 0.2 },
  { l: 8, t: 78, s: 2.4, o: 0.18 },
];

export default function SpaceBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <View style={styles.sky} />
      <View style={styles.haloTop} />
      <View style={styles.haloBottom} />
      <View style={styles.nebulaLeft} />
      <View style={styles.nebulaRight} />
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
    backgroundColor: '#02030A',
  },
  sky: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#02030A',
  },
  haloTop: {
    position: 'absolute',
    left: -80,
    top: -100,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: 'rgba(245, 158, 11, 0.11)',
  },
  haloBottom: {
    position: 'absolute',
    right: -100,
    bottom: -120,
    width: 320,
    height: 320,
    borderRadius: 320,
    backgroundColor: 'rgba(34, 197, 94, 0.09)',
  },
  nebulaLeft: {
    position: 'absolute',
    left: -70,
    top: 110,
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor: 'rgba(124,58,237,0.12)',
    transform: [{ rotate: '-18deg' }],
  },
  nebulaRight: {
    position: 'absolute',
    right: -50,
    top: 40,
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: 'rgba(14,165,233,0.08)',
    transform: [{ rotate: '16deg' }],
  },
  star: {
    position: 'absolute',
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    shadowColor: '#fff',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  content: {
    ...StyleSheet.absoluteFillObject,
  },
});
