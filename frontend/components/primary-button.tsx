import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, Platform, type ViewStyle } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
};

export function PrimaryButton({
  label,
  subtitle,
  icon,
  onPress,
  variant = 'primary',
  style,
}: PrimaryButtonProps) {
  const isPrimary = variant === 'primary';
  const [hovered, setHovered] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (to: number, dur = 150) => {
    Animated.timing(scale, { toValue: to, duration: dur, useNativeDriver: true }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      onHoverIn={() => {
        setHovered(true);
        animateTo(1.03);
      }}
      onHoverOut={() => {
        setHovered(false);
        animateTo(1);
      }}
      onPressIn={() => animateTo(0.98, 80)}
      onPressOut={() => animateTo(hovered ? 1.03 : 1, 120)}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.buttonPrimary : styles.buttonSecondary,
        hovered && styles.buttonHover,
        pressed && styles.buttonPressed,
        style,
      ]}>
      <Animated.View style={[{ transform: [{ scale }], flexDirection: 'row', alignItems: 'center' }]}>
        <View style={styles.textWrap}>
          <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelSecondary]}>{label}</Text>
          {subtitle && (hovered || Platform.OS !== 'web') ? (
            <Text style={[styles.subtitle, isPrimary ? styles.subtitlePrimary : styles.subtitleSecondary]}>{subtitle}</Text>
          ) : null}
        </View>

        <Ionicons name="chevron-forward" size={18} color={isPrimary ? '#E6F0FF' : '#94A3B8'} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 0,
  },
  buttonPrimary: {
    backgroundColor: 'transparent',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
  },
  buttonHover: {
    // subtle hover (scale handled by Animated)
    opacity: 0.98,
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 2,
    marginLeft: 6,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
  },
  labelPrimary: {
    color: '#E6F0FF',
  },
  labelSecondary: {
    color: '#94A3B8',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  subtitlePrimary: {
    color: 'rgba(230,240,255,0.7)',
  },
  subtitleSecondary: {
    color: '#94A3B8',
  },
});
