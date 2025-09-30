import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification, 
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential 
} from 'firebase/auth';
import { auth } from './config';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  photoURL: string | null;
}

export interface SignupData {
  email: string;
  password: string;
  displayName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ProfileData {
  displayName?: string;
  photoURL?: string;
}

export class AuthService {
  static async signup(data: SignupData): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      if (data.displayName) {
        await updateProfile(userCredential.user, {
          displayName: data.displayName,
        });
      }
      
      return userCredential;
    } catch (error) {
      throw new Error(`Signup failed: ${error}`);
    }
  }

  static async login(data: LoginData): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      throw new Error(`Login failed: ${error}`);
    }
  }

  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(`Logout failed: ${error}`);
    }
  }

  static async sendVerificationEmail(): Promise<void> {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      } else {
        throw new Error('No user is currently signed in');
      }
    } catch (error) {
      throw new Error(`Failed to send verification email: ${error}`);
    }
  }

  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(`Failed to send password reset email: ${error}`);
    }
  }

  static async updateUserProfile(data: ProfileData): Promise<void> {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, data);
      } else {
        throw new Error('No user is currently signed in');
      }
    } catch (error) {
      throw new Error(`Failed to update profile: ${error}`);
    }
  }

  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  static getUserData(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
    };
  }

  static isEmailVerified(): boolean {
    return auth.currentUser?.emailVerified || false;
  }

  static getUserId(): string | null {
    return auth.currentUser?.uid || null;
  }
}

