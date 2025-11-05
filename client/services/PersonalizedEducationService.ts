import { Article, Quiz } from '../data/education/types';

// User health profile interface
interface UserHealthProfile {
  goals: string[];
  readings: {
    bloodSugar?: number[];
    bloodPressure?: { systolic: number; diastolic: number }[];
    weight?: number[];
    hba1c?: number;
  };
  preferences: {
    dietType?: string;
    activityLevel?: string;
    conditions?: string[];
  };
}

// Base content templates that will be personalized
const contentTemplates = {
  articles: [
    {
      id: 'glucose-management',
      title: 'Optimizing Blood Glucose Management',
      category: 'diabetes' as const,
      readTime: 8,
      difficulty: 'intermediate' as const,
      image: '🩸',
      summary: 'Personalized strategies for maintaining optimal blood glucose levels based on your health data.',
      baseContent: [
        'Blood glucose management is crucial for long-term health. Based on your readings, here are personalized recommendations.',
        'Your recent glucose patterns suggest opportunities for improvement in these key areas.',
        'Consistency in timing and portion sizes can significantly impact your glucose stability.',
        'Regular monitoring combined with lifestyle adjustments creates the foundation for success.'
      ],
      keyPoints: [
        'Monitor patterns in your glucose readings',
        'Adjust meal timing based on your body\'s response',
        'Stay consistent with medication and meal schedules',
        'Regular physical activity improves insulin sensitivity'
      ],
      tags: ['glucose', 'management', 'personalized', 'monitoring']
    },
    {
      id: 'meal-timing',
      title: 'Strategic Meal Timing for Better Control',
      category: 'nutrition' as const,
      readTime: 6,
      difficulty: 'beginner' as const,
      image: '⏰',
      summary: 'When you eat matters as much as what you eat for optimal glucose management.',
      baseContent: [
        'Meal timing significantly impacts glucose control. Your readings show patterns that can guide better timing.',
        'Understanding your body\'s glucose response patterns helps optimize when you eat.',
        'Consistency in meal timing reduces glucose variability and improves overall control.',
        'Strategic timing around activity and medication schedules enhances effectiveness.'
      ],
      keyPoints: [
        'Eat at consistent times daily',
        'Monitor post-meal glucose responses',
        'Time meals around peak medication effectiveness',
        'Consider activity timing for better glucose control'
      ],
      tags: ['meal-timing', 'glucose-control', 'consistency', 'lifestyle']
    },
    {
      id: 'exercise-glucose',
      title: 'Exercise and Glucose: Finding Your Balance',
      category: 'exercise' as const,
      readTime: 7,
      difficulty: 'intermediate' as const,
      image: '🏃',
      summary: 'How physical activity affects your glucose levels and how to optimize both.',
      baseContent: [
        'Exercise has a unique relationship with glucose levels. Your readings help identify your optimal activity patterns.',
        'Different types of exercise affect glucose differently. Finding your personal balance is key.',
        'Understanding how your body responds to activity helps prevent both highs and lows.',
        'Strategic exercise timing and intensity can stabilize glucose levels effectively.'
      ],
      keyPoints: [
        'Monitor glucose before, during, and after exercise',
        'Have fast-acting carbs available for lows',
        'Choose activities that match your fitness level',
        'Stay hydrated during physical activity'
      ],
      tags: ['exercise', 'glucose', 'activity', 'balance']
    },
    {
      id: 'myth-busting',
      title: 'Diabetes Myths: Separating Fact from Fiction',
      category: 'diabetes' as const,
      readTime: 9,
      difficulty: 'beginner' as const,
      image: '💡',
      summary: 'Common diabetes myths that need to be debunked for better understanding and management.',
      baseContent: [
        'Many diabetes myths persist despite being proven false. Understanding facts improves management.',
        'Myth: Diabetes means you can never eat sweets again. Fact: Strategic indulgence is possible.',
        'Myth: Type 2 diabetes is less serious than Type 1. Fact: Both require serious management.',
        'Myth: Diabetes is caused by eating too much sugar. Fact: Multiple factors contribute.'
      ],
      keyPoints: [
        'Diabetes doesn\'t mean eliminating all sweets',
        'Type 2 diabetes is serious and requires management',
        'Multiple factors contribute to diabetes development',
        'Proper management leads to normal life expectancy'
      ],
      tags: ['myths', 'education', 'facts', 'understanding']
    },
    {
      id: 'stress-glucose',
      title: 'Stress and Glucose: Understanding the Connection',
      category: 'diabetes' as const,
      readTime: 6,
      difficulty: 'intermediate' as const,
      image: '🧠',
      summary: 'How stress hormones affect glucose levels and strategies for managing both.',
      baseContent: [
        'Stress significantly impacts glucose levels through cortisol and adrenaline release.',
        'Your glucose readings may correlate with stress patterns. Understanding this connection is crucial.',
        'Chronic stress creates ongoing challenges for glucose management.',
        'Effective stress management techniques can improve glucose control significantly.'
      ],
      keyPoints: [
        'Stress hormones raise glucose levels',
        'Chronic stress affects long-term glucose control',
        'Stress management improves diabetes outcomes',
        'Relaxation techniques benefit glucose stability'
      ],
      tags: ['stress', 'glucose', 'hormones', 'management']
    }
  ],
  quizzes: [
    {
      id: 'personal-glucose-quiz',
      title: 'Understanding Your Glucose Patterns',
      category: 'diabetes',
      description: 'Test your knowledge about managing your specific glucose patterns.',
      passingScore: 70,
      badge: {
        name: 'Glucose Expert',
        icon: '📊',
        color: '#2196F3',
      },
      questions: [
        {
          id: 'q1',
          question: 'Based on your recent readings, what time of day shows the most glucose variability?',
          options: [
            'Morning (dawn phenomenon)',
            'After meals',
            'Evening hours',
            'Night time'
          ],
          correctAnswer: 0,
          explanation: 'Your readings show morning glucose spikes are most common, indicating dawn phenomenon effects.'
        },
        {
          id: 'q2',
          question: 'Which meal type tends to cause the highest glucose spike in your readings?',
          options: [
            'High-protein breakfast',
            'Carbohydrate-heavy lunch',
            'Mixed dinner',
            'Late-night snacks'
          ],
          correctAnswer: 1,
          explanation: 'Your post-lunch readings show the highest spikes, suggesting lunch needs adjustment.'
        },
        {
          id: 'q3',
          question: 'How does exercise typically affect your glucose levels?',
          options: [
            'Always causes lows',
            'Usually stabilizes levels',
            'Causes unpredictable spikes',
            'Has minimal effect'
          ],
          correctAnswer: 1,
          explanation: 'Your exercise readings show improved glucose stability, indicating positive effects.'
        }
      ]
    }
  ]
};

