import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { NetworkConnectivityStatus } from '../types';

export interface OfflineBannerProps {
  status: NetworkConnectivityStatus;
  pendingSyncCount: number;
  onSyncPress?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  status,
  pendingSyncCount,
  onSyncPress,
}) => {
  if (status === 'ONLINE' && pendingSyncCount === 0) {
    return null;
  }

  const isOffline = status === 'OFFLINE';
  const isSyncing = status === 'SYNCING';
  const isError = status === 'SYNC_ERROR';

  const bgColor = isError
    ? '#FEF2F2'
    : isSyncing
    ? '#EFF6FF'
    : '#FFFBEB';

  const borderColor = isError
    ? '#FCA5A5'
    : isSyncing
    ? '#BFDBFE'
    : '#FDE68A';

  const textColor = isError
    ? '#991B1B'
    : isSyncing
    ? '#1E40AF'
    : '#92400E';

  let message = 'Offline mode active. All progress is safely saved locally.';
  if (isSyncing) {
    message = 'Syncing your offline changes to TeacherSathi cloud...';
  } else if (isError) {
    message = 'Sync could not complete. Retrying automatically.';
  } else if (pendingSyncCount > 0) {
    message = `Offline (${pendingSyncCount} changes pending sync)`;
  }

  return (
    <View style={[styles.banner, { backgroundColor: bgColor, borderColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{message}</Text>
      {onSyncPress && !isSyncing && (
        <TouchableOpacity
          accessibilityRole="button"
          onPress={onSyncPress}
          style={styles.actionButton}
        >
          <Text style={[styles.actionText, { color: textColor }]}>Sync Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderBottomWidth: 1,
  },
  text: {
    flex: 1,
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.medium,
  },
  actionButton: {
    marginLeft: theme.spacing[2],
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 4,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  actionText: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.bold,
  },
});
