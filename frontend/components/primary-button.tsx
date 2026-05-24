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
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  buttonPrimary: {
    backgroundColor: 'rgba(245, 158, 11, 0.96)',
    borderColor: 'rgba(251, 191, 36, 0.9)',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  buttonSecondary: {
    backgroundColor: 'rgba(8, 15, 33, 0.82)',
    borderColor: 'rgba(148, 163, 184, 0.16)',
  },
  buttonHover: {
    opacity: 0.98,
    borderColor: 'rgba(251, 191, 36, 0.5)',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapPrimary: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
  },
  iconWrapSecondary: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  textWrap: {
    flex: 1,
    gap: 3,
  },
  label: {
    fontSize: 17,
    fontWeight: '800',
  },
  labelPrimary: {
    color: '#0F172A',
  },
  labelSecondary: {
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  subtitlePrimary: {
    color: 'rgba(15, 23, 42, 0.72)',
  },
  subtitleSecondary: {
    color: '#94A3B8',
  },
});
