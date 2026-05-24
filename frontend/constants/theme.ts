export const colors = {
  // app-wide (purple night palette)
  background: '#1B1230',
  backgroundDeep: '#12081B',
  primary: '#E8CFFF',
  accent: '#CDA3FF',
  textLight: '#F3EFFF',
  textMuted: 'rgba(243,239,255,0.6)',

  // device / shell
  shell: '#2A2036',
  shellBorder: '#3B2E49',

  // screen / wallpaper
  wallpaperTop: '#2A1438',
  wallpaperMid: '#241337',
  wallpaperBottom: '#120821',
  screenOverlay: 'rgba(18,8,33,0.36)',
  screenGlow: 'rgba(205,163,255,0.06)',
  screenText: '#F3EFFF',

  // background accents
  softGlowTop: 'rgba(205,163,255,0.06)',
  softGlowBottom: 'rgba(153,120,200,0.04)',
  gridLine: 'rgba(255,255,255,0.02)',
  gridLineLight: 'rgba(255,255,255,0.01)',
  scanline: 'rgba(255,255,255,0.02)',
  star: '#FFF7FF',

  // buttons
  buttonPrimaryBg: 'rgba(255,255,255,0.12)',
  buttonPrimaryBorder: 'rgba(255,255,255,0.06)',
  buttonSecondaryBg: '#EEF6EB',
  buttonSecondaryBorder: '#A4B7A0',
  iconWrapPrimaryBg: 'rgba(255,255,255,0.06)',
  iconWrapPrimaryBorder: 'rgba(255,255,255,0.04)',
  iconWrapSecondaryBg: 'rgba(255,255,255,0.04)',
  iconWrapSecondaryBorder: 'rgba(255,255,255,0.02)',
  labelPrimary: '#F3EFFF',
  subtitlePrimary: 'rgba(243,239,255,0.72)',
  subtitleSecondary: 'rgba(243,239,255,0.5)',

  // misc
  muted: 'rgba(243,239,255,0.5)',
  danger: '#FF6B8A',
  // Retro platformer accents (safe, non-branded)
  retroSky: '#8ED0FF',
  retroHill: '#6CC24A',
  retroBrick: '#C76E3D',
  retroBlock: '#E8C04A',
  retroCoin: '#FFD24A',
  retroCloud: '#FFFFFF',
  retroPlayer: '#D94A3A',
};

export default colors;
/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
