import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { NetworkConnectivityStatus } from '../types';

export interface SyncBadgeProps {
  status: NetworkConnectivityStatus;
  pendingCount?: number;
}

export const SyncBadge: React.FC<SyncBadgeProps> = ({ status, pendingCount = 0 }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'ONLINE':
        return {
          label: 'Online',
          dotColor: theme.colors.status.success,
          bgColor: '#DCFCE7',
          textColor: '#14532D',
        };
      case 'OFFLINE':
        return {
          label: pendingCount > 0 ? `Offline (${pendingCount} pending)` : 'Offline',
          dotColor: theme.colors.status.warning,
          bgColor: '#FEF3C7',
          textColor: '#78350F',
        };
      case 'SYNCING':
        return {
          label: 'Syncing...',
          dotColor: theme.colors.status.info,
          bgColor: '#DBEAFE',
          textColor: '#1E3A8A',
        };
      case 'SYNC_ERROR':
        return {
          label: 'Sync Failed',
          dotColor: theme.colors.status.error,
          bgColor: '#FEE2E2',
          textColor: '#7F1D1D',
        };
      default:
        return {
          label: 'Unknown',
          dotColor: theme.colors.neutral[400],
          bgColor: theme.colors.neutral[200],
          textColor: theme.colors.neutral[800],
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
      <View style={[styles.dot, { backgroundColor: config.dotColor }]} />
      <Text style={[styles.label, { color: config.textColor }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 4,
    borderRadius: theme.radii.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  label: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.bold,
  },
});
