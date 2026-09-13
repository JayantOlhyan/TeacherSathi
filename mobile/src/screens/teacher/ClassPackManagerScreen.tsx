import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Card, Button } from '../../components';
import { theme } from '../../constants/theme';
import { ClassPackService } from '../../services/classPackService';
import { databaseManager } from '../../database/databaseManager';
import { apiClient } from '../../services/authService';
import { CachedClassPackItem } from '../../types';

const classPackService = new ClassPackService(apiClient, databaseManager);

export const ClassPackManagerScreen: React.FC = () => {
  const [downloadedPacks, setDownloadedPacks] = useState<CachedClassPackItem[]>([]);
  const [downloadingChapterId, setDownloadingChapterId] = useState<string | null>(null);

  // Sample NCERT curriculum chapters for quick demo/testing
  const sampleChapters = [
    { id: 'ch-ncert-sci-8-1', chapterNumber: 1, title: 'Crop Production and Management' },
    { id: 'ch-ncert-sci-8-2', chapterNumber: 2, title: 'Microorganisms: Friend and Foe' },
    { id: 'ch-ncert-sci-8-3', chapterNumber: 3, title: 'Coal and Petroleum' },
    { id: 'ch-ncert-sci-8-4', chapterNumber: 4, title: 'Combustion and Flame' },
  ];

  const loadDownloadedPacks = async () => {
    const packs = await classPackService.listCachedClassPacks();
    setDownloadedPacks(packs);
  };

  useEffect(() => {
    loadDownloadedPacks();
  }, []);

  const handleDownload = async (chapterId: string) => {
    setDownloadingChapterId(chapterId);
    const result = await classPackService.downloadClassPack(chapterId);
    setDownloadingChapterId(null);

    if (result.success) {
      await loadDownloadedPacks();
      Alert.alert('Download Complete', 'Class Pack is now 100% offline-ready.');
    } else {
      Alert.alert('Download Failed', result.error || 'Could not download class pack.');
    }
  };

  const handleDelete = async (chapterId: string) => {
    await classPackService.deleteClassPack(chapterId);
    await loadDownloadedPacks();
  };

  const isDownloaded = (chapterId: string) => {
    return downloadedPacks.some((p) => p.chapter_id === chapterId);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>NCERT Offline Packs</Text>
        <Text style={styles.subtitle}>
          Download lesson plans, presentations, and formative questions to teach without internet.
        </Text>

        {sampleChapters.map((ch) => {
          const downloaded = isDownloaded(ch.id);
          const isDownloading = downloadingChapterId === ch.id;

          return (
            <Card key={ch.id} style={styles.chapterCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.chapterBadge}>Chapter {ch.chapterNumber}</Text>
                {downloaded && <Text style={styles.offlineTag}>✓ Offline Ready</Text>}
              </View>

              <Text style={styles.chapterTitle}>{ch.title}</Text>
              <Text style={styles.packageDetails}>
                Includes: Presentation, Mindmap, Class Activities, Diagnostic Quiz
              </Text>

              <View style={styles.btnRow}>
                {downloaded ? (
                  <Button
                    onPress={() => handleDelete(ch.id)}
                    size="md"
                    style={styles.deleteBtn}
                    title="Remove from Offline"
                    variant="outline"
                  />
                ) : (
                  <Button
                    loading={isDownloading}
                    onPress={() => handleDownload(ch.id)}
                    size="md"
                    style={styles.downloadBtn}
                    title={isDownloading ? 'Downloading...' : 'Download Pack'}
                    variant="primary"
                  />
                )}
              </View>
            </Card>
          );
        })}
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
    lineHeight: 20,
  },
  chapterCard: {
    padding: theme.spacing[4],
    marginBottom: theme.spacing[3],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[1],
  },
  chapterBadge: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.primary[700],
    textTransform: 'uppercase',
  },
  offlineTag: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.status.success,
  },
  chapterTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[1],
  },
  packageDetails: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[3],
  },
  btnRow: {
    marginTop: theme.spacing[1],
  },
  downloadBtn: {
    width: '100%',
  },
  deleteBtn: {
    width: '100%',
  },
});
