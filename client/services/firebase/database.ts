import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from './config';

export interface HealthReading {
  id?: string;
  userId: string;
  type: 'bloodSugar' | 'bloodPressure' | 'weight' | 'activity';
  value: number;
  unit: string;
  timestamp: Date;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface UserProfile {
  id?: string;
  userId: string;
  displayName: string;
  email: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  country: string;
  healthConditions: string[];
  medications: string[];
  goals: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MealPlan {
  id?: string;
  userId: string;
  name: string;
  description: string;
  meals: Meal[];
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
}

export class DatabaseService {
  // Health Readings
  static async saveHealthReading(reading: HealthReading): Promise<string> {
    try {
      const docRef = doc(collection(db, 'healthReadings'));
      await setDoc(docRef, {
        ...reading,
        timestamp: Timestamp.fromDate(reading.timestamp),
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to save health reading: ${error}`);
    }
  }

  static async getHealthReadings(
    userId: string, 
    type?: string, 
    limitCount?: number
  ): Promise<HealthReading[]> {
    try {
      let q = query(
        collection(db, 'healthReadings'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );

      if (type) {
        q = query(q, where('type', '==', type));
      }

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as HealthReading[];
    } catch (error) {
      throw new Error(`Failed to get health readings: ${error}`);
    }
  }

  static async updateHealthReading(id: string, data: Partial<HealthReading>): Promise<void> {
    try {
      const docRef = doc(db, 'healthReadings', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      throw new Error(`Failed to update health reading: ${error}`);
    }
  }

  static async deleteHealthReading(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'healthReadings', id));
    } catch (error) {
      throw new Error(`Failed to delete health reading: ${error}`);
    }
  }

  // User Profile
  static async saveUserProfile(profile: UserProfile): Promise<string> {
    try {
      const docRef = doc(collection(db, 'userProfiles'));
      await setDoc(docRef, {
        ...profile,
        dateOfBirth: Timestamp.fromDate(profile.dateOfBirth),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to save user profile: ${error}`);
    }
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const q = query(
        collection(db, 'userProfiles'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dateOfBirth: data.dateOfBirth.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as UserProfile;
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error}`);
    }
  }

  static async updateUserProfile(id: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, 'userProfiles', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      throw new Error(`Failed to update user profile: ${error}`);
    }
  }

  // Meal Plans
  static async saveMealPlan(mealPlan: MealPlan): Promise<string> {
    try {
      const docRef = doc(collection(db, 'mealPlans'));
      await setDoc(docRef, {
        ...mealPlan,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to save meal plan: ${error}`);
    }
  }

  static async getMealPlans(userId: string): Promise<MealPlan[]> {
    try {
      const q = query(
        collection(db, 'mealPlans'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as MealPlan[];
    } catch (error) {
      throw new Error(`Failed to get meal plans: ${error}`);
    }
  }

  static async updateMealPlan(id: string, data: Partial<MealPlan>): Promise<void> {
    try {
      const docRef = doc(db, 'mealPlans', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      throw new Error(`Failed to update meal plan: ${error}`);
    }
  }

  static async deleteMealPlan(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'mealPlans', id));
    } catch (error) {
      throw new Error(`Failed to delete meal plan: ${error}`);
    }
  }

  // Generic methods
  static async getDocument(collectionName: string, docId: string): Promise<DocumentData | null> {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to get document: ${error}`);
    }
  }

  static async saveDocument(collectionName: string, data: any): Promise<string> {
    try {
      const docRef = doc(collection(db, collectionName));
      await setDoc(docRef, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to save document: ${error}`);
    }
  }

  static async updateDocument(collectionName: string, docId: string, data: any): Promise<void> {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      throw new Error(`Failed to update document: ${error}`);
    }
  }

  static async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, collectionName, docId));
    } catch (error) {
      throw new Error(`Failed to delete document: ${error}`);
    }
  }
}

