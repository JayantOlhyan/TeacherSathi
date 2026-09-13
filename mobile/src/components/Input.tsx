import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { theme } from '../constants/theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  style,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholderTextColor={theme.colors.neutral[400]}
        style={[styles.input, Boolean(error) && styles.inputError, style]}
        {...rest}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing[3],
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.medium,
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing[1],
  },
  input: {
    minHeight: theme.accessibility.minTouchTarget,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing[3],
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.neutral[900],
    backgroundColor: theme.colors.surface.card,
  },
  inputError: {
    borderColor: theme.colors.status.error,
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: theme.typography.fontSizes.xs,
    marginTop: theme.spacing[1],
  },
  helperText: {
    color: theme.colors.neutral[500],
    fontSize: theme.typography.fontSizes.xs,
    marginTop: theme.spacing[1],
  },
});
