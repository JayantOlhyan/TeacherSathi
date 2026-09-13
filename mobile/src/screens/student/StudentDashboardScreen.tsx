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

export interface StudentDashboardProps {
  onStartAssessment: (assessmentId: string) => void;
  onNavigate: (screen: string) => void;
}

export const StudentDashboardScreen: React.FC<StudentDashboardProps> = ({
  onStartAssessment,
  onNavigate,
}) => {
  const [networkStatus, setNetworkStatus] = useState<NetworkConnectivityStatus>('ONLINE');
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Sample assessments assigned to student
  const assignedAssessments = [
    {
      id: 'asmt-sample-science-8',
      title: 'Class 8 Science: Periodic Assessment 1',
      subject: 'Science',
      durationMinutes: 30,
      totalQuestions: 15,
      isOfflineReady: true,
      dueDate: 'Tomorrow, 5:00 PM',
    },
    {
      id: 'asmt-sample-math-8',
      title: 'Class 8 Mathematics: Linear Equations Quiz',
      subject: 'Mathematics',
      durationMinutes: 20,
      totalQuestions: 10,
      isOfflineReady: true,
      dueDate: 'Friday, 5:00 PM',
    },
  ];

  useEffect(() => {
    const status = networkMonitor.getCurrentStatus();
    setNetworkStatus(status.status);

    const loadSyncInfo = async () => {
      const summary = await databaseManager.getStorageUsageSummary();
      setPendingSyncCount(summary.pendingSyncCount);
    };

    loadSyncInfo();

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
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Hello, Aarav</Text>
            <Text style={styles.classText}>Class 8-A | Roll #14</Text>
          </View>
          <SyncBadge pendingCount={pendingSyncCount} status={networkStatus} />
        </View>

        <Text style={styles.sectionTitle}>Assigned Assessments</Text>

        {assignedAssessments.map((item) => (
          <Card key={item.id} style={styles.assessmentCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.subjectTag}>{item.subject}</Text>
              {item.isOfflineReady && (
                <Text style={styles.offlineTag}>✓ Ready for Offline</Text>
              )}
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.metaText}>
              Duration: {item.durationMinutes} mins • {item.totalQuestions} Questions
            </Text>
            <Text style={styles.dueText}>Due: {item.dueDate}</Text>

            <Button
              onPress={() => onStartAssessment(item.id)}
              size="md"
              style={styles.startBtn}
              title="Start Assessment"
              variant="primary"
            />
          </Card>
        ))}

        <Text style={styles.sectionTitle}>My Status</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onNavigate('SyncStatus')}
        >
          <Card style={styles.statusCard}>
            <Text style={styles.statusTitle}>Offline Submissions</Text>
            <Text style={styles.statusDesc}>
              {pendingSyncCount > 0
                ? `${pendingSyncCount} completed answers waiting to upload when internet is available.`
                : 'All offline answers are safely synced to TeacherSathi.'}
            </Text>
          </Card>
        </TouchableOpacity>
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
  classText: {
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
  assessmentCard: {
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[1],
  },
  subjectTag: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.primary[700],
  },
  offlineTag: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.status.success,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[1],
  },
  metaText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.neutral[600],
    marginBottom: 4,
  },
  dueText: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.medium,
    color: theme.colors.accent[700],
    marginBottom: theme.spacing[3],
  },
  startBtn: {
    marginTop: theme.spacing[1],
  },
  statusCard: {
    padding: theme.spacing[3],
  },
  statusTitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[800],
  },
  statusDesc: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.neutral[600],
    marginTop: 4,
    lineHeight: 18,
  },
});
