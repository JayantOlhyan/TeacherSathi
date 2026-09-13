import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Card, Button, SyncBadge, OfflineBanner } from '../../components';
import { theme } from '../../constants/theme';
import { networkMonitor } from '../../sync/networkMonitor';
import { databaseManager } from '../../database/databaseManager';
import { NetworkConnectivityStatus } from '../../types';

export interface TeacherDashboardProps {
  onNavigate: (screen: string) => void;
}

export const TeacherDashboardScreen: React.FC<TeacherDashboardProps> = ({
  onNavigate,
}) => {
  const [networkStatus, setNetworkStatus] = useState<NetworkConnectivityStatus>('ONLINE');
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [cachedPacksCount, setCachedPacksCount] = useState(0);

  useEffect(() => {
    const status = networkMonitor.getCurrentStatus();
    setNetworkStatus(status.status);

    const loadLocalStats = async () => {
      const summary = await databaseManager.getStorageUsageSummary();
      setPendingSyncCount(summary.pendingSyncCount);
      const packs = await databaseManager.listClassPacks();
      setCachedPacksCount(packs.length);
    };

    loadLocalStats();

    const unsubscribe = networkMonitor.subscribe((s) => {
      setNetworkStatus(s.status);
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <OfflineBanner
        pendingSyncCount={pendingSyncCount}
        status={networkStatus}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome, Teacher</Text>
            <Text style={styles.schoolText}>Govt. Model Senior Secondary School</Text>
          </View>
          <SyncBadge pendingCount={pendingSyncCount} status={networkStatus} />
        </View>

        {/* Quick Launch Cards */}
        <Text style={styles.sectionTitle}>Classroom Co-Pilot</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onNavigate('SmartboardRemote')}
        >
          <Card style={styles.actionCardPrimary}>
            <Text style={styles.actionBadge}>LIVE CLASSROOM</Text>
            <Text style={styles.actionTitle}>Smartboard Remote Control</Text>
            <Text style={styles.actionDesc}>
              Pair your phone with the classroom smartboard to switch slides, lock screens, and trigger quizzes.
            </Text>
            <Button
              onPress={() => onNavigate('SmartboardRemote')}
              size="md"
              style={styles.actionBtn}
              title="Open Remote Control"
              variant="secondary"
            />
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onNavigate('ClassPacks')}
        >
          <Card style={styles.actionCardSecondary}>
            <View style={styles.packHeader}>
              <Text style={styles.actionBadgeGreen}>OFFLINE READY</Text>
              <Text style={styles.packCountText}>{cachedPacksCount} Packs Cached</Text>
            </View>
            <Text style={styles.actionTitle}>NCERT Class Packs</Text>
            <Text style={styles.actionDesc}>
              Download complete lesson presentations, mindmaps, and formative questions for 100% offline teaching.
            </Text>
            <Button
              onPress={() => onNavigate('ClassPacks')}
              size="md"
              style={styles.actionBtnOutline}
              title="Manage Offline Packs"
              variant="outline"
            />
          </Card>
        </TouchableOpacity>

        {/* Quick Nav Grid */}
        <Text style={styles.sectionTitle}>Utilities & Tools</Text>

        <View style={styles.grid}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onNavigate('SyncStatus')}
            style={styles.gridItem}
          >
            <Card style={styles.miniCard}>
              <Text style={styles.miniCardTitle}>Sync Center</Text>
              <Text style={styles.miniCardSub}>
                {pendingSyncCount > 0 ? `${pendingSyncCount} pending items` : 'All synced'}
              </Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onNavigate('StorageManager')}
            style={styles.gridItem}
          >
            <Card style={styles.miniCard}>
              <Text style={styles.miniCardTitle}>Storage Budget</Text>
              <Text style={styles.miniCardSub}>Manage offline media</Text>
            </Card>
          </TouchableOpacity>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[5],
  },
  welcomeText: {
    fontSize: theme.typography.fontSizes.xl,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[900],
  },
  schoolText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.neutral[600],
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing[3],
  },
  actionCardPrimary: {
    backgroundColor: theme.colors.primary[900],
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  actionCardSecondary: {
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1.5,
    borderColor: theme.colors.primary[600],
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  actionBadge: {
    color: theme.colors.accent[500],
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.bold,
    letterSpacing: 1,
    marginBottom: 4,
  },
  actionBadgeGreen: {
    color: theme.colors.primary[700],
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.bold,
    letterSpacing: 1,
  },
  packHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  packCountText: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.primary[700],
  },
  actionTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.surface.card,
    marginBottom: theme.spacing[2],
  },
  actionDesc: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral[200],
    lineHeight: 20,
    marginBottom: theme.spacing[4],
  },
  actionBtn: {
    marginTop: theme.spacing[1],
  },
  actionBtnOutline: {
    marginTop: theme.spacing[1],
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
  },
  gridItem: {
    width: '48%',
  },
  miniCard: {
    padding: theme.spacing[3],
    alignItems: 'center',
  },
  miniCardTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[800],
    textAlign: 'center',
  },
  miniCardSub: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.neutral[500],
    marginTop: 4,
    textAlign: 'center',
  },
});
