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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BloodSugarModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    value: string;
    mealTiming: string;
    time: Date;
    notes?: string;
  }) => void;
}

export default function BloodSugarModal({ visible, onClose, onSave }: BloodSugarModalProps) {
  const { isDarkMode, colors } = useTheme();
  const [value, setValue] = useState('');
  const [mealTiming, setMealTiming] = useState('fasting');
  const [time, setTime] = useState(new Date());
  const [notes, setNotes] = useState('');
  
  const slideAnim = new Animated.Value(SCREEN_HEIGHT);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  const mealOptions = [
    { value: 'fasting', label: 'Fasting', icon: 'moon' },
    { value: 'before-meal', label: 'Before Meal', icon: 'restaurant-outline' },
    { value: 'after-meal', label: 'After Meal', icon: 'restaurant' },
  ];

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
    if (!value.trim()) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSave({
      value: value.trim(),
      mealTiming,
      time,
      notes: notes.trim(),
    });
    
    // Reset form
    setValue('');
    setNotes('');
    setMealTiming('fasting');
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
              { backgroundColor: colors.surface },
              {
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <View style={styles.modalGradient}>
              {/* Header */}
              <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <View style={styles.headerLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="water" size={24} color="#E91E63" />
                  </View>
                  <Text style={[styles.title, { color: colors.text }]}>Log Blood Sugar</Text>
                </View>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={styles.content}>
                {/* Value Input */}
                <View style={styles.inputSection}>
                  <Text style={[styles.label, { color: colors.text }]}>Glucose Reading</Text>
                  <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? colors.surfaceSecondary : '#F9FAFB', borderColor: colors.border }]}>
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      value={value}
                      onChangeText={setValue}
                      placeholder="Enter reading"
                      keyboardType="numeric"
                      placeholderTextColor={colors.textTertiary}
                    />
                    <Text style={[styles.unit, { color: colors.textSecondary }]}>mg/dL</Text>
                  </View>
                  <Text style={[styles.reference, { color: colors.textSecondary }]}>Normal: 80-130 mg/dL fasting</Text>
                </View>

                {/* Meal Timing */}
                <View style={styles.inputSection}>
                  <Text style={[styles.label, { color: colors.text }]}>Meal Timing</Text>
                  <View style={styles.optionsContainer}>
                    {mealOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.optionButton,
                          { backgroundColor: isDarkMode ? colors.surfaceSecondary : '#F9FAFB', borderColor: colors.border },
                          mealTiming === option.value && styles.optionButtonActive
                        ]}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setMealTiming(option.value);
                        }}
                      >
                        <Ionicons 
                          name={option.icon as any} 
                          size={20} 
                          color={mealTiming === option.value ? '#FFFFFF' : '#E91E63'} 
                        />
                        <Text style={[
                          styles.optionText,
                          { color: mealTiming === option.value ? '#FFFFFF' : colors.text },
                          mealTiming === option.value && styles.optionTextActive
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Time */}
                <View style={styles.inputSection}>
                  <Text style={[styles.label, { color: colors.text }]}>Time</Text>
                  <TouchableOpacity style={[styles.timeButton, { backgroundColor: isDarkMode ? colors.surfaceSecondary : '#F9FAFB', borderColor: colors.border }]}>
                    <Ionicons name="time" size={20} color="#E91E63" />
                    <Text style={[styles.timeText, { color: colors.text }]}>{formatTime(time)}</Text>
                    <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Now</Text>
                  </TouchableOpacity>
                </View>

                {/* Notes */}
                <View style={styles.inputSection}>
                  <Text style={[styles.label, { color: colors.text }]}>Notes (Optional)</Text>
                  <TextInput
                    style={[styles.notesInput, { backgroundColor: isDarkMode ? colors.surfaceSecondary : '#F9FAFB', borderColor: colors.border, color: colors.text }]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Any additional notes..."
                    multiline
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>

              {/* Footer */}
              <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <TouchableOpacity 
                  style={[styles.cancelButton, { backgroundColor: isDarkMode ? colors.surfaceSecondary : '#F3F4F6' }]} 
                  onPress={handleClose}
                >
                  <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.saveButton,
                    !value.trim() && styles.saveButtonDisabled
                  ]} 
                  onPress={handleSave}
                  disabled={!value.trim()}
                >
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  <Text style={styles.saveText}>Save Reading</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  unit: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  reference: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E91E63',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  optionButtonActive: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E91E63',
    marginLeft: 6,
  },
  optionTextActive: {
    color: '#FFFFFF',
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
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 80,
    textAlignVertical: 'top',
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
    backgroundColor: '#E91E63',
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
