import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import { Button, Card, SyncBadge } from '../../components';
import { theme } from '../../constants/theme';
import { syncEngine } from '../../sync/syncEngine';
import { networkMonitor } from '../../sync/networkMonitor';
import { databaseManager } from '../../database/databaseManager';
import { NetworkConnectivityStatus, SyncOutboxItem } from '../../types';

export const SyncStatusScreen: React.FC = () => {
  const [status, setStatus] = useState<NetworkConnectivityStatus>('ONLINE');
  const [pendingItems, setPendingItems] = useState<SyncOutboxItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const loadOutboxData = async () => {
    const items = await databaseManager.getPendingOutboxItems();
    setPendingItems(items);
    setStatus(networkMonitor.getCurrentStatus().status);
  };

  useEffect(() => {
    loadOutboxData();
    const unsubscribe = networkMonitor.subscribe((state) => {
      setStatus(state.status);
      if (state.status === 'ONLINE') {
        loadOutboxData();
      }
    });
    return unsubscribe;
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await syncEngine.processOutbox();
      setLastSyncTime(new Date().toLocaleTimeString());
      await loadOutboxData();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Synchronization Center</Text>
        <Text style={styles.subtitle}>
          TeacherSathi automatically queues offline actions and uploads them safely when connected.
        </Text>

        <Card style={styles.statusCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionHeader}>Connection Status</Text>
            <SyncBadge pendingCount={pendingItems.length} status={status} />
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Pending Sync Items:</Text>
            <Text style={styles.statValue}>{pendingItems.length}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Last Synchronized:</Text>
            <Text style={styles.statValue}>{lastSyncTime || 'Pending sync'}</Text>
          </View>

          <Button
            disabled={status === 'OFFLINE' && pendingItems.length === 0}
            loading={isSyncing}
            onPress={handleManualSync}
            size="md"
            style={styles.syncButton}
            title={isSyncing ? 'Syncing...' : 'Sync Now'}
            variant="primary"
          />
        </Card>

        <Text style={styles.outboxHeader}>Transactional Outbox Queue</Text>

        {pendingItems.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>All offline changes have been synchronized.</Text>
          </Card>
        ) : (
          pendingItems.map((item) => (
            <Card key={item.id} style={styles.itemCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.itemType}>{item.entity_type}</Text>
                <Text style={[styles.itemStatus, item.status === 'FAILED' && styles.itemFailed]}>
                  {item.status}
                </Text>
              </View>
              <Text style={styles.itemPath}>{item.endpoint}</Text>
              <Text style={styles.itemMeta}>
                Attempts: {item.attempt_count} | Created: {new Date(item.created_at).toLocaleTimeString()}
              </Text>
              {item.error_message && (
                <Text style={styles.errorText}>{item.error_message}</Text>
              )}
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface.background,
  },
  container: {
    padding: theme.spacing[4],
  },
  title: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[900],
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral[600],
    marginTop: theme.spacing[1],
    marginBottom: theme.spacing[4],
    lineHeight: 20,
  },
  statusCard: {
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[3],
  },
  sectionHeader: {
    fontSize: theme.typography.fontSizes.base,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[800],
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.border,
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral[600],
  },
  statValue: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[900],
  },
  syncButton: {
    marginTop: theme.spacing[4],
  },
  outboxHeader: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing[3],
  },
  emptyCard: {
    padding: theme.spacing[4],
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.neutral[500],
    fontSize: theme.typography.fontSizes.sm,
  },
  itemCard: {
    padding: theme.spacing[3],
    marginBottom: theme.spacing[2],
  },
  itemType: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.primary[700],
  },
  itemStatus: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.status.info,
  },
  itemFailed: {
    color: theme.colors.status.error,
  },
  itemPath: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.neutral[700],
    marginTop: 4,
  },
  itemMeta: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.neutral[500],
    marginTop: 2,
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: theme.typography.fontSizes.xs,
    marginTop: 4,
  },
});
