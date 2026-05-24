import React from 'react';
import { View, StyleSheet } from 'react-native';

const STARS = [
  { l: 5, t: 8, s: 3, o: 0.9 },
  { l: 12, t: 20, s: 4, o: 0.95 },
  { l: 22, t: 6, s: 3, o: 0.7 },
  { l: 32, t: 30, s: 5, o: 0.95 },
  { l: 44, t: 12, s: 3, o: 0.8 },
  { l: 56, t: 4, s: 2.5, o: 0.7 },
  { l: 68, t: 22, s: 5, o: 1 },
  { l: 78, t: 10, s: 3, o: 0.75 },
  { l: 88, t: 28, s: 3.5, o: 0.85 },
  { l: 10, t: 64, s: 3, o: 0.75 },
  { l: 24, t: 56, s: 3.2, o: 0.7 },
  { l: 36, t: 78, s: 4.5, o: 0.95 },
  { l: 52, t: 60, s: 3.5, o: 0.9 },
  { l: 66, t: 72, s: 3, o: 0.75 },
  { l: 82, t: 52, s: 4, o: 0.95 },
  { l: 92, t: 74, s: 2.5, o: 0.7 },
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
    backgroundColor: '#030417',
  },
  nebula: {
    position: 'absolute',
    right: -80,
    top: -120,
    width: 420,
    height: 420,
    borderRadius: 420,
    backgroundColor: 'rgba(124,58,237,0.12)',
    transform: [{ rotate: '20deg' }],
  },
  star: {
    position: 'absolute',
    borderRadius: 2,
    backgroundColor: '#fff',
    transform: [{ translateX: 0 }, { translateY: 0 }],
  },
  content: {
    ...StyleSheet.absoluteFillObject,
  },
});
