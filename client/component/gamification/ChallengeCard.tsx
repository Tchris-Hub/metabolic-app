import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../ui/Card';
import ProgressChart from '../charts/ProgressChart';

interface ChallengeCardProps {
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
  progress: number; // 0-100
  target: number;
  current: number;
  unit: string;
  type: 'daily' | 'weekly' | 'monthly';
  difficulty: 'easy' | 'medium' | 'hard';
  reward?: string;
  completed?: boolean;
  onPress?: () => void;
  onClaim?: () => void;
  style?: ViewStyle;
}

export default function ChallengeCard({
  title,
  description,
  icon,
  progress,
  target,
  current,
  unit,
  type,
  difficulty,
  reward,
  completed = false,
  onPress,
  onClaim,
  style,
}: ChallengeCardProps) {
  const getDifficultyColor = (): string => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
    }
  };

  const getTypeColor = (): string => {
    switch (type) {
      case 'daily':
        return '#2196F3';
      case 'weekly':
        return '#9C27B0';
      case 'monthly':
        return '#FF5722';
    }
  };

  const getContainerStyle = (): ViewStyle => ({
    padding: 16,
    ...style,
  });

  const getHeaderStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  });

  const getTitleStyle = (): TextStyle => ({
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
    marginRight: 8,
  });

  const getTypeStyle = (): ViewStyle => ({
    backgroundColor: getTypeColor(),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  });

  const getTypeTextStyle = (): TextStyle => ({
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
  });

  const getDescriptionStyle = (): TextStyle => ({
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
    lineHeight: 20,
  });

  const getProgressStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  });

  const getProgressInfoStyle = (): ViewStyle => ({
    flex: 1,
    marginRight: 16,
  });

  const getProgressTextStyle = (): TextStyle => ({
    fontSize: 14,
    color: '#424242',
    marginBottom: 4,
  });

  const getProgressBarStyle = (): ViewStyle => ({
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  });

  const getProgressBarFillStyle = (): ViewStyle => ({
    height: '100%',
    backgroundColor: completed ? '#4CAF50' : getDifficultyColor(),
    borderRadius: 4,
    width: `${progress}%`,
  });

  const getStatsStyle = (): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  });

  const getStatStyle = (): ViewStyle => ({
    alignItems: 'center',
    flex: 1,
  });

  const getStatLabelStyle = (): TextStyle => ({
    fontSize: 12,
    color: '#757575',
    marginBottom: 2,
  });

  const getStatValueStyle = (): TextStyle => ({
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  });

  const getFooterStyle = (): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  });

  const getDifficultyStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
  });

  const getDifficultyDotStyle = (): ViewStyle => ({
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: getDifficultyColor(),
    marginRight: 4,
  });

  const getDifficultyTextStyle = (): TextStyle => ({
    fontSize: 12,
    color: '#757575',
    textTransform: 'capitalize',
  });

  const getRewardStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  });

  const getRewardTextStyle = (): TextStyle => ({
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
    marginLeft: 4,
  });

  const getActionButtonStyle = (): ViewStyle => ({
    backgroundColor: completed ? '#4CAF50' : '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  });

  const getActionTextStyle = (): TextStyle => ({
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  });

  return (
    <Card onPress={onPress} style={style}>
      <View style={getContainerStyle()}>
        {/* Header */}
        <View style={getHeaderStyle()}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            {icon && (
              <Ionicons
                name={icon}
                size={20}
                color={getDifficultyColor()}
                style={{ marginRight: 8 }}
              />
            )}
            <Text style={getTitleStyle()}>{title}</Text>
          </View>
          <View style={getTypeStyle()}>
            <Text style={getTypeTextStyle()}>{type}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={getDescriptionStyle()}>{description}</Text>

        {/* Progress */}
        <View style={getProgressStyle()}>
          <View style={getProgressInfoStyle()}>
            <Text style={getProgressTextStyle()}>
              {current} / {target} {unit}
            </Text>
            <View style={getProgressBarStyle()}>
              <View style={getProgressBarFillStyle()} />
            </View>
          </View>
          
          <ProgressChart
            progress={progress}
            size={60}
            color={completed ? '#4CAF50' : getDifficultyColor()}
            showPercentage={false}
            animated={true}
          />
        </View>

        {/* Stats */}
        <View style={getStatsStyle()}>
          <View style={getStatStyle()}>
            <Text style={getStatLabelStyle()}>Progress</Text>
            <Text style={getStatValueStyle()}>{Math.round(progress)}%</Text>
          </View>
          <View style={getStatStyle()}>
            <Text style={getStatLabelStyle()}>Remaining</Text>
            <Text style={getStatValueStyle()}>
              {Math.max(target - current, 0)} {unit}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={getFooterStyle()}>
          <View style={getDifficultyStyle()}>
            <View style={getDifficultyDotStyle()} />
            <Text style={getDifficultyTextStyle()}>{difficulty}</Text>
          </View>

          {reward && (
            <View style={getRewardStyle()}>
              <Ionicons name="gift" size={12} color="#FF9800" />
              <Text style={getRewardTextStyle()}>{reward}</Text>
            </View>
          )}

          {completed && onClaim && (
            <TouchableOpacity onPress={onClaim} style={getActionButtonStyle()}>
              <Text style={getActionTextStyle()}>Claim Reward</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Card>
  );
}

