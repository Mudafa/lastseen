import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BackButton({ onPress }: { onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (to: number, dur = 120) => {
    Animated.timing(scale, { toValue: to, duration: dur, useNativeDriver: true }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => animateTo(1.08)}
      onHoverOut={() => animateTo(1)}
      onPressIn={() => animateTo(0.96, 80)}
      onPressOut={() => animateTo(1, 120)}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons name="chevron-back" size={22} color="#E6F0FF" />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  pressed: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
