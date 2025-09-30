import { Article } from './types';

export const educationArticles: Article[] = [
  {
    id: '1',
    title: 'Understanding Type 2 Diabetes',
    category: 'diabetes',
    readTime: 8,
    difficulty: 'beginner',
    image: '📚',
    summary: 'Learn the fundamentals of Type 2 diabetes, including causes, symptoms, and management strategies.',
    content: [
      'Type 2 diabetes is a chronic condition that affects how your body processes blood sugar (glucose). With type 2 diabetes, your body either resists the effects of insulin or doesn\'t produce enough insulin to maintain normal glucose levels.',
      'Common symptoms include increased thirst, frequent urination, increased hunger, unintended weight loss, fatigue, blurred vision, slow-healing sores, and frequent infections.',
      'Risk factors include being overweight, physical inactivity, family history, age (45 or older), prediabetes, gestational diabetes, and certain ethnic backgrounds.',
      'Management involves healthy eating, regular physical activity, maintaining a healthy weight, monitoring blood sugar, and taking medications as prescribed by your doctor.',
    ],
    keyPoints: [
      'Type 2 diabetes affects how your body uses insulin',
      'Lifestyle changes can significantly improve blood sugar control',
      'Regular monitoring is essential for management',
      'Early detection and treatment prevent complications',
    ],
    tags: ['diabetes', 'blood-sugar', 'chronic-condition', 'lifestyle'],
  },
  {
    id: '2',
    title: 'Blood Pressure Basics: What You Need to Know',
    category: 'hypertension',
    readTime: 6,
    difficulty: 'beginner',
    image: '❤️',
    summary: 'Understanding blood pressure readings and how to maintain healthy levels.',
    content: [
      'Blood pressure is the force of blood pushing against artery walls. It\'s measured in millimeters of mercury (mmHg) and recorded as two numbers: systolic (top number) and diastolic (bottom number).',
      'Normal blood pressure is less than 120/80 mmHg. Elevated is 120-129/less than 80. High blood pressure (hypertension) Stage 1 is 130-139/80-89, and Stage 2 is 140/90 or higher.',
      'High blood pressure often has no symptoms, which is why it\'s called the "silent killer." Regular monitoring is crucial for early detection.',
      'Lifestyle changes that help include reducing sodium intake, maintaining a healthy weight, exercising regularly, limiting alcohol, managing stress, and getting quality sleep.',
    ],
    keyPoints: [
      'Know your numbers - check blood pressure regularly',
      'Lifestyle modifications are first-line treatment',
      'Reduce sodium to less than 2,300mg per day',
      'Exercise 150 minutes per week for heart health',
    ],
    tags: ['hypertension', 'heart-health', 'blood-pressure', 'prevention'],
  },
  {
    id: '3',
    title: 'The Low-Carb Diet: A Practical Guide',
    category: 'nutrition',
    readTime: 10,
    difficulty: 'intermediate',
    image: '🥗',
    summary: 'Everything you need to know about following a low-carb diet for better blood sugar control.',
    content: [
      'A low-carb diet restricts carbohydrates, primarily found in sugary foods, pasta, and bread. Instead, you eat foods rich in protein, fat, and healthy vegetables.',
      'Benefits include improved blood sugar control, weight loss, reduced hunger, lower triglycerides, and increased HDL (good) cholesterol.',
      'Focus on eating meat, fish, eggs, vegetables, fruit, nuts, seeds, high-fat dairy, healthy fats, and oils. Avoid sugar, grains, trans fats, and processed foods.',
      'Start gradually by reducing obvious sources of carbs like bread, pasta, and sugary drinks. Track your carb intake and aim for 50-150g per day depending on your goals.',
    ],
    keyPoints: [
      'Low-carb diets can improve blood sugar control',
      'Focus on whole, unprocessed foods',
      'Include plenty of non-starchy vegetables',
      'Stay hydrated and monitor electrolytes',
    ],
    tags: ['nutrition', 'low-carb', 'diet', 'blood-sugar'],
  },
  {
    id: '4',
    title: 'Exercise for Diabetes Management',
    category: 'exercise',
    readTime: 7,
    difficulty: 'beginner',
    image: '🏃',
    summary: 'How physical activity helps control blood sugar and improves overall health.',
    content: [
      'Exercise helps lower blood sugar levels and boosts your body\'s sensitivity to insulin. It also helps with weight management, reduces cardiovascular risk, and improves mood.',
      'Aim for at least 150 minutes of moderate-intensity aerobic activity per week, spread over at least 3 days. Include strength training 2-3 times per week.',
      'Good activities include brisk walking, swimming, cycling, dancing, and resistance training. Start slowly and gradually increase intensity and duration.',
      'Always check blood sugar before and after exercise. Carry a fast-acting carb source in case of low blood sugar. Stay hydrated and wear proper footwear.',
    ],
    keyPoints: [
      'Exercise improves insulin sensitivity',
      'Aim for 150 minutes of activity per week',
      'Monitor blood sugar before and after exercise',
      'Choose activities you enjoy for consistency',
    ],
    tags: ['exercise', 'diabetes', 'fitness', 'blood-sugar'],
  },
  {
    id: '5',
    title: 'Recognizing Diabetes Emergencies',
    category: 'emergency',
    readTime: 5,
    difficulty: 'beginner',
    image: '🚨',
    summary: 'Critical information about hypoglycemia and hyperglycemia emergencies.',
    content: [
      'Hypoglycemia (low blood sugar below 70 mg/dL) symptoms include shakiness, sweating, confusion, rapid heartbeat, and dizziness. Treat immediately with 15g of fast-acting carbs.',
      'Hyperglycemia (high blood sugar above 240 mg/dL) symptoms include frequent urination, increased thirst, blurred vision, and fatigue. Check for ketones if blood sugar is high.',
      'Diabetic ketoacidosis (DKA) is a serious complication with symptoms including nausea, vomiting, abdominal pain, fruity breath, and confusion. Seek immediate medical attention.',
      'Always wear medical ID, keep emergency contacts updated, and educate family members about recognizing and responding to diabetes emergencies.',
    ],
    keyPoints: [
      'Know the signs of low and high blood sugar',
      'Keep fast-acting carbs readily available',
      'Seek immediate help for severe symptoms',
      'Wear medical identification at all times',
    ],
    tags: ['emergency', 'diabetes', 'hypoglycemia', 'safety'],
  },
];

export const getArticlesByCategory = (category: Article['category']) => {
  return educationArticles.filter(article => article.category === category);
};

export const getFeaturedArticle = () => {
  return educationArticles[0];
};

export const searchArticles = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return educationArticles.filter(article =>
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.summary.toLowerCase().includes(lowercaseQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
