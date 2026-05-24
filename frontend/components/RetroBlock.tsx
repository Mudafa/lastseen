import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { colors } from '@/constants/theme';

type RetroBlockProps = {
  onCollect?: () => void;
};

export default function RetroBlock({ onCollect }: RetroBlockProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const [particle, setParticle] = useState<null | number>(null);
  const particleY = useRef(new Animated.Value(0)).current;
  const particleOpacity = useRef(new Animated.Value(0)).current;

  const playCollect = () => {
    // bounce block
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1.05, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();

    // coin particle
    const id = Date.now();
    setParticle(id);
    particleY.setValue(0);
    particleOpacity.setValue(1);
    Animated.parallel([
      Animated.timing(particleY, { toValue: -60, duration: 700, useNativeDriver: true }),
      Animated.timing(particleOpacity, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start(() => setParticle(null));

    if (onCollect) onCollect();
  };

  return (
    <View style={styles.wrap}>
      <Pressable onPress={playCollect} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
        <Animated.View style={[styles.block, { transform: [{ scale }] }]}> 
          <View style={styles.mark} />
        </Animated.View>
      </Pressable>

      {particle ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.coin,
            {
              transform: [{ translateY: particleY }],
              opacity: particleOpacity,
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 48, height: 48, alignItems: 'center' },
  block: {
    width: 48,
    height: 40,
    backgroundColor: colors.retroBrick,
    borderWidth: 2,
    borderColor: '#9C4F2D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    width: 18,
    height: 18,
    backgroundColor: colors.retroBlock,
    borderRadius: 3,
  },
  coin: {
    position: 'absolute',
    top: 6,
    width: 14,
    height: 14,
    borderRadius: 8,
    backgroundColor: colors.retroCoin,
    borderWidth: 1,
    borderColor: '#E6A800',
  },
});
