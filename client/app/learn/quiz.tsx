import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { healthQuizzes } from '../../data/education/quizzes';
import { Quiz } from '../../data/education/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GamificationQuizProps {
  quiz?: Quiz;
}

export default function GamificationQuizScreen({ quiz }: GamificationQuizProps) {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Initialize with first quiz or random quiz
    const availableQuizzes = healthQuizzes.filter(q => q.questions.length > 0);
    if (availableQuizzes.length > 0) {
      const randomQuiz = availableQuizzes[Math.floor(Math.random() * availableQuizzes.length)];
      setSelectedQuiz(randomQuiz);
    }

    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Cleanup any pending auto-advance timer on unmount
    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }
    };
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    setSelectedAnswer(answerIndex);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Clear any existing auto-advance timer and set a new one
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
    autoAdvanceRef.current = setTimeout(() => {
      handleNextQuestion();
      autoAdvanceRef.current = null;
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (!selectedQuiz || selectedAnswer === null || quizCompleted) return;

    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];

    // Record answer with functional update
    setUserAnswers(prev => [...prev, selectedAnswer]);

    // Check if answer is correct
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }

    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      setShowResult(true);
    }
  };

  const handleRestartQuiz = () => {
    // Clear any pending auto-advance
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }

    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizCompleted(false);
    setUserAnswers([]);

    // Select a new random quiz
    const availableQuizzes = healthQuizzes.filter(q => q.questions.length > 0);
    const randomQuiz = availableQuizzes[Math.floor(Math.random() * availableQuizzes.length)];
    setSelectedQuiz(randomQuiz);
  };

  const getScoreMessage = () => {
    if (!selectedQuiz) return '';

    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    if (percentage >= selectedQuiz.passingScore) {
      return `🎉 Excellent! You passed with ${percentage}%!`;
    } else {
      return `📚 Good try! You scored ${percentage}%. Try again to improve!`;
    }
  };

  const getBadgeColor = () => {
    if (!selectedQuiz) return '#9CA3AF';

    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    if (percentage >= selectedQuiz.passingScore) {
      return '#10B981'; // Green for passing
    } else {
      return '#F59E0B'; // Orange for needs improvement
    }
  };

  if (!selectedQuiz) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading quiz...</Text>
      </View>
    );
  }

  if (quizCompleted && showResult) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />

        <LinearGradient
          colors={['#9C27B0', '#7B1FA2']}
          style={styles.headerGradient}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Quiz Results</Text>
              <View style={styles.headerSpacer} />
            </View>
          </Animated.View>
        </LinearGradient>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <View style={styles.resultContainer}>
              <View style={[styles.badgeContainer, { backgroundColor: getBadgeColor() + '20' }]}>
                <Text style={[styles.badgeIcon, { color: getBadgeColor() }]}>
                  {selectedQuiz.badge.icon}
                </Text>
                <Text style={[styles.badgeName, { color: getBadgeColor() }]}>
                  {selectedQuiz.badge.name}
                </Text>
              </View>

              <Text style={styles.resultMessage}>{getScoreMessage()}</Text>

              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>
                  {score} / {selectedQuiz.questions.length}
                </Text>
                <Text style={styles.percentageText}>
                  {Math.round((score / selectedQuiz.questions.length) * 100)}%
                </Text>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.statText}>{score} Correct</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="close-circle" size={20} color="#EF4444" />
                  <Text style={styles.statText}>{selectedQuiz.questions.length - score} Incorrect</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.restartButton}
                onPress={handleRestartQuiz}
              >
                <LinearGradient
                  colors={['#9C27B0', '#7B1FA2']}
                  style={styles.restartButtonGradient}
                >
                  <Ionicons name="refresh" size={20} color="#FFFFFF" />
                  <Text style={styles.restartButtonText}>Try Another Quiz</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backToLearnButton}
                onPress={() => router.back()}
              >
                <Text style={styles.backToLearnText}>Back to Learn</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <LinearGradient
        colors={['#9C27B0', '#7B1FA2']}
        style={styles.headerGradient}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{selectedQuiz.title}</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%`,
                    backgroundColor: selectedQuiz.badge.color,
                  }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {currentQuestionIndex + 1} / {selectedQuiz.questions.length}
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <View style={styles.questionContainer}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>Question {currentQuestionIndex + 1}</Text>
              <View style={[styles.categoryBadge, { backgroundColor: selectedQuiz.badge.color + '20' }]}>
                <Text style={[styles.categoryBadgeText, { color: selectedQuiz.badge.color }]}>
                  {selectedQuiz.category}
                </Text>
              </View>
            </View>

            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswer === index && styles.selectedOptionButton,
                    selectedAnswer === index &&
                      index === currentQuestion.correctAnswer &&
                      styles.correctOptionButton,
                    selectedAnswer === index &&
                      index !== currentQuestion.correctAnswer &&
                      styles.incorrectOptionButton,
                  ]}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                >
                  <View style={styles.optionContent}>
                    <View style={[
                      styles.optionIndicator,
                      selectedAnswer === index && styles.selectedOptionIndicator,
                      selectedAnswer === index &&
                        index === currentQuestion.correctAnswer &&
                        styles.correctOptionIndicator,
                      selectedAnswer === index &&
                        index !== currentQuestion.correctAnswer &&
                        styles.incorrectOptionIndicator,
                    ]}>
                      <Text style={[
                        styles.optionLetter,
                        selectedAnswer === index && styles.selectedOptionLetter
                      ]}>
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    <Text style={[
                      styles.optionText,
                      selectedAnswer === index && styles.selectedOptionText
                    ]}>
                      {option}
                    </Text>
                    {selectedAnswer === index && (
                      <Ionicons
                        name={
                          index === currentQuestion.correctAnswer
                            ? "checkmark-circle"
                            : "close-circle"
                        }
                        size={20}
                        color={
                          index === currentQuestion.correctAnswer
                            ? "#10B981"
                            : "#EF4444"
                        }
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {selectedAnswer !== null && (
              <View style={styles.explanationContainer}>
                <Text style={styles.explanationTitle}>Explanation</Text>
                <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
              </View>
            )}

            <View style={styles.scorePreview}>
              <Text style={styles.scorePreviewText}>
                Current Score: {score} / {currentQuestionIndex + 1}
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 50,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  questionContainer: {
    padding: 20,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 24,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedOptionButton: {
    borderColor: '#9C27B0',
  },
  correctOptionButton: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  incorrectOptionButton: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOptionIndicator: {
    backgroundColor: '#9C27B0',
  },
  correctOptionIndicator: {
    backgroundColor: '#10B981',
  },
  incorrectOptionIndicator: {
    backgroundColor: '#EF4444',
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  selectedOptionLetter: {
    color: '#FFFFFF',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
  },
  selectedOptionText: {
    color: '#9C27B0',
    fontWeight: '600',
  },
  explanationContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#9C27B0',
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  scorePreview: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  scorePreviewText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  resultContainer: {
    padding: 20,
    alignItems: 'center',
  },
  badgeContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '600',
  },
  restartButton: {
    marginBottom: 16,
  },
  restartButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
  },
  restartButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backToLearnButton: {
    paddingVertical: 12,
  },
  backToLearnText: {
    fontSize: 16,
    color: '#9C27B0',
    fontWeight: '600',
    textAlign: 'center',
  },
});
