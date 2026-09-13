import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Button, Input, Card, OfflineBanner } from '../../components';
import { theme } from '../../constants/theme';
import { authService } from '../../services/authService';
import { networkMonitor } from '../../sync/networkMonitor';

export interface LoginScreenProps {
  onLoginSuccess: (role: 'TEACHER' | 'STUDENT') => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const connState = networkMonitor.getCurrentStatus();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const result = await authService.login(email, password);
    setLoading(false);

    if (result.success && result.session) {
      onLoginSuccess(result.session.user.role as 'TEACHER' | 'STUDENT');
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please check credentials.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <OfflineBanner
        pendingSyncCount={0}
        status={connState.status}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoIcon}>TS</Text>
            </View>
            <Text style={styles.brandTitle}>TeacherSathi</Text>
            <Text style={styles.subtitle}>
              NCERT-Focused AI Companion & Smart Classroom Co-Pilot
            </Text>
          </View>

          <Card style={styles.formCard}>
            <Text style={styles.formTitle}>Sign In</Text>

            {errorMessage && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            <Input
              autoCapitalize="none"
              keyboardType="email-address"
              label="Email Address"
              onChangeText={setEmail}
              placeholder="teacher@school.edu.in"
              value={email}
            />

            <Input
              label="Password"
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              value={password}
            />

            <Button
              loading={loading}
              onPress={handleLogin}
              size="lg"
              style={styles.submitButton}
              title="Sign In"
            />
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerNote}>
              Offline-ready for low-connectivity Indian classrooms.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing[4],
    justifyContent: 'center',
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: theme.colors.primary[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[3],
  },
  logoIcon: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: theme.typography.fontFamilies.bold,
  },
  brandTitle: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[900],
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.regular,
    color: theme.colors.neutral[600],
    textAlign: 'center',
    marginTop: theme.spacing[1],
    paddingHorizontal: theme.spacing[4],
  },
  formCard: {
    padding: theme.spacing[5],
  },
  formTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing[4],
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: theme.radii.md,
    padding: theme.spacing[3],
    marginBottom: theme.spacing[3],
  },
  errorText: {
    color: '#991B1B',
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.medium,
  },
  submitButton: {
    marginTop: theme.spacing[2],
  },
  footer: {
    marginTop: theme.spacing[6],
    alignItems: 'center',
  },
  footerNote: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.neutral[500],
    textAlign: 'center',
  },
});