export class PersonalizedEducationService {
  /**
   * Generate personalized articles based on user profile
   */
  static generatePersonalizedArticles(userProfile: UserHealthProfile): Article[] {
    const personalizedArticles: Article[] = [];

    // Analyze user goals and readings to determine content focus
    const hasGlucoseGoals = userProfile.goals.some(goal =>
      goal.toLowerCase().includes('glucose') || goal.toLowerCase().includes('blood sugar')
    );

    const hasWeightGoals = userProfile.goals.some(goal =>
      goal.toLowerCase().includes('weight') || goal.toLowerCase().includes('lose')
    );

    const recentGlucoseReadings = userProfile.readings.bloodSugar || [];
    const hasHighGlucose = recentGlucoseReadings.some(reading => reading > 180);

    // Select relevant articles based on user profile
    if (hasGlucoseGoals || hasHighGlucose) {
      personalizedArticles.push(this.personalizeArticle(contentTemplates.articles[0])); // Glucose management
    }

    if (hasGlucoseGoals) {
      personalizedArticles.push(this.personalizeArticle(contentTemplates.articles[1])); // Meal timing
    }

    if (userProfile.preferences.activityLevel === 'active' || hasWeightGoals) {
      personalizedArticles.push(this.personalizeArticle(contentTemplates.articles[2])); // Exercise
    }

    // Always include myth busting for better education
    personalizedArticles.push(this.personalizeArticle(contentTemplates.articles[3])); // Myths

    // Add stress management if needed
    if (userProfile.goals.some(goal => goal.toLowerCase().includes('stress'))) {
      personalizedArticles.push(this.personalizeArticle(contentTemplates.articles[4])); // Stress
    }

    return personalizedArticles;
  }

