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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PrescriptionFormData {
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  withFood: boolean;
  instructions?: string;
  prescriber?: string;
  refillReminder: boolean;
  pillsRemaining?: number;
}

interface AddPrescriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: PrescriptionFormData, id?: string) => void;
  editData?: (PrescriptionFormData & { id: string }) | null;
}

export default function AddPrescriptionModal({ visible, onClose, onSave, editData }: AddPrescriptionModalProps) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('1x daily');
  const [times, setTimes] = useState<string[]>(['08:00']);
  const [withFood, setWithFood] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [prescriber, setPrescriber] = useState('');
  const [refillReminder, setRefillReminder] = useState(false);
  const [pillsRemaining, setPillsRemaining] = useState('');
  
  const slideAnim = new Animated.Value(SCREEN_HEIGHT);
  const fadeAnim = new Animated.Value(0);

  const frequencyOptions = [
    { value: '1x daily', label: 'Once daily', times: 1 },
    { value: '2x daily', label: 'Twice daily', times: 2 },
    { value: '3x daily', label: '3 times daily', times: 3 },
    { value: '4x daily', label: '4 times daily', times: 4 },
    { value: 'As needed', label: 'As needed', times: 0 },
  ];

  useEffect(() => {
    if (editData) {
      setName(editData.name || '');
      setDosage(editData.dosage || '');
      setFrequency(editData.frequency || '1x daily');
      setTimes(editData.times?.length ? editData.times : ['08:00']);
      setWithFood(!!editData.withFood);
      setInstructions(editData.instructions || '');
      setPrescriber(editData.prescriber || '');
      setRefillReminder(!!editData.refillReminder);
      setPillsRemaining(
        typeof editData.pillsRemaining === 'number' ? editData.pillsRemaining.toString() : ''
      );
    } else {
      resetForm();
    }
  }, [editData]);

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
    if (!name.trim() || !dosage.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const payload: PrescriptionFormData = {
      name: name.trim(),
      dosage: dosage.trim(),
      frequency,
      times,
      withFood,
      instructions: instructions.trim(),
      prescriber: prescriber.trim(),
      refillReminder,
      pillsRemaining: pillsRemaining ? parseInt(pillsRemaining, 10) : undefined,
    };

    onSave(payload, editData?.id);
    
    // Reset form
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setDosage('');
    setFrequency('1x daily');
    setTimes(['08:00']);
    setWithFood(false);
    setInstructions('');
    setPrescriber('');
    setRefillReminder(false);
    setPillsRemaining('');
  };

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetForm();
    onClose();
  };

  const handleFrequencyChange = (freq: string) => {
    setFrequency(freq);
    const option = frequencyOptions.find(o => o.value === freq);
    if (option && option.times > 0) {
      // Set default times based on frequency
      const defaultTimes = [];
      for (let i = 0; i < option.times; i++) {
        const hour = 8 + (i * Math.floor(12 / option.times));
        defaultTimes.push(`${hour.toString().padStart(2, '0')}:00`);
      }
      setTimes(defaultTimes);
    } else {
      setTimes([]);
    }
  };

  const updateTime = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
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
              { transform: [{ translateY: slideAnim }] }
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
                  <Text style={styles.title}>
                    {editData ? 'Edit Prescription' : 'Add Prescription'}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Medication Name */}
                <View style={styles.inputSection}>
                  <Text style={styles.label}>Medication Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g., Metformin"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                {/* Dosage */}
                <View style={styles.inputSection}>
                  <Text style={styles.label}>Dosage *</Text>
                  <TextInput
                    style={styles.input}
                    value={dosage}
                    onChangeText={setDosage}
                    placeholder="e.g., 500mg"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                {/* Frequency */}
                <View style={styles.inputSection}>
                  <Text style={styles.label}>Frequency</Text>
                  <View style={styles.frequencyContainer}>
                    {frequencyOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.frequencyButton,
                          frequency === option.value && styles.frequencyButtonActive
                        ]}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          handleFrequencyChange(option.value);
                        }}
                      >
                        <Text style={[
                          styles.frequencyText,
                          frequency === option.value && styles.frequencyTextActive
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Reminder Times */}
                {times.length > 0 && (
                  <View style={styles.inputSection}>
                    <Text style={styles.label}>Reminder Times</Text>
                    {times.map((time, index) => (
                      <View key={index} style={styles.timeRow}>
                        <Ionicons name="alarm-outline" size={20} color="#FF9800" />
                        <TextInput
                          style={styles.timeInput}
                          value={time}
                          onChangeText={(val) => updateTime(index, val)}
                          placeholder="HH:MM"
                          placeholderTextColor="#9CA3AF"
                        />
                      </View>
                    ))}
                  </View>
                )}

                {/* With Food Toggle */}
                <View style={styles.switchRow}>
                  <View style={styles.switchLeft}>
                    <Ionicons name="restaurant" size={20} color="#FF9800" />
                    <Text style={styles.switchLabel}>Take with food</Text>
                  </View>
                  <Switch
                    value={withFood}
                    onValueChange={(val) => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setWithFood(val);
                    }}
                    trackColor={{ false: '#D1D5DB', true: '#FFC107' }}
                    thumbColor={withFood ? '#FF9800' : '#F3F4F6'}
                  />
                </View>

                {/* Instructions */}
                <View style={styles.inputSection}>
                  <Text style={styles.label}>Instructions (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={instructions}
                    onChangeText={setInstructions}
                    placeholder="e.g., Take in the morning, avoid alcohol"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {/* Prescriber */}
                <View style={styles.inputSection}>
                  <Text style={styles.label}>Prescribed By (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    value={prescriber}
                    onChangeText={setPrescriber}
                    placeholder="e.g., Dr. Smith"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                {/* Refill Reminder */}
                <View style={styles.switchRow}>
                  <View style={styles.switchLeft}>
                    <Ionicons name="notifications-outline" size={20} color="#FF9800" />
                    <Text style={styles.switchLabel}>Refill reminder</Text>
                  </View>
                  <Switch
                    value={refillReminder}
                    onValueChange={(val) => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setRefillReminder(val);
                    }}
                    trackColor={{ false: '#D1D5DB', true: '#FFC107' }}
                    thumbColor={refillReminder ? '#FF9800' : '#F3F4F6'}
                  />
                </View>

                {/* Pills Remaining */}
                {refillReminder && (
                  <View style={styles.inputSection}>
                    <Text style={styles.label}>Pills Remaining</Text>
                    <TextInput
                      style={styles.input}
                      value={pillsRemaining}
                      onChangeText={setPillsRemaining}
                      placeholder="e.g., 30"
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
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
                    (!name.trim() || !dosage.trim()) && styles.saveButtonDisabled
                  ]} 
                  onPress={handleSave}
                  disabled={!name.trim() || !dosage.trim()}
                >
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  <Text style={styles.saveText}>
                    {editData ? 'Update' : 'Add Prescription'}
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
    maxHeight: SCREEN_HEIGHT * 0.95,
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
  content: {
    maxHeight: SCREEN_HEIGHT * 0.6,
    marginBottom: 24,
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  frequencyButtonActive: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  frequencyTextActive: {
    color: '#FFFFFF',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  timeInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  switchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 12,
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
