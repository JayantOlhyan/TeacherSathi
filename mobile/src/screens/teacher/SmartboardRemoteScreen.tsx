import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Card, Button, Input } from '../../components';
import { theme } from '../../constants/theme';
import { ClassroomService, ClassroomDeviceState } from '../../services/classroomService';
import { apiClient } from '../../services/authService';

const classroomService = new ClassroomService(apiClient);

export const SmartboardRemoteScreen: React.FC = () => {
  const [pairingCode, setPairingCode] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [pairing, setPairing] = useState(false);
  const [deviceState, setDeviceState] = useState<ClassroomDeviceState | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handlePair = async () => {
    if (!sessionId || !pairingCode) {
      Alert.alert('Missing Info', 'Please enter both Session ID and 6-character Pairing Code.');
      return;
    }

    setPairing(true);
    const res = await classroomService.pairWithSession({
      sessionId,
      token: pairingCode.toUpperCase(),
      deviceName: 'Teacher Phone Co-Pilot',
    });
    setPairing(false);

    if (res.success && res.state) {
      setDeviceState(res.state);
    } else {
      Alert.alert('Pairing Error', res.error || 'Failed to connect to Smartboard session.');
    }
  };

  const handleNextSlide = async () => {
    setActionLoading(true);
    await classroomService.nextSlide();
    setDeviceState(classroomService.getState());
    setActionLoading(false);
  };

  const handlePrevSlide = async () => {
    setActionLoading(true);
    await classroomService.prevSlide();
    setDeviceState(classroomService.getState());
    setActionLoading(false);
  };

  const handleToggleLock = async () => {
    if (!deviceState) return;
    setActionLoading(true);
    if (deviceState.isBoardLocked) {
      await classroomService.unlockSmartboard();
    } else {
      await classroomService.lockSmartboard();
    }
    setDeviceState(classroomService.getState());
    setActionLoading(false);
  };

  const handleDisconnect = () => {
    classroomService.disconnect();
    setDeviceState(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Smartboard Remote</Text>
        <Text style={styles.subtitle}>
          Control the classroom display seamlessly from your phone.
        </Text>

        {!deviceState ? (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Pair with Classroom Display</Text>
            <Text style={styles.cardSubtitle}>
              Look at the Smartboard display in your classroom for the 6-character pairing code.
            </Text>

            <Input
              autoCapitalize="none"
              label="Classroom Session ID"
              onChangeText={setSessionId}
              placeholder="e.g. sess-89a1c-34"
              value={sessionId}
            />

            <Input
              autoCapitalize="characters"
              label="6-Character Pairing Code"
              maxLength={6}
              onChangeText={setPairingCode}
              placeholder="e.g. AB12CD"
              value={pairingCode}
            />

            <Button
              loading={pairing}
              onPress={handlePair}
              size="lg"
              style={styles.pairButton}
              title="Pair with Smartboard"
            />
          </Card>
        ) : (
          <View>
            <Card style={styles.activeCard}>
              <View style={styles.statusRow}>
                <View style={styles.greenDot} />
                <Text style={styles.connectedText}>Connected to Session</Text>
              </View>
              <Text style={styles.sessionText}>ID: {deviceState.sessionId}</Text>
              <Text style={styles.slideCounter}>
                Current Slide: #{deviceState.currentSlideIndex + 1}
              </Text>
            </Card>

            <Text style={styles.sectionHeader}>Slide Navigation</Text>

            <View style={styles.navRow}>
              <Button
                disabled={actionLoading || deviceState.currentSlideIndex <= 0}
                onPress={handlePrevSlide}
                size="lg"
                style={styles.navButton}
                title="◀ Previous"
                variant="outline"
              />
              <Button
                disabled={actionLoading}
                onPress={handleNextSlide}
                size="lg"
                style={styles.navButton}
                title="Next ▶"
                variant="primary"
              />
            </View>

            <Text style={styles.sectionHeader}>Classroom Controls</Text>

            <Button
              disabled={actionLoading}
              onPress={handleToggleLock}
              size="md"
              style={styles.controlButton}
              title={deviceState.isBoardLocked ? '🔓 Unlock Smartboard' : '🔒 Lock Smartboard Screen'}
              variant={deviceState.isBoardLocked ? 'primary' : 'secondary'}
            />

            <Button
              onPress={handleDisconnect}
              size="md"
              style={styles.disconnectButton}
              title="Disconnect Device"
              variant="outline"
            />
          </View>
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
    marginTop: 2,
    marginBottom: theme.spacing[4],
  },
  card: {
    padding: theme.spacing[4],
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing[1],
  },
  cardSubtitle: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[4],
    lineHeight: 18,
  },
  pairButton: {
    marginTop: theme.spacing[2],
  },
  activeCard: {
    backgroundColor: theme.colors.primary[900],
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.status.success,
    marginRight: 8,
  },
  connectedText: {
    color: theme.colors.surface.card,
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.bold,
  },
  sessionText: {
    color: theme.colors.neutral[300],
    fontSize: theme.typography.fontSizes.xs,
    marginBottom: theme.spacing[2],
  },
  slideCounter: {
    color: theme.colors.accent[400],
    fontSize: theme.typography.fontSizes.xl,
    fontFamily: theme.typography.fontFamilies.bold,
  },
  sectionHeader: {
    fontSize: theme.typography.fontSizes.base,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing[3],
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
  },
  navButton: {
    width: '48%',
  },
  controlButton: {
    marginBottom: theme.spacing[3],
  },
  disconnectButton: {
    marginTop: theme.spacing[4],
  },
});
