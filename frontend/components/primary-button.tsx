import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

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

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      style={[
        styles.button,
        isPrimary ? styles.buttonPrimary : styles.buttonSecondary,
        style,
      ]}>
      <View style={styles.inner}>
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
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
  },
  buttonPrimary: {
    backgroundColor: '#D9E6D5',
    borderColor: '#8FA78B',
  },
  buttonSecondary: {
    backgroundColor: '#EEF6EB',
    borderColor: '#A4B7A0',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  iconWrapPrimary: {
    backgroundColor: '#243C2F',
    borderColor: '#E5F2E9',
  },
  iconWrapSecondary: {
    backgroundColor: '#D8E6D5',
    borderColor: '#8FA78B',
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
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.2,
    fontFamily: 'monospace',
  },
  labelPrimary: {
    color: '#243C2F',
  },
  labelSecondary: {
    color: '#243C2F',
  },
  subtitle: {
    fontSize: 10,
    lineHeight: 15,
    fontFamily: 'monospace',
  },
  subtitlePrimary: {
    color: 'rgba(36, 60, 47, 0.8)',
  },
  subtitleSecondary: {
    color: '#5C725E',
  },
});
