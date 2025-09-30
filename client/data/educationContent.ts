export interface EducationContent {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'video' | 'infographic' | 'quiz' | 'interactive';
  category: 'diabetes' | 'hypertension' | 'obesity' | 'cholesterol' | 'general-health' | 'prevention';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  targetAudience: string[];
  tags: string[];
  author: string;
  lastUpdated: string;
  source: string;
  references: string[];
  keyPoints: string[];
  actionableSteps: string[];
  relatedContent: string[];
  mediaUrl?: string;
  thumbnailUrl?: string;
}

export const educationContent: EducationContent[] = [
  {
    id: 'understanding-type2-diabetes',
    title: 'Understanding Type 2 Diabetes',
    content: 'Type 2 diabetes is a chronic condition that affects how your body processes blood sugar (glucose). In type 2 diabetes, your body either doesn\'t produce enough insulin or doesn\'t use insulin effectively. This leads to high blood sugar levels, which can cause serious health problems over time.\n\n**What is Insulin?**\nInsulin is a hormone produced by the pancreas that helps glucose enter your cells to be used for energy. When you have type 2 diabetes, your cells become resistant to insulin, and your pancreas can\'t make enough insulin to overcome this resistance.\n\n**Risk Factors**\n- Family history of diabetes\n- Being overweight or obese\n- Physical inactivity\n- Age (45 or older)\n- High blood pressure\n- High cholesterol\n- History of gestational diabetes\n\n**Symptoms**\n- Increased thirst and urination\n- Fatigue\n- Blurred vision\n- Slow-healing sores\n- Frequent infections\n- Unexplained weight loss\n\n**Complications**\nIf left untreated, type 2 diabetes can lead to:\n- Heart disease and stroke\n- Kidney disease\n- Nerve damage (neuropathy)\n- Eye problems (retinopathy)\n- Foot problems\n- Skin conditions\n\n**Management**\nType 2 diabetes can be managed through:\n- Healthy eating\n- Regular physical activity\n- Weight management\n- Medication (if needed)\n- Blood sugar monitoring\n- Regular check-ups with healthcare providers',
    type: 'article',
    category: 'diabetes',
    difficulty: 'beginner',
    duration: 15,
    targetAudience: ['newly-diagnosed', 'family-members', 'caregivers'],
    tags: ['type2-diabetes', 'basics', 'symptoms', 'management'],
    author: 'Dr. Sarah Johnson, Endocrinologist',
    lastUpdated: '2024-01-20',
    source: 'American Diabetes Association',
    references: [
      'https://www.diabetes.org/diabetes/type-2',
      'https://www.mayoclinic.org/diseases-conditions/type-2-diabetes',
      'https://www.cdc.gov/diabetes/basics/type2.html'
    ],
    keyPoints: [
      'Type 2 diabetes affects how your body processes blood sugar',
      'Risk factors include family history, weight, and lifestyle',
      'Symptoms can develop gradually and may go unnoticed',
      'Early diagnosis and management can prevent complications',
      'Lifestyle changes are often the first line of treatment'
    ],
    actionableSteps: [
      'Get regular blood sugar screenings if you have risk factors',
      'Maintain a healthy weight through diet and exercise',
      'Eat a balanced diet with controlled carbohydrates',
      'Stay physically active for at least 150 minutes per week',
      'Work with your healthcare team to develop a management plan'
    ],
    relatedContent: ['blood-sugar-monitoring', 'diabetes-nutrition', 'exercise-for-diabetes'],
    mediaUrl: 'https://example.com/type2-diabetes-video',
    thumbnailUrl: 'https://example.com/type2-diabetes-thumbnail.jpg'
  },
  {
    id: 'blood-pressure-basics',
    title: 'Understanding High Blood Pressure',
    content: 'High blood pressure (hypertension) is a common condition where the force of blood against your artery walls is consistently too high. It\'s often called the "silent killer" because it usually has no symptoms until it causes serious health problems.\n\n**What is Blood Pressure?**\nBlood pressure is measured in millimeters of mercury (mmHg) and recorded as two numbers:\n- **Systolic pressure** (top number): The pressure when your heart beats\n- **Diastolic pressure** (bottom number): The pressure when your heart rests between beats\n\n**Blood Pressure Categories**\n- **Normal**: Less than 120/80 mmHg\n- **Elevated**: 120-129/less than 80 mmHg\n- **Stage 1 Hypertension**: 130-139/80-89 mmHg\n- **Stage 2 Hypertension**: 140/90 mmHg or higher\n- **Hypertensive Crisis**: Higher than 180/120 mmHg\n\n**Risk Factors**\n- Age (risk increases with age)\n- Family history\n- Race (more common in African Americans)\n- Being overweight or obese\n- Physical inactivity\n- Tobacco use\n- Too much salt in diet\n- Too much alcohol\n- Stress\n- Certain chronic conditions\n\n**Complications**\n- Heart attack and stroke\n- Aneurysm\n- Heart failure\n- Kidney problems\n- Eye problems\n- Metabolic syndrome\n- Memory problems\n\n**Prevention and Management**\n- Maintain a healthy weight\n- Exercise regularly\n- Eat a healthy diet (DASH diet)\n- Reduce sodium intake\n- Limit alcohol\n- Don\'t smoke\n- Manage stress\n- Take medications as prescribed',
    type: 'article',
    category: 'hypertension',
    difficulty: 'beginner',
    duration: 12,
    targetAudience: ['adults', 'seniors', 'family-members'],
    tags: ['hypertension', 'blood-pressure', 'cardiovascular-health', 'prevention'],
    author: 'Dr. Michael Chen, Cardiologist',
    lastUpdated: '2024-01-18',
    source: 'American Heart Association',
    references: [
      'https://www.heart.org/en/health-topics/high-blood-pressure',
      'https://www.mayoclinic.org/diseases-conditions/high-blood-pressure',
      'https://www.cdc.gov/bloodpressure/about.htm'
    ],
    keyPoints: [
      'High blood pressure often has no symptoms',
      'Regular monitoring is essential for early detection',
      'Lifestyle changes can prevent and manage hypertension',
      'Medication may be necessary for some people',
      'Untreated hypertension can lead to serious complications'
    ],
    actionableSteps: [
      'Get your blood pressure checked regularly',
      'Maintain a healthy weight',
      'Follow the DASH diet (low sodium, high fruits/vegetables)',
      'Exercise for at least 150 minutes per week',
      'Limit alcohol and avoid tobacco'
    ],
    relatedContent: ['dash-diet', 'exercise-for-heart-health', 'stress-management'],
    mediaUrl: 'https://example.com/blood-pressure-video',
    thumbnailUrl: 'https://example.com/blood-pressure-thumbnail.jpg'
  },
  {
    id: 'metabolic-syndrome-explained',
    title: 'Metabolic Syndrome: The Cluster of Risk Factors',
    content: 'Metabolic syndrome is a cluster of conditions that occur together, increasing your risk of heart disease, stroke, and type 2 diabetes. Having metabolic syndrome means you have at least three of the following five conditions:\n\n**The Five Risk Factors**\n1. **Large waist circumference** (abdominal obesity)\n   - Men: 40 inches or more\n   - Women: 35 inches or more\n\n2. **High blood pressure**\n   - 130/85 mmHg or higher\n\n3. **High blood sugar**\n   - Fasting glucose 100 mg/dL or higher\n\n4. **High triglycerides**\n   - 150 mg/dL or higher\n\n5. **Low HDL cholesterol**\n   - Men: Less than 40 mg/dL\n   - Women: Less than 50 mg/dL\n\n**Why It Matters**\nMetabolic syndrome significantly increases your risk of:\n- Type 2 diabetes (5x higher risk)\n- Heart disease (2x higher risk)\n- Stroke (2x higher risk)\n- Fatty liver disease\n- Sleep apnea\n- Certain cancers\n\n**Causes and Risk Factors**\n- **Insulin resistance**: Your body doesn\'t respond well to insulin\n- **Obesity**: Especially abdominal fat\n- **Physical inactivity**\n- **Age**: Risk increases with age\n- **Family history**\n- **Race**: Higher risk in certain ethnic groups\n- **Hormonal changes** (menopause, PCOS)\n\n**Prevention and Treatment**\nThe good news is that metabolic syndrome can often be prevented and even reversed through lifestyle changes:\n\n**Lifestyle Interventions**\n- **Weight loss**: Even 5-10% weight loss can make a difference\n- **Regular exercise**: At least 150 minutes of moderate activity per week\n- **Healthy diet**: Focus on whole foods, limit processed foods\n- **Stress management**: Chronic stress worsens metabolic syndrome\n- **Adequate sleep**: 7-9 hours per night\n\n**Medical Management**\n- Blood pressure medications\n- Cholesterol-lowering drugs\n- Diabetes medications (if needed)\n- Regular monitoring and check-ups',
    type: 'article',
    category: 'general-health',
    difficulty: 'intermediate',
    duration: 20,
    targetAudience: ['adults', 'healthcare-providers', 'caregivers'],
    tags: ['metabolic-syndrome', 'risk-factors', 'prevention', 'lifestyle'],
    author: 'Dr. Lisa Rodriguez, Internal Medicine',
    lastUpdated: '2024-01-22',
    source: 'National Heart, Lung, and Blood Institute',
    references: [
      'https://www.nhlbi.nih.gov/health-topics/metabolic-syndrome',
      'https://www.mayoclinic.org/diseases-conditions/metabolic-syndrome',
      'https://www.heart.org/en/health-topics/metabolic-syndrome'
    ],
    keyPoints: [
      'Metabolic syndrome is a cluster of risk factors',
      'Having 3 out of 5 risk factors qualifies for diagnosis',
      'It significantly increases risk of diabetes and heart disease',
      'Lifestyle changes can prevent and reverse metabolic syndrome',
      'Early intervention is key to preventing complications'
    ],
    actionableSteps: [
      'Get your waist circumference measured',
      'Know your blood pressure, blood sugar, and cholesterol numbers',
      'Work with your doctor to develop a prevention plan',
      'Focus on gradual, sustainable lifestyle changes',
      'Monitor your progress regularly'
    ],
    relatedContent: ['insulin-resistance', 'heart-healthy-diet', 'exercise-for-metabolic-health'],
    mediaUrl: 'https://example.com/metabolic-syndrome-video',
    thumbnailUrl: 'https://example.com/metabolic-syndrome-thumbnail.jpg'
  }
];

export const getEducationContentById = (id: string): EducationContent | undefined => {
  return educationContent.find(content => content.id === id);
};

export const getEducationContentByCategory = (category: string): EducationContent[] => {
  return educationContent.filter(content => content.category === category);
};

export const getEducationContentByType = (type: string): EducationContent[] => {
  return educationContent.filter(content => content.type === type);
};

export const getEducationContentByDifficulty = (difficulty: string): EducationContent[] => {
  return educationContent.filter(content => content.difficulty === difficulty);
};

export const searchEducationContent = (query: string): EducationContent[] => {
  const lowercaseQuery = query.toLowerCase();
  return educationContent.filter(content => 
    content.title.toLowerCase().includes(lowercaseQuery) ||
    content.content.toLowerCase().includes(lowercaseQuery) ||
    content.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

