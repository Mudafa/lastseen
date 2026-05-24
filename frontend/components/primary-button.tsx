import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

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
      <Animated.View style={[styles.inner, { transform: [{ scale }] }]}>
        <View style={[styles.iconWrap, isPrimary ? styles.iconWrapPrimary : styles.iconWrapSecondary]}>
          <Ionicons name={icon} size={18} color={isPrimary ? '#0F172A' : '#F8FAFC'} />
        </View>

        <View style={styles.textWrap}>
          <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelSecondary]}>{label}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, isPrimary ? styles.subtitlePrimary : styles.subtitleSecondary]}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <Ionicons name="chevron-forward" size={18} color={isPrimary ? '#0F172A' : '#94A3B8'} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  buttonPrimary: {
    backgroundColor: '#F59E0B',
    borderColor: '#FDE68A',
  },
  buttonSecondary: {
    backgroundColor: '#0B1220',
    borderColor: '#475569',
  },
  buttonHover: {
    opacity: 0.95,
    borderColor: '#FBBF24',
  },
  buttonPressed: {
    opacity: 0.88,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  iconWrapPrimary: {
    backgroundColor: '#FDE68A',
    borderColor: '#B45309',
  },
  iconWrapSecondary: {
    backgroundColor: '#1F2937',
    borderColor: '#334155',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  textWrap: {
    flex: 1,
    gap: 3,
  },
  label: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  labelPrimary: {
    color: '#0F172A',
  },
  labelSecondary: {
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 15,
    fontFamily: 'monospace',
  },
  subtitlePrimary: {
    color: 'rgba(15, 23, 42, 0.76)',
  },
  subtitleSecondary: {
    color: '#94A3B8',
  },
});
