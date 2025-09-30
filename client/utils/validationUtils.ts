export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name.trim());
};

export const validateDateOfBirth = (dateString: string): { isValid: boolean; age?: number; error?: string } => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    const actualAge = age - 1;
    if (actualAge < 0) {
      return { isValid: false, error: 'Date of birth cannot be in the future' };
    }
    if (actualAge > 120) {
      return { isValid: false, error: 'Please enter a valid date of birth' };
    }
    return { isValid: true, age: actualAge };
  }
  
  if (age > 120) {
    return { isValid: false, error: 'Please enter a valid date of birth' };
  }
  
  return { isValid: true, age };
};

export const validateBloodSugar = (value: number, unit: 'mg/dL' | 'mmol/L'): { isValid: boolean; error?: string } => {
  if (unit === 'mg/dL') {
    if (value < 20 || value > 600) {
      return { isValid: false, error: 'Blood sugar value must be between 20-600 mg/dL' };
    }
  } else {
    if (value < 1.1 || value > 33.3) {
      return { isValid: false, error: 'Blood sugar value must be between 1.1-33.3 mmol/L' };
    }
  }
  
  return { isValid: true };
};

export const validateBloodPressure = (systolic: number, diastolic: number): { isValid: boolean; error?: string } => {
  if (systolic < 50 || systolic > 250) {
    return { isValid: false, error: 'Systolic pressure must be between 50-250 mmHg' };
  }
  
  if (diastolic < 30 || diastolic > 150) {
    return { isValid: false, error: 'Diastolic pressure must be between 30-150 mmHg' };
  }
  
  if (systolic <= diastolic) {
    return { isValid: false, error: 'Systolic pressure must be higher than diastolic pressure' };
  }
  
  return { isValid: true };
};

export const validateWeight = (weight: number, unit: 'kg' | 'lbs'): { isValid: boolean; error?: string } => {
  if (unit === 'kg') {
    if (weight < 20 || weight > 300) {
      return { isValid: false, error: 'Weight must be between 20-300 kg' };
    }
  } else {
    if (weight < 44 || weight > 660) {
      return { isValid: false, error: 'Weight must be between 44-660 lbs' };
    }
  }
  
  return { isValid: true };
};

export const validateHeight = (height: number, unit: 'cm' | 'ft'): { isValid: boolean; error?: string } => {
  if (unit === 'cm') {
    if (height < 100 || height > 250) {
      return { isValid: false, error: 'Height must be between 100-250 cm' };
    }
  } else {
    if (height < 3.3 || height > 8.2) {
      return { isValid: false, error: 'Height must be between 3.3-8.2 ft' };
    }
  }
  
  return { isValid: true };
};

export const validateHeartRate = (heartRate: number): { isValid: boolean; error?: string } => {
  if (heartRate < 30 || heartRate > 220) {
    return { isValid: false, error: 'Heart rate must be between 30-220 bpm' };
  }
  
  return { isValid: true };
};

export const validateSteps = (steps: number): { isValid: boolean; error?: string } => {
  if (steps < 0 || steps > 100000) {
    return { isValid: false, error: 'Steps must be between 0-100,000' };
  }
  
  return { isValid: true };
};

export const validateCalories = (calories: number): { isValid: boolean; error?: string } => {
  if (calories < 0 || calories > 10000) {
    return { isValid: false, error: 'Calories must be between 0-10,000' };
  }
  
  return { isValid: true };
};

export const validateDistance = (distance: number, unit: 'km' | 'miles'): { isValid: boolean; error?: string } => {
  if (unit === 'km') {
    if (distance < 0 || distance > 1000) {
      return { isValid: false, error: 'Distance must be between 0-1000 km' };
    }
  } else {
    if (distance < 0 || distance > 621) {
      return { isValid: false, error: 'Distance must be between 0-621 miles' };
    }
  }
  
  return { isValid: true };
};

export const validateWaterIntake = (water: number, unit: 'ml' | 'oz'): { isValid: boolean; error?: string } => {
  if (unit === 'ml') {
    if (water < 0 || water > 10000) {
      return { isValid: false, error: 'Water intake must be between 0-10,000 ml' };
    }
  } else {
    if (water < 0 || water > 338) {
      return { isValid: false, error: 'Water intake must be between 0-338 oz' };
    }
  }
  
  return { isValid: true };
};

export const validateSleep = (hours: number): { isValid: boolean; error?: string } => {
  if (hours < 0 || hours > 24) {
    return { isValid: false, error: 'Sleep hours must be between 0-24' };
  }
  
  return { isValid: true };
};

export const validateMedicationDose = (dose: number): { isValid: boolean; error?: string } => {
  if (dose < 0 || dose > 1000) {
    return { isValid: false, error: 'Medication dose must be between 0-1000' };
  }
  
  return { isValid: true };
};

export const validateRequired = (value: any, fieldName: string): { isValid: boolean; error?: string } => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true };
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): { isValid: boolean; error?: string } => {
  if (value.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters long` };
  }
  
  return { isValid: true };
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): { isValid: boolean; error?: string } => {
  if (value.length > maxLength) {
    return { isValid: false, error: `${fieldName} must be no more than ${maxLength} characters long` };
  }
  
  return { isValid: true };
};

export const validateRange = (value: number, min: number, max: number, fieldName: string): { isValid: boolean; error?: string } => {
  if (value < min || value > max) {
    return { isValid: false, error: `${fieldName} must be between ${min} and ${max}` };
  }
  
  return { isValid: true };
};

export const validateUrl = (url: string): boolean => {
  const urlRegex = /^https?:\/\/.+\..+/;
  return urlRegex.test(url);
};

export const validateImageUrl = (url: string): boolean => {
  const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
  return validateUrl(url) && imageRegex.test(url);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateForm = (formData: { [key: string]: any }, validationRules: { [key: string]: (value: any) => { isValid: boolean; error?: string } }): { isValid: boolean; errors: { [key: string]: string } } => {
  const errors: { [key: string]: string } = {};
  
  for (const [field, validator] of Object.entries(validationRules)) {
    const result = validator(formData[field]);
    if (!result.isValid && result.error) {
      errors[field] = result.error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

