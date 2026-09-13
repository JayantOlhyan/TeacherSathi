import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../constants/theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const isInteractive = !disabled && !loading;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
      activeOpacity={0.7}
      disabled={!isInteractive}
      onPress={onPress}
      style={[
        styles.base,
        size === 'lg' ? styles.sizeLg : styles.sizeMd,
        styles[variant],
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? theme.colors.primary[700] : theme.colors.neutral[50]}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.baseText,
            styles[`text_${variant}`],
            size === 'lg' && styles.textLg,
            disabled && styles.disabledText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: theme.accessibility.minTouchTarget,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[4],
    flexDirection: 'row',
  },
  sizeMd: {
    paddingVertical: theme.spacing[3],
  },
  sizeLg: {
    paddingVertical: theme.spacing[4],
  },
  primary: {
    backgroundColor: theme.colors.primary[700],
  },
  secondary: {
    backgroundColor: theme.colors.accent[700],
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.primary[700],
  },
  danger: {
    backgroundColor: theme.colors.status.error,
  },
  disabled: {
    backgroundColor: theme.colors.neutral[300],
    borderColor: theme.colors.neutral[300],
  },
  baseText: {
    fontSize: theme.typography.fontSizes.base,
    fontFamily: theme.typography.fontFamilies.bold,
    textAlign: 'center',
  },
  text_primary: {
    color: theme.colors.neutral[50],
  },
  text_secondary: {
    color: theme.colors.neutral[50],
  },
  text_outline: {
    color: theme.colors.primary[700],
  },
  text_danger: {
    color: theme.colors.neutral[50],
  },
  textLg: {
    fontSize: theme.typography.fontSizes.lg,
  },
  disabledText: {
    color: theme.colors.neutral[500],
  },
});
