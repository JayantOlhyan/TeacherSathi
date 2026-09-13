import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'elevated',
}) => {
  return <View style={[styles.base, styles[variant], style]}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radii.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[3],
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
  },
  flat: {
    backgroundColor: theme.colors.neutral[100],
  },
});
