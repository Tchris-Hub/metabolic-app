import { Quiz } from './types';

export const healthQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Diabetes Basics Quiz',
    category: 'diabetes',
    description: 'Test your knowledge about Type 2 diabetes management and prevention.',
    passingScore: 70,
    badge: {
      name: 'Diabetes Expert',
      icon: '🎓',
      color: '#4CAF50',
    },
    questions: [
      {
        id: 'q1',
        question: 'What is a normal fasting blood sugar level?',
        options: [
          'Below 70 mg/dL',
          '70-100 mg/dL',
          '100-125 mg/dL',
          'Above 126 mg/dL',
        ],
        correctAnswer: 1,
        explanation: 'A normal fasting blood sugar level is between 70-100 mg/dL. Levels between 100-125 mg/dL indicate prediabetes, and 126 mg/dL or higher indicates diabetes.',
      },
      {
        id: 'q2',
        question: 'How often should you check your blood sugar if you have diabetes?',
        options: [
          'Once a week',
          'Once a day',
          'As recommended by your doctor',
          'Only when you feel symptoms',
        ],
        correctAnswer: 2,
        explanation: 'The frequency of blood sugar monitoring should be determined by your healthcare provider based on your individual needs, medication, and treatment plan.',
      },
      {
        id: 'q3',
        question: 'Which of these foods has the lowest impact on blood sugar?',
        options: [
          'White bread',
          'Orange juice',
          'Broccoli',
          'White rice',
        ],
        correctAnswer: 2,
        explanation: 'Non-starchy vegetables like broccoli have minimal impact on blood sugar due to their low carbohydrate content and high fiber.',
      },
      {
        id: 'q4',
        question: 'What is the recommended A1C level for most people with diabetes?',
        options: [
          'Below 5%',
          'Below 7%',
          'Below 9%',
          'Below 11%',
        ],
        correctAnswer: 1,
        explanation: 'For most adults with diabetes, an A1C level below 7% is recommended. However, individual targets may vary based on personal health factors.',
      },
      {
        id: 'q5',
        question: 'Which activity helps improve insulin sensitivity?',
        options: [
          'Watching TV',
          'Regular exercise',
          'Sleeping more',
          'Eating frequently',
        ],
        correctAnswer: 1,
        explanation: 'Regular physical activity helps your body use insulin more effectively, improving insulin sensitivity and helping control blood sugar levels.',
      },
    ],
  },
  {
    id: '2',
    title: 'Blood Pressure Knowledge Check',
    category: 'hypertension',
    description: 'Assess your understanding of blood pressure management and heart health.',
    passingScore: 70,
    badge: {
      name: 'Heart Health Hero',
      icon: '❤️',
      color: '#E91E63',
    },
    questions: [
      {
        id: 'q1',
        question: 'What is considered normal blood pressure?',
        options: [
          'Less than 120/80 mmHg',
          'Less than 130/85 mmHg',
          'Less than 140/90 mmHg',
          'Less than 150/95 mmHg',
        ],
        correctAnswer: 0,
        explanation: 'Normal blood pressure is less than 120/80 mmHg. Readings of 120-129/less than 80 are considered elevated.',
      },
      {
        id: 'q2',
        question: 'How much sodium should you limit per day for heart health?',
        options: [
          'Less than 1,000mg',
          'Less than 1,500mg',
          'Less than 2,300mg',
          'Less than 3,500mg',
        ],
        correctAnswer: 2,
        explanation: 'The American Heart Association recommends limiting sodium to no more than 2,300mg per day, with an ideal limit of 1,500mg for most adults.',
      },
      {
        id: 'q3',
        question: 'Which number in a blood pressure reading is the systolic pressure?',
        options: [
          'The bottom number',
          'The top number',
          'The average of both',
          'The difference between them',
        ],
        correctAnswer: 1,
        explanation: 'The systolic pressure (top number) measures the pressure in your arteries when your heart beats. The diastolic (bottom number) measures pressure between beats.',
      },
      {
        id: 'q4',
        question: 'How much exercise per week is recommended for heart health?',
        options: [
          '30 minutes per week',
          '75 minutes per week',
          '150 minutes per week',
          '300 minutes per week',
        ],
        correctAnswer: 2,
        explanation: 'The American Heart Association recommends at least 150 minutes of moderate-intensity aerobic activity per week for optimal heart health.',
      },
    ],
  },
  {
    id: '3',
    title: 'Nutrition Fundamentals',
    category: 'nutrition',
    description: 'Test your knowledge about healthy eating and nutrition for chronic disease management.',
    passingScore: 70,
    badge: {
      name: 'Nutrition Navigator',
      icon: '🥗',
      color: '#FF9800',
    },
    questions: [
      {
        id: 'q1',
        question: 'Which macronutrient has the most impact on blood sugar?',
        options: [
          'Protein',
          'Fat',
          'Carbohydrates',
          'Fiber',
        ],
        correctAnswer: 2,
        explanation: 'Carbohydrates have the most direct impact on blood sugar levels as they break down into glucose during digestion.',
      },
      {
        id: 'q2',
        question: 'What is the glycemic index?',
        options: [
          'A measure of food calories',
          'A measure of food protein content',
          'A measure of how quickly food raises blood sugar',
          'A measure of food fat content',
        ],
        correctAnswer: 2,
        explanation: 'The glycemic index (GI) measures how quickly a food raises blood sugar levels. Low GI foods cause a slower, more gradual rise.',
      },
      {
        id: 'q3',
        question: 'How many grams of fiber should adults consume daily?',
        options: [
          '10-15 grams',
          '15-20 grams',
          '25-30 grams',
          '40-45 grams',
        ],
        correctAnswer: 2,
        explanation: 'Adults should aim for 25-30 grams of fiber per day. Fiber helps control blood sugar, improves digestion, and supports heart health.',
      },
      {
        id: 'q4',
        question: 'Which type of fat is healthiest for your heart?',
        options: [
          'Saturated fat',
          'Trans fat',
          'Monounsaturated fat',
          'All fats are equally healthy',
        ],
        correctAnswer: 2,
        explanation: 'Monounsaturated fats (found in olive oil, avocados, and nuts) are heart-healthy and can help improve cholesterol levels.',
      },
    ],
  },
];

export const getQuizzesByCategory = (category: string) => {
  return healthQuizzes.filter(quiz => quiz.category === category);
};

export const getQuizById = (id: string) => {
  return healthQuizzes.find(quiz => quiz.id === id);
};
