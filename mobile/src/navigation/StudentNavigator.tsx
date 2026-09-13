import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '../constants/theme';
import {
  StudentDashboardScreen,
  OfflineAssessmentPlayerScreen,
  SyncStatusScreen,
  NotificationsScreen,
} from '../screens';

export type StudentTab = 'Learning' | 'Assessment' | 'SyncStatus' | 'Notifications';

export interface StudentNavigatorProps {
  onLogout?: () => void;
}

export const StudentNavigator: React.FC<StudentNavigatorProps> = () => {
  const [currentTab, setCurrentTab] = useState<StudentTab>('Learning');
  const [activeAssessmentId, setActiveAssessmentId] = useState<string | null>(null);

  const renderContent = () => {
    if (activeAssessmentId) {
      return (
        <OfflineAssessmentPlayerScreen
          assessmentId={activeAssessmentId}
          attemptId={`att-${Date.now()}`}
          onFinish={() => {
            setActiveAssessmentId(null);
            setCurrentTab('Learning');
          }}
          studentId="stu-current"
        />
      );
    }

    switch (currentTab) {
      case 'Learning':
        return (
          <StudentDashboardScreen
            onNavigate={(screen) => setCurrentTab(screen as StudentTab)}
            onStartAssessment={(id) => {
              setActiveAssessmentId(id);
              setCurrentTab('Assessment');
            }}
          />
        );
      case 'Assessment':
        return (
          <OfflineAssessmentPlayerScreen
            assessmentId="asmt-sample-science-8"
            attemptId={`att-${Date.now()}`}
            onFinish={() => setCurrentTab('Learning')}
            studentId="stu-current"
          />
        );
      case 'SyncStatus':
        return <SyncStatusScreen />;
      case 'Notifications':
        return <NotificationsScreen />;
      default:
        return (
          <StudentDashboardScreen
            onNavigate={(screen) => setCurrentTab(screen as StudentTab)}
            onStartAssessment={(id) => {
              setActiveAssessmentId(id);
              setCurrentTab('Assessment');
            }}
          />
        );
    }
  };

  const navItems: Array<{ tab: StudentTab; label: string; icon: string }> = [
    { tab: 'Learning', label: 'Home', icon: '📚' },
    { tab: 'Assessment', label: 'Tests', icon: '📝' },
    { tab: 'SyncStatus', label: 'Sync', icon: '🔄' },
    { tab: 'Notifications', label: 'Alerts', icon: '🔔' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{renderContent()}</View>

      {!activeAssessmentId && (
        <View style={styles.bottomBar}>
          {navItems.map((item) => {
            const isActive = currentTab === item.tab;
            return (
              <TouchableOpacity
                key={item.tab}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                activeOpacity={0.7}
                onPress={() => setCurrentTab(item.tab)}
                style={styles.tabItem}
              >
                <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                  {item.icon}
                </Text>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface.background,
  },
  content: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface.border,
    backgroundColor: theme.colors.surface.card,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56,
    paddingVertical: 4,
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.medium,
    color: theme.colors.neutral[600],
  },
  tabLabelActive: {
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.primary[700],
  },
});
