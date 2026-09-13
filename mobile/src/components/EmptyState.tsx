import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../constants/theme';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionTitle?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionTitle,
  onActionPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionTitle && onActionPress && (
        <Button
          onPress={onActionPress}
          size="md"
          style={styles.button}
          title={actionTitle}
          variant="primary"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[6],
    marginVertical: theme.spacing[4],
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[800],
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  description: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.neutral[600],
    textAlign: 'center',
    marginBottom: theme.spacing[4],
    lineHeight: 20,
  },
  button: {
    minWidth: 160,
  },
});
