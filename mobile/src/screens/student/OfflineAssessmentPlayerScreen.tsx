import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card, Button } from '../../components';
import { theme } from '../../constants/theme';
import { AssessmentEngine } from '../../services/assessmentEngine';
import { databaseManager } from '../../database/databaseManager';
import { MaskedAssessmentQuestion } from '../../types';

const assessmentEngine = new AssessmentEngine(databaseManager);

export interface OfflineAssessmentPlayerProps {
  assessmentId: string;
  attemptId: string;
  studentId: string;
  onFinish: () => void;
}

export const OfflineAssessmentPlayerScreen: React.FC<OfflineAssessmentPlayerProps> = ({
  assessmentId,
  attemptId,
  studentId,
  onFinish,
}) => {
  const [questions, setQuestions] = useState<MaskedAssessmentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(1800); // default 30m
  const [isSealed, setIsSealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Initialize session or sample questions
  useEffect(() => {
    const initSession = async () => {
      try {
        const { questions: maskedQ, session } = await assessmentEngine.startAttemptSession({
          attemptId,
          assessmentId,
          studentId,
        });
        setQuestions(maskedQ);
        setSecondsRemaining(session.remainingSeconds);
      } catch {
        // Fallback demo questions if package wasn't pre-seeded
        const mockQuestions: MaskedAssessmentQuestion[] = [
          {
            id: 'q1',
            type: 'SINGLE_CHOICE',
            difficulty: 'EASY',
            marks: 1,
            question_en: 'Which of the following is a Kharif crop in India?',
            options: [
              { key: 'A', text: 'Wheat' },
              { key: 'B', text: 'Paddy (Rice)' },
              { key: 'C', text: 'Gram' },
              { key: 'D', text: 'Mustard' },
            ],
          },
          {
            id: 'q2',
            type: 'SINGLE_CHOICE',
            difficulty: 'MEDIUM',
            marks: 1,
            question_en: 'Which bacteria helps in nitrogen fixation in leguminous plants?',
            options: [
              { key: 'A', text: 'Lactobacillus' },
              { key: 'B', text: 'Rhizobium' },
              { key: 'C', text: 'Yeast' },
              { key: 'D', text: 'Penicillium' },
            ],
          },
        ];
        setQuestions(mockQuestions);
      }
    };

    initSession();
  }, [attemptId, assessmentId, studentId]);

  // Timer countdown
  useEffect(() => {
    if (isSealed || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isSealed, secondsRemaining]);

  const handleSelectOption = async (questionId: string, optionKey: string) => {
    if (isSealed) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));

    await assessmentEngine.recordAnswer({
      attemptId,
      questionId,
      selectedOptionKey: optionKey,
    });
  };

  const handleSubmit = async () => {
    Alert.alert(
      'Submit Assessment',
      'Are you sure you want to submit your assessment? It will be sealed and uploaded when online.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async () => {
            setSubmitting(true);
            await assessmentEngine.submitAttempt({
              attemptId,
              timeTakenSeconds: 1800 - secondsRemaining,
            });
            setIsSealed(true);
            setSubmitting(false);
          },
        },
      ]
    );
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading offline assessment questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isSealed) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Card style={styles.sealedCard}>
            <Text style={styles.sealedBadge}>✓ SEALED & QUEUED</Text>
            <Text style={styles.sealedTitle}>Assessment Submitted!</Text>
            <Text style={styles.sealedDesc}>
              Your attempt has been securely sealed on your device and queued for grading. Answers will automatically sync to TeacherSathi as soon as your device connects to the internet.
            </Text>
            <Button
              onPress={onFinish}
              size="lg"
              style={styles.doneBtn}
              title="Return to Learning Dashboard"
              variant="primary"
            />
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  const currentQ = questions[currentIndex];
  const selectedKey = selectedAnswers[currentQ?.id];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.progressText}>
            Question {currentIndex + 1} of {questions.length}
          </Text>
          <Text style={styles.marksText}>Marks: {currentQ?.marks || 1}</Text>
        </View>
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>⏱ {formatTimer(secondsRemaining)}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQ?.question_en}</Text>
        </Card>

        <Text style={styles.optionsHeader}>Select an option:</Text>

        {currentQ?.options?.map((option) => {
          const isSelected = selectedKey === option.key;

          return (
            <TouchableOpacity
              key={option.key}
              activeOpacity={0.8}
              onPress={() => handleSelectOption(currentQ.id, option.key)}
            >
              <Card
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
              >
                <View
                  style={[
                    styles.radioCircle,
                    isSelected && styles.radioCircleSelected,
                  ]}
                >
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option.key}. {option.text}
                </Text>
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.bottomNav}>
        <Button
          disabled={currentIndex <= 0}
          onPress={() => setCurrentIndex((prev) => prev - 1)}
          size="md"
          style={styles.navBtn}
          title="Previous"
          variant="outline"
        />

        {currentIndex === questions.length - 1 ? (
          <Button
            loading={submitting}
            onPress={handleSubmit}
            size="md"
            style={styles.navBtn}
            title="Finish & Submit"
            variant="secondary"
          />
        ) : (
          <Button
            onPress={() => setCurrentIndex((prev) => prev + 1)}
            size="md"
            style={styles.navBtn}
            title="Next Question"
            variant="primary"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface.border,
    backgroundColor: theme.colors.surface.card,
  },
  progressText: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[800],
  },
  marksText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.neutral[500],
  },
  timerBadge: {
    backgroundColor: theme.colors.neutral[100],
    paddingHorizontal: theme.spacing[3],
    paddingVertical: 6,
    borderRadius: theme.radii.full,
  },
  timerText: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.primary[800],
  },
  content: {
    padding: theme.spacing[4],
  },
  questionCard: {
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },
  questionText: {
    fontSize: theme.typography.fontSizes.base,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[900],
    lineHeight: 24,
  },
  optionsHeader: {
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[600],
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing[2],
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing[3],
    marginBottom: theme.spacing[2],
    borderWidth: 1.5,
    borderColor: theme.colors.surface.border,
  },
  optionCardSelected: {
    borderColor: theme.colors.primary[700],
    backgroundColor: '#F0FDF4',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.neutral[400],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },
  radioCircleSelected: {
    borderColor: theme.colors.primary[700],
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary[700],
  },
  optionText: {
    flex: 1,
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral[800],
  },
  optionTextSelected: {
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.primary[900],
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface.border,
    backgroundColor: theme.colors.surface.card,
  },
  navBtn: {
    width: '48%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[4],
  },
  loadingText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral[600],
  },
  sealedCard: {
    padding: theme.spacing[6],
    alignItems: 'center',
  },
  sealedBadge: {
    color: theme.colors.status.success,
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamilies.bold,
    letterSpacing: 1,
    marginBottom: theme.spacing[2],
  },
  sealedTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontFamily: theme.typography.fontFamilies.bold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  sealedDesc: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.neutral[600],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing[5],
  },
  doneBtn: {
    width: '100%',
  },
});
