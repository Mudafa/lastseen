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
        hovered && (isPrimary ? styles.buttonPrimaryHover : styles.buttonSecondaryHover),
        pressed && styles.buttonPressed,
        style,
      ]}>
      <Animated.View style={[{ transform: [{ scale }], flexDirection: 'row', alignItems: 'center' }]}>
        <View style={[styles.iconWrap, isPrimary ? styles.iconWrapPrimary : styles.iconWrapSecondary]}>
          <Ionicons name={icon} size={26} color={isPrimary ? '#0F172A' : '#F8FAFC'} />
        </View>

        <View style={styles.textWrap}>
          <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelSecondary]}>
            {label}
          </Text>
          {subtitle && (hovered || Platform.OS !== 'web') ? (
            <Text
              style={[styles.subtitle, isPrimary ? styles.subtitlePrimary : styles.subtitleSecondary]}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <Ionicons name="chevron-forward" size={22} color={isPrimary ? '#0F172A' : '#94A3B8'} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  buttonPrimary: {
    backgroundColor: '#F59E0B',
    borderColor: '#D97706',
  },
  buttonSecondary: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  buttonHover: {
    // hover visual state (scale handled by Animated)
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonPrimaryHover: {
    backgroundColor: '#FBBF24',
    borderColor: '#F59E0B',
  },
  buttonSecondaryHover: {
    backgroundColor: '#283444',
    borderColor: '#415162',
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapPrimary: {
    backgroundColor: 'rgba(15, 23, 42, 0.12)',
  },
  iconWrapSecondary: {
    backgroundColor: '#334155',
  },
  textWrap: {
    flex: 1,
    gap: 2,
    marginLeft: 8,
  },
  label: {
    fontSize: 17,
    fontWeight: '700',
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
