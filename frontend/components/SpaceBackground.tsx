import React from 'react';
import { View, StyleSheet } from 'react-native';

// Reduced, subtle stars for a minimal look
const STARS = [
  { l: 12, t: 18, s: 2.5, o: 0.35 },
  { l: 40, t: 8, s: 2, o: 0.28 },
  { l: 68, t: 24, s: 2.2, o: 0.3 },
  { l: 24, t: 62, s: 2, o: 0.22 },
  { l: 80, t: 72, s: 2.6, o: 0.3 },
];

export default function SpaceBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <View style={styles.gradient} />
      <View style={styles.nebula} />
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
    backgroundColor: '#030417',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#04050A',
  },
  // remove heavy nebula - keep a single subtle tint
  nebula: {
    position: 'absolute',
    right: -40,
    top: -60,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: 'rgba(124,58,237,0.06)',
    transform: [{ rotate: '12deg' }],
  },
  star: {
    position: 'absolute',
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
  },
});
