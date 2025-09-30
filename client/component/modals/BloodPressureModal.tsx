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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BloodPressureModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    systolic: string;
    diastolic: string;
    pulse?: string;
    time: Date;
    position: string;
  }) => void;
}

export default function BloodPressureModal({ visible, onClose, onSave }: BloodPressureModalProps) {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [time, setTime] = useState(new Date());
  const [position, setPosition] = useState('sitting');
  
  const slideAnim = new Animated.Value(SCREEN_HEIGHT);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  const positionOptions = [
    { value: 'sitting', label: 'Sitting', icon: 'person' },
    { value: 'standing', label: 'Standing', icon: 'walk' },
    { value: 'lying', label: 'Lying', icon: 'bed' },
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
    if (!systolic.trim() || !diastolic.trim()) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSave({
      systolic: systolic.trim(),
      diastolic: diastolic.trim(),
      pulse: pulse.trim(),
      time,
      position,
    });
    
    // Reset form
    setSystolic('');
    setDiastolic('');
    setPulse('');
    setPosition('sitting');
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

  const getBPCategory = () => {
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    
    if (!sys || !dia) return null;
    
    if (sys < 120 && dia < 80) return { text: 'Normal', color: '#4CAF50' };
    if (sys < 130 && dia < 80) return { text: 'Elevated', color: '#FFC107' };
    if (sys < 140 || dia < 90) return { text: 'High Stage 1', color: '#FF9800' };
    return { text: 'High Stage 2', color: '#F44336' };
  };

  const category = getBPCategory();

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
              colors={['#E3F2FD', '#FFFFFF']}
              style={styles.modalGradient}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="heart" size={24} color="#2196F3" />
                  </View>
                  <Text style={styles.title}>Log Blood Pressure</Text>
                </View>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={styles.content}>
                {/* BP Input */}
                <View style={styles.inputSection}>
                  <Text style={styles.label}>Blood Pressure Reading</Text>
                  <View style={styles.bpContainer}>
                    <View style={styles.bpInputContainer}>
                      <TextInput
                        style={styles.bpInput}
                        value={systolic}
                        onChangeText={setSystolic}
                        placeholder="120"
                        keyboardType="numeric"
                        placeholderTextColor="#9CA3AF"
                      />
                      <Text style={styles.bpLabel}>Systolic</Text>
                    </View>
                    
                    <Text style={styles.bpSeparator}>/</Text>
                    
                    <View style={styles.bpInputContainer}>
                      <TextInput
                        style={styles.bpInput}
                        value={diastolic}
                        onChangeText={setDiastolic}
                        placeholder="80"
                        keyboardType="numeric"
                        placeholderTextColor="#9CA3AF"
                      />
                      <Text style={styles.bpLabel}>Diastolic</Text>
                    </View>
                    
                    <Text style={styles.unit}>mmHg</Text>
                  </View>
                  
                  {category && (
                    <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
                      <Text style={styles.categoryText}>{category.text}</Text>
                    </View>
                  )}
                  
                  <Text style={styles.reference}>Normal: &lt;120/&lt;80 mmHg</Text>
                </View>

                {/* Pulse Input */}
                <View style={styles.inputSection}>
                  <Text style={styles.label}>Pulse Rate (Optional)</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={pulse}
                      onChangeText={setPulse}
                      placeholder="Enter pulse rate"
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                    <Text style={styles.unit}>bpm</Text>
                  </View>
                </View>

                {/* Position */}
                <View style={styles.inputSection}>
                  <Text style={styles.label}>Position</Text>
                  <View style={styles.optionsContainer}>
                    {positionOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.optionButton,
                          position === option.value && styles.optionButtonActive
                        ]}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setPosition(option.value);
                        }}
                      >
                        <Ionicons 
                          name={option.icon as any} 
                          size={20} 
                          color={position === option.value ? '#FFFFFF' : '#2196F3'} 
                        />
                        <Text style={[
                          styles.optionText,
                          position === option.value && styles.optionTextActive
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Time */}
                <View style={styles.inputSection}>
                  <Text style={styles.label}>Time</Text>
                  <TouchableOpacity style={styles.timeButton}>
                    <Ionicons name="time" size={20} color="#2196F3" />
                    <Text style={styles.timeText}>{formatTime(time)}</Text>
                    <Text style={styles.timeLabel}>Now</Text>
                  </TouchableOpacity>
                </View>
              </View>

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
                    (!systolic.trim() || !diastolic.trim()) && styles.saveButtonDisabled
                  ]} 
                  onPress={handleSave}
                  disabled={!systolic.trim() || !diastolic.trim()}
                >
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  <Text style={styles.saveText}>Save Reading</Text>
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
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
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
  bpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bpInputContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bpInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    minWidth: 60,
  },
  bpLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  bpSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B7280',
    marginHorizontal: 8,
  },
  unit: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  reference: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
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
    borderColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  optionButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
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
    backgroundColor: '#2196F3',
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
