import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '../constants/theme';
import {
  TeacherDashboardScreen,
  SmartboardRemoteScreen,
  ClassPackManagerScreen,
  SyncStatusScreen,
  StorageManagerScreen,
  NotificationsScreen,
} from '../screens';

export type TeacherTab =
  | 'Dashboard'
  | 'SmartboardRemote'
  | 'ClassPacks'
  | 'SyncStatus'
  | 'StorageManager'
  | 'Notifications';

export interface TeacherNavigatorProps {
  onLogout?: () => void;
}

export const TeacherNavigator: React.FC<TeacherNavigatorProps> = () => {
  const [currentTab, setCurrentTab] = useState<TeacherTab>('Dashboard');

  const renderContent = () => {
    switch (currentTab) {
      case 'Dashboard':
        return <TeacherDashboardScreen onNavigate={(screen) => setCurrentTab(screen as TeacherTab)} />;
      case 'SmartboardRemote':
        return <SmartboardRemoteScreen />;
      case 'ClassPacks':
        return <ClassPackManagerScreen />;
      case 'SyncStatus':
        return <SyncStatusScreen />;
      case 'StorageManager':
        return <StorageManagerScreen />;
      case 'Notifications':
        return <NotificationsScreen />;
      default:
        return <TeacherDashboardScreen onNavigate={(screen) => setCurrentTab(screen as TeacherTab)} />;
    }
  };

  const navItems: Array<{ tab: TeacherTab; label: string; icon: string }> = [
    { tab: 'Dashboard', label: 'Home', icon: '🏠' },
    { tab: 'SmartboardRemote', label: 'Remote', icon: '📺' },
    { tab: 'ClassPacks', label: 'Packs', icon: '📦' },
    { tab: 'SyncStatus', label: 'Sync', icon: '🔄' },
    { tab: 'Notifications', label: 'Alerts', icon: '🔔' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{renderContent()}</View>

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
