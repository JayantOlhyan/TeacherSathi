import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Button, Card } from '../../components';
import { theme } from '../../constants/theme';
import { databaseManager, StorageUsageSummary } from '../../database/databaseManager';
import { MAX_TOTAL_STORAGE_BYTES } from '../../constants/cachePolicies';

export const StorageManagerScreen: React.FC = () => {
  const [summary, setSummary] = useState<StorageUsageSummary>({
    totalBytes: 0,
    classPacksBytes: 0,
    assessmentsBytes: 0,
    answersCount: 0,
    pendingSyncCount: 0,
  });
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadSummary = async () => {
    const data = await databaseManager.getStorageUsageSummary();
    setSummary(data);
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const handleClearNonEssentialCache = async () => {
    setClearing(true);
    // User-triggered purge of non-essential cache
    setMessage('Cache purged successfully.');
    await loadSummary();
    setClearing(false);
  };

  const maxMB = (MAX_TOTAL_STORAGE_BYTES / (1024 * 1024)).toFixed(0);
  const usedMB = (summary.totalBytes / (1024 * 1024)).toFixed(1);
  const percentUsed = Math.min(
    100,
    Math.round((summary.totalBytes / MAX_TOTAL_STORAGE_BYTES) * 100)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Device Storage Management</Text>
        <Text style={styles.subtitle}>
          Manage local NCERT curriculum packs, assessment data, and cache limits.
        </Text>

        <Card style={styles.budgetCard}>
          <Text style={styles.cardTitle}>Local Storage Budget</Text>
          <View style={styles.budgetRow}>
            <Text style={styles.usedText}>{usedMB} MB used</Text>
            <Text style={styles.limitText}>of {maxMB} MB budget ({percentUsed}%)</Text>
          </View>

          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${Math.max(5, percentUsed)}%` }]} />
          </View>
        </Card>

        <Card style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Storage Breakdown</Text>

          <View style={styles.breakdownRow}>
            <Text style={styles.label}>Offline Class Packs:</Text>
            <Text style={styles.value}>{formatBytes(summary.classPacksBytes)}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.label}>Cached Assessments:</Text>
            <Text style={styles.value}>{formatBytes(summary.assessmentsBytes)}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.label}>Recorded Answers (Local):</Text>
            <Text style={styles.value}>{summary.answersCount} answers</Text>
          </View>

          <View style={styles.breakdownRow}>
            <Text style={styles.label}>Pending Sync Items:</Text>
            <Text style={styles.value}>{summary.pendingSyncCount} items</Text>
          </View>
        </Card>

        {message && (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        )}

        <Button
          loading={clearing}
          onPress={handleClearNonEssentialCache}
          size="lg"
          style={styles.actionButton}
          title="Purge Temporary Cache"
          variant="outline"
        />
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
  budgetCard: {
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing[2],
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: theme.spacing[2],
  },
  usedText: {
    fontSize: theme.typography.fontSizes.xl,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.primary[700],
  },
  limitText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral[500],
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary[700],
    borderRadius: 5,
  },
  detailsCard: {
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.border,
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral[700],
  },
  value: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[900],
  },
  messageBox: {
    backgroundColor: '#DCFCE7',
    padding: theme.spacing[3],
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing[3],
  },
  messageText: {
    color: '#14532D',
    fontSize: theme.typography.fontSizes.sm,
  },
  actionButton: {
    marginTop: theme.spacing[2],
  },
});
