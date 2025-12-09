import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
    const { isDarkMode, toggleTheme, colors, gradients } = useTheme();
    const insets = useSafeAreaInsets();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const handleToggleDarkMode = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        toggleTheme();
    };

    const settingsCategories = [
        {
            id: 'preferences',
            title: 'App Preferences',
            icon: 'settings-outline',
            color: '#2196F3',
            route: '/more/preferences',
        },
        {
            id: 'notifications',
            title: 'Notifications',
            icon: 'notifications-outline',
            color: '#FF9800',
            route: '/more/notifications',
        },
        {
            id: 'privacy',
            title: 'Privacy & Security',
            icon: 'shield-checkmark-outline',
            color: '#4CAF50',
            route: '/more/privacy',
        },
        {
            id: 'data',
            title: 'Data & Reports',
            icon: 'document-text-outline',
            color: '#9C27B0',
            route: '/more/data',
        },
        {
            id: 'help',
            title: 'Help & Support',
            icon: 'help-circle-outline',
            color: '#E91E63',
            route: '/more/help',
        },
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Hero Header */}
                <LinearGradient
                    colors={gradients.more as [string, string, ...string[]]}
                    style={[styles.heroSection, { paddingTop: insets.top + 16 }]}
                >
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.heroTitle}>Settings</Text>
                        <Text style={styles.heroSubtitle}>Customize your experience</Text>
                    </Animated.View>
                </LinearGradient>

                {/* Dark Mode Toggle */}
                <View style={[styles.darkModeSection, isDarkMode && styles.darkModeSectionDark]}>
                    <View style={[styles.darkModeCard, isDarkMode && styles.darkModeCardDark]}>
                        <View style={styles.darkModeInfo}>
                            <View style={[styles.darkModeIcon, isDarkMode && styles.darkModeIconDark]}>
                                <Ionicons name={isDarkMode ? 'moon' : 'sunny'} size={24} color={isDarkMode ? '#FFD700' : '#FF9800'} />
                            </View>
                            <View style={styles.darkModeText}>
                                <Text style={[styles.darkModeTitle, isDarkMode && styles.darkModeTitleDark]}>Dark Mode</Text>
                                <Text style={[styles.darkModeSubtitle, isDarkMode && styles.darkModeSubtitleDark]}>
                                    {isDarkMode ? 'Dark theme enabled' : 'Switch to dark theme'}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={handleToggleDarkMode}
                            trackColor={{ false: '#D1D5DB', true: '#667eea' }}
                            thumbColor={isDarkMode ? '#FFFFFF' : '#F3F4F6'}
                        />
                    </View>
                </View>

                {/* Settings Categories */}
                <View style={[styles.settingsSection, isDarkMode && styles.settingsSectionDark]}>
                    <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Settings</Text>
                    {settingsCategories.map((category, index) => (
                        <Animated.View
                            key={category.id}
                            style={{
                                opacity: fadeAnim,
                                transform: [
                                    {
                                        translateY: slideAnim.interpolate({
                                            inputRange: [0, 30],
                                            outputRange: [0, 30 + index * 10],
                                        }),
                                    },
                                ],
                            }}
                        >
                            <TouchableOpacity
                                style={[styles.settingItem, isDarkMode && styles.settingItemDark]}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    router.push(category.route as any);
                                }}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.settingIcon, { backgroundColor: `${category.color}20` }]}>
                                    <Ionicons name={category.icon as any} size={24} color={category.color} />
                                </View>
                                <Text style={[styles.settingTitle, isDarkMode && styles.settingTitleDark]}>{category.title}</Text>
                                <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#9CA3AF' : '#9CA3AF'} />
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                {/* About Section */}
                <View style={styles.aboutSection}>
                    <Text style={[styles.aboutText, isDarkMode && styles.aboutTextDark]}>Health Tracker v1.0.0</Text>
                    <TouchableOpacity onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push('/more/privacy' as any);
                    }}>
                        <Text style={[styles.aboutLink, isDarkMode && styles.aboutLinkDark]}>Terms & Privacy</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    heroSection: {
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    darkModeSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    darkModeSectionDark: {},
    darkModeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    darkModeCardDark: {
        backgroundColor: '#1F2937',
        borderWidth: 1,
        borderColor: '#374151',
    },
    darkModeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    darkModeIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF3E0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    darkModeIconDark: {
        backgroundColor: '#374151',
    },
    darkModeText: {
        flex: 1,
    },
    darkModeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 2,
    },
    darkModeTitleDark: {
        color: '#F9FAFB',
    },
    darkModeSubtitle: {
        fontSize: 13,
        color: '#6B7280',
    },
    darkModeSubtitleDark: {
        color: '#9CA3AF',
    },
    settingsSection: {
        marginHorizontal: 20,
        marginBottom: 24,
    },
    settingsSectionDark: {},
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    sectionTitleDark: {
        color: '#F9FAFB',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    settingItemDark: {
        backgroundColor: '#1F2937',
        borderWidth: 1,
        borderColor: '#374151',
    },
    settingIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    settingTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    settingTitleDark: {
        color: '#F9FAFB',
    },
    aboutSection: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    aboutText: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 8,
    },
    aboutTextDark: {
        color: '#6B7280',
    },
    aboutLink: {
        fontSize: 14,
        color: '#667eea',
        textDecorationLine: 'underline',
    },
    aboutLinkDark: {
        color: '#818CF8',
    },
});
