export interface Article {
  id: string;
  title: string;
  category: 'diabetes' | 'hypertension' | 'nutrition' | 'exercise' | 'emergency';
  readTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  image: string;
  summary: string;
  content: string[];
  keyPoints: string[];
  tags: string[];
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
  badge: {
    name: string;
    icon: string;
    color: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
