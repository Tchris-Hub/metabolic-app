import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  withFood?: boolean;
}

interface MedicationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    medications: { id: string; taken: boolean; time: Date }[];
    time: Date;
    notes?: string;
  }) => void;
}

export default function MedicationModal({ visible, onClose, onSave }: MedicationModalProps) {
  const [time, setTime] = useState(new Date());
  const [selectedMeds, setSelectedMeds] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');
  
  const slideAnim = new Animated.Value(SCREEN_HEIGHT);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  // Sample medications - in real app, get from user profile
  const medications: Medication[] = [
    {
      id: '1',
      name: 'Metformin',
      dosage: '500mg',
      frequency: '2x daily',
      withFood: true,
    },
    {
      id: '2',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: '1x daily',
      withFood: false,
    },
    {
      id: '3',
      name: 'Atorvastatin',
      dosage: '20mg',
      frequency: '1x daily',
      withFood: false,
    },
    {
      id: '4',
      name: 'Aspirin',
      dosage: '81mg',
      frequency: '1x daily',
      withFood: true,
    },
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
    if (selectedMeds.size === 0) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const medicationData = Array.from(selectedMeds).map(medId => ({
      id: medId,
      taken: true,
      time,
    }));
    
    onSave({
      medications: medicationData,
      time,
      notes: notes.trim(),
    });
    
    // Reset form
    setSelectedMeds(new Set());
    setNotes('');
    setTime(new Date());
    onClose();
  };

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const toggleMedication = (medId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newSelected = new Set(selectedMeds);
    if (newSelected.has(medId)) {
      newSelected.delete(medId);
    } else {
      newSelected.add(medId);
    }
    setSelectedMeds(newSelected);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStreakInfo = () => {
    // Mock streak data - in real app, calculate from actual data
    return {
      current: 7,
      best: 14,
    };
  };

  const streak = getStreakInfo();

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
              colors={['#FFF3E0', '#FFFFFF']}
              style={styles.modalGradient}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="medical" size={24} color="#FF9800" />
                  </View>
                  <Text style={styles.title}>Log Medications</Text>
                </View>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Streak Info */}
              <View style={styles.streakContainer}>
                <View style={styles.streakItem}>
                  <Text style={styles.streakNumber}>{streak.current}</Text>
                  <Text style={styles.streakLabel}>Day Streak</Text>
                </View>
                <View style={styles.streakDivider} />
                <View style={styles.streakItem}>
                  <Text style={styles.streakNumber}>{streak.best}</Text>
                  <Text style={styles.streakLabel}>Best Streak</Text>
                </View>
                <View style={styles.streakIcon}>
                  <Ionicons name="flame" size={24} color="#FF9800" />
                </View>
              </View>

              {/* Content */}
              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Medications List */}
                <View style={styles.inputSection}>
                  <Text style={styles.label}>Select Medications Taken</Text>
                  <View style={styles.medicationsContainer}>
                    {medications.map((med) => (
                      <TouchableOpacity
                        key={med.id}
                        style={[
                          styles.medicationCard,
                          selectedMeds.has(med.id) && styles.medicationCardSelected
                        ]}
                        onPress={() => toggleMedication(med.id)}
                      >
                        <View style={styles.medicationLeft}>
                          <View style={[
                            styles.checkbox,
                            selectedMeds.has(med.id) && styles.checkboxSelected
                          ]}>
                            {selectedMeds.has(med.id) && (
                              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                            )}
                          </View>
                          <View style={styles.medicationInfo}>
                            <Text style={styles.medicationName}>{med.name}</Text>
                            <Text style={styles.medicationDosage}>
                              {med.dosage} • {med.frequency}
                            </Text>
                            {med.withFood && (
                              <View style={styles.foodBadge}>
                                <Ionicons name="restaurant" size={12} color="#FF9800" />
                                <Text style={styles.foodText}>Take with food</Text>
                              </View>
                            )}
                          </View>
                        </View>
                        
                        <View style={styles.medicationRight}>
                          <Ionicons 
                            name="medical" 
                            size={20} 
                            color={selectedMeds.has(med.id) ? '#FF9800' : '#D1D5DB'} 
                          />
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Time */}
                <View style={styles.inputSection}>
                  <Text style={styles.label}>Time Taken</Text>
                  <TouchableOpacity style={styles.timeButton}>
                    <Ionicons name="time" size={20} color="#FF9800" />
                    <Text style={styles.timeText}>{formatTime(time)}</Text>
                    <Text style={styles.timeLabel}>Now</Text>
                  </TouchableOpacity>
                </View>

                {/* Side Effects Quick Log */}
                <View style={styles.inputSection}>
                  <Text style={styles.label}>How do you feel?</Text>
                  <View style={styles.feelingsContainer}>
                    {[
                      { emoji: '😊', label: 'Great', value: 'great' },
                      { emoji: '😐', label: 'Okay', value: 'okay' },
                      { emoji: '😷', label: 'Unwell', value: 'unwell' },
                    ].map((feeling) => (
                      <TouchableOpacity
                        key={feeling.value}
                        style={styles.feelingButton}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                      >
                        <Text style={styles.feelingEmoji}>{feeling.emoji}</Text>
                        <Text style={styles.feelingLabel}>{feeling.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Reminder for next dose */}
                {selectedMeds.size > 0 && (
                  <View style={styles.reminderSection}>
                    <View style={styles.reminderHeader}>
                      <Ionicons name="alarm" size={20} color="#FF9800" />
                      <Text style={styles.reminderTitle}>Next Reminder</Text>
                    </View>
                    <Text style={styles.reminderText}>
                      We'll remind you about your next dose based on your medication schedule.
                    </Text>
                  </View>
                )}
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
                    selectedMeds.size === 0 && styles.saveButtonDisabled
                  ]} 
                  onPress={handleSave}
                  disabled={selectedMeds.size === 0}
                >
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  <Text style={styles.saveText}>
                    Log {selectedMeds.size} Medication{selectedMeds.size !== 1 ? 's' : ''}
                  </Text>
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
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
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
  streakContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  streakItem: {
    flex: 1,
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  streakLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  streakDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 152, 0, 0.3)',
    marginHorizontal: 16,
  },
  streakIcon: {
    marginLeft: 16,
  },
  content: {
    maxHeight: SCREEN_HEIGHT * 0.5,
    marginBottom: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  medicationsContainer: {
    gap: 12,
  },
  medicationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  medicationCardSelected: {
    borderColor: '#FF9800',
    backgroundColor: 'rgba(255, 152, 0, 0.05)',
  },
  medicationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  medicationDosage: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  foodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  foodText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 4,
  },
  medicationRight: {
    marginLeft: 12,
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
  feelingsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  feelingButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    alignItems: 'center',
  },
  feelingEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  feelingLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  reminderSection: {
    backgroundColor: 'rgba(255, 152, 0, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 152, 0, 0.1)',
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
    marginLeft: 8,
  },
  reminderText: {
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
    backgroundColor: '#FF9800',
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
