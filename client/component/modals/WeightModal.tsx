import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WeightModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    weight: string;
    unit: 'kg' | 'lbs';
    time: Date;
    bodyFat?: string;
    waist?: string;
  }) => void;
}

export default function WeightModal({ visible, onClose, onSave }: WeightModalProps) {
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('lbs');
  const [time, setTime] = useState(new Date());
  const [bodyFat, setBodyFat] = useState('');
  const [waist, setWaist] = useState('');
  
  const slideAnim = new Animated.Value(SCREEN_HEIGHT);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSave = async () => {
    if (!weight.trim()) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSave({
      weight: weight.trim(),
      unit,
      time,
      bodyFat: bodyFat.trim(),
      waist: waist.trim(),
    });
    
    // Reset form
    setWeight('');
    setBodyFat('');
    setWaist('');
    setTime(new Date());
    onClose();
  };

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    if (!weightNum) return null;
    
    // Assuming average height for demo - in real app, get from user profile
    const heightM = 1.75; // 5'9" in meters
    let weightKg = weightNum;
    
    if (unit === 'lbs') {
      weightKg = weightNum * 0.453592;
    }
    
    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: '#2196F3' };
    if (bmi < 25) return { text: 'Normal', color: '#4CAF50' };
    if (bmi < 30) return { text: 'Overweight', color: '#FF9800' };
    return { text: 'Obese', color: '#F44336' };
  };

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  const toggleUnit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (weight) {
      const weightNum = parseFloat(weight);
      if (unit === 'kg') {
        // Convert kg to lbs
        setWeight((weightNum * 2.20462).toFixed(1));
        setUnit('lbs');
      } else {
        // Convert lbs to kg
        setWeight((weightNum * 0.453592).toFixed(1));
        setUnit('kg');
      }
    } else {
      setUnit(unit === 'kg' ? 'lbs' : 'kg');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={styles.overlayTouch} 
          activeOpacity={1} 
          onPress={handleClose}
        />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <LinearGradient
              colors={['#E8F5E8', '#FFFFFF']}
              style={styles.modalGradient}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name="monitor-weight" size={24} color="#4CAF50" />
                  </View>
                  <Text style={styles.title}>Log Weight</Text>
                </View>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                {/* Weight Input */}
                <View style={styles.inputSection}>
                  <Text style={styles.label}>Weight</Text>
                  <View style={styles.weightContainer}>
                    <TextInput
                      style={styles.weightInput}
                      value={weight}
                      onChangeText={setWeight}
                      placeholder="Enter weight"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity 
                      style={styles.unitToggle}
                      onPress={toggleUnit}
                    >
                      <Text style={styles.unitText}>{unit}</Text>
                      <Ionicons name="swap-horizontal" size={16} color="#4CAF50" />
                    </TouchableOpacity>
                  </View>
                  
                  {bmi && bmiCategory && (
                    <View style={styles.bmiContainer}>
                      <Text style={styles.bmiText}>BMI: {bmi}</Text>
                      <View style={[styles.bmiCategoryBadge, { backgroundColor: bmiCategory.color }]}>
                        <Text style={styles.bmiCategoryText}>{bmiCategory.text}</Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Optional Measurements */}
                <View style={styles.inputSection}>
                  <Text style={styles.label}>Body Fat % (Optional)</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={bodyFat}
                      onChangeText={setBodyFat}
                      placeholder="Enter body fat percentage"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#9CA3AF"
                    />
                    <Text style={styles.unit}>%</Text>
                  </View>
                </View>

                <View style={styles.inputSection}>
                  <Text style={styles.label}>Waist Measurement (Optional)</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={waist}
                      onChangeText={setWaist}
                      placeholder="Enter waist measurement"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#9CA3AF"
                    />
                    <Text style={styles.unit}>{unit === 'kg' ? 'cm' : 'in'}</Text>
                  </View>
                </View>

                {/* Time */}
                <View style={styles.inputSection}>
                  <Text style={styles.label}>Time</Text>
                  <TouchableOpacity style={styles.timeButton}>
                    <Ionicons name="time" size={20} color="#4CAF50" />
                    <Text style={styles.timeText}>{formatTime(time)}</Text>
                    <Text style={styles.timeLabel}>Now</Text>
                  </TouchableOpacity>
                </View>

                {/* Progress Indicator */}
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Ionicons name="trending-up" size={20} color="#4CAF50" />
                    <Text style={styles.progressTitle}>Progress Tracking</Text>
                  </View>
                  <Text style={styles.progressText}>
                    Keep logging daily to see your weight trends and progress toward your goals!
                  </Text>
                </View>
              </ScrollView>

              {/* Footer */}
              <View style={styles.footer}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={handleClose}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.saveButton,
                    !weight.trim() && styles.saveButtonDisabled
                  ]} 
                  onPress={handleSave}
                  disabled={!weight.trim()}
                >
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  <Text style={styles.saveText}>Save Weight</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouch: {
    flex: 1,
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: SCREEN_HEIGHT * 0.9,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    marginBottom: 24,
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  weightInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  bmiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  bmiText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  bmiCategoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bmiCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  unit: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressSection: {
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.1)',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