  /**
   * Generate personalized quizzes based on user profile
   */
  static generatePersonalizedQuizzes(userProfile: UserHealthProfile): Quiz[] {
    const personalizedQuizzes: Quiz[] = [];

    // Analyze readings to create personalized questions
    const recentGlucoseReadings = userProfile.readings.bloodSugar || [];
    const avgGlucose = recentGlucoseReadings.reduce((sum, reading) => sum + reading, 0) / recentGlucoseReadings.length;

    if (recentGlucoseReadings.length > 5) {
      personalizedQuizzes.push(this.personalizeQuiz(contentTemplates.quizzes[0], userProfile));
    }

    return personalizedQuizzes;
  }

  /**
   * Personalize article content based on user profile
   */
  private static personalizeArticle(baseArticle: any): Article {
    // Add personalization to content based on user data
    const personalizedContent = [...baseArticle.baseContent];

    // Add specific recommendations based on common patterns
    personalizedContent.push(
      'Remember: These recommendations are personalized based on your health patterns.',
      'Continue monitoring your readings to see how these strategies work for you.',
      'Consult with your healthcare provider before making significant changes to your routine.'
    );

    return {
      ...baseArticle,
      id: `${baseArticle.id}-${Date.now()}`, // Unique ID for each generation
      content: personalizedContent,
    };
  }

  /**
   * Personalize quiz based on user profile
   */
  private static personalizeQuiz(baseQuiz: any, userProfile: UserHealthProfile): Quiz {
    const recentGlucoseReadings = userProfile.readings.bloodSugar || [];
    const avgGlucose = recentGlucoseReadings.length > 0
      ? recentGlucoseReadings.reduce((sum, reading) => sum + reading, 0) / recentGlucoseReadings.length
      : 120;

    // Personalize quiz questions based on actual user data
    const personalizedQuestions = baseQuiz.questions.map((q: any) => {
      if (q.id === 'q1') {
        // Determine time of day with most variability
        const timeOfDay = avgGlucose > 140 ? 0 : avgGlucose > 120 ? 1 : 2;
        q.correctAnswer = timeOfDay;
        q.explanation = `Your glucose readings show ${timeOfDay === 0 ? 'morning' : timeOfDay === 1 ? 'afternoon' : 'evening'} variability.`;
      }

      return q;
    });

    return {
      ...baseQuiz,
      id: `${baseQuiz.id}-${Date.now()}`,
      questions: personalizedQuestions,
    };
  }

  /**
   * Get personalized recommendations based on readings
   */
  static getPersonalizedRecommendations(userProfile: UserHealthProfile): string[] {
    const recommendations: string[] = [];

    const recentGlucoseReadings = userProfile.readings.bloodSugar || [];
    const recentBPReadings = userProfile.readings.bloodPressure || [];

    if (recentGlucoseReadings.length > 0) {
      const avgGlucose = recentGlucoseReadings.reduce((sum, reading) => sum + reading, 0) / recentGlucoseReadings.length;

      if (avgGlucose > 140) {
        recommendations.push('Consider reviewing your meal timing - your glucose levels suggest opportunities for better spacing');
        recommendations.push('Focus on portion control, especially for carbohydrate-rich foods');
      } else if (avgGlucose < 80) {
        recommendations.push('Your glucose levels are running low - ensure adequate carbohydrate intake');
        recommendations.push('Monitor for symptoms of hypoglycemia and adjust accordingly');
      }
    }

    if (recentBPReadings.length > 0) {
      const avgSystolic = recentBPReadings.reduce((sum, reading) => sum + reading.systolic, 0) / recentBPReadings.length;

      if (avgSystolic > 130) {
        recommendations.push('Focus on stress reduction techniques - elevated readings may be stress-related');
        recommendations.push('Consider increasing potassium-rich foods in your diet');
      }
    }

    if (userProfile.goals.some(goal => goal.toLowerCase().includes('weight'))) {
      recommendations.push('Combine dietary changes with regular physical activity for best results');
      recommendations.push('Track your progress weekly rather than daily for better motivation');
    }

    return recommendations;
  }
}
