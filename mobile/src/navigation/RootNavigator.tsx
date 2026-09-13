import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Linking } from 'react-native';
import { authService, UserSession } from '../services/authService';
import { apiClient } from '../services/apiClient';
import { LoginScreen } from '../screens/common/LoginScreen';
import { TeacherNavigator } from './TeacherNavigator';
import { StudentNavigator } from './StudentNavigator';
import { Button, Card } from '../components';
import { theme } from '../constants/theme';
import { AppVersionCheckResponse } from '../types';

export const RootNavigator: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateRequired, setUpdateRequired] = useState(false);
  const [updateUrl, setUpdateUrl] = useState<string | null>(null);

  useEffect(() => {
    const initApp = async () => {
      // 1. Check version requirements
      try {
        const versionRes = await apiClient.get<AppVersionCheckResponse>(
          '/api/mobile/version-check?platform=ANDROID&currentVersion=1.0.0'
        );
        if (versionRes.ok && versionRes.data?.status === 'UPDATE_REQUIRED') {
          setUpdateRequired(true);
          setUpdateUrl(versionRes.data.updateUrl || null);
        }
      } catch {
        // Continue offline if version check cannot be reached
      }

      // 2. Load stored auth session
      const storedSession = await authService.getCurrentSession();
      setSession(storedSession);
      setLoading(false);
    };

    initApp();
  }, []);

  const handleLoginSuccess = async () => {
    const active = await authService.getCurrentSession();
    setSession(active);
  };

  const handleLogout = async () => {
    await authService.logout();
    setSession(null);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading TeacherSathi...</Text>
      </View>
    );
  }

  // Blocking update modal for UPDATE_REQUIRED
  if (updateRequired) {
    return (
      <View style={styles.center}>
        <Card style={styles.updateCard}>
          <Text style={styles.updateBadge}>CRITICAL UPDATE REQUIRED</Text>
          <Text style={styles.updateTitle}>New Version Available</Text>
          <Text style={styles.updateDesc}>
            A critical update is required to continue using TeacherSathi Mobile. Please update your app from the official store.
          </Text>
          {updateUrl && (
            <Button
              onPress={() => Linking.openURL(updateUrl)}
              size="lg"
              title="Update Now"
              variant="primary"
            />
          )}
        </Card>
      </View>
    );
  }

  if (!session) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const isTeacher =
    session.user.role === 'TEACHER' ||
    session.user.role === 'PRINCIPAL' ||
    session.user.role === 'ADMIN';

  return isTeacher ? (
    <TeacherNavigator onLogout={handleLogout} />
  ) : (
    <StudentNavigator onLogout={handleLogout} />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.background,
    padding: theme.spacing[4],
  },
  loadingText: {
    fontSize: theme.typography.fontSizes.base,
    fontFamily: theme.typography.fontFamilies.medium,
    color: theme.colors.neutral[600],
  },
  updateCard: {
    padding: theme.spacing[6],
    alignItems: 'center',
  },
  updateBadge: {
    color: theme.colors.status.error,
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.bold,
    letterSpacing: 1,
    marginBottom: theme.spacing[2],
  },
  updateTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[2],
  },
  updateDesc: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral[600],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing[5],
  },
});
