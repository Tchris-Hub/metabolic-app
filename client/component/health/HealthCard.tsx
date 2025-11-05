import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../ui/card';

interface HealthCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  status?: 'good' | 'warning' | 'danger';
  icon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  lastUpdated?: string;
  style?: ViewStyle;
}

export default function HealthCard({
  title,
  value,
  unit,
  trend,
  status = 'good',
  icon,
  onPress,
  lastUpdated,
  style,
}: HealthCardProps) {
  const getStatusColor = (): string => {
    switch (status) {
      case 'good':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'danger':
        return '#F44336';
      default:
        return '#4CAF50';
    }
  };

  const getTrendIcon = (): keyof typeof Ionicons.glyphMap | null => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      case 'stable':
        return 'remove';
      default:
        return null;
    }
  };

  const getTrendColor = (): string => {
    switch (trend) {
      case 'up':
        return status === 'danger' ? '#F44336' : '#4CAF50';
      case 'down':
        return status === 'good' ? '#F44336' : '#4CAF50';
      case 'stable':
        return '#757575';
      default:
        return '#757575';
    }
  };

  const getCardStyle = (): ViewStyle => ({
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
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    flex: 1,
  });

  const getValueStyle = (): TextStyle => ({
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  });

  const getUnitStyle = (): TextStyle => ({
    fontSize: 16,
    color: '#757575',
    marginLeft: 4,
  });

  const getTrendStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  });

  const getLastUpdatedStyle = (): TextStyle => ({
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 8,
  });

  const renderContent = () => (
    <View style={getCardStyle()}>
      {/* Header */}
      <View style={getHeaderStyle()}>
        <Text style={getTitleStyle()}>{title}</Text>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={getStatusColor()}
          />
        )}
      </View>

      {/* Value */}
      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 }}>
        <Text style={getValueStyle()}>{value}</Text>
        {unit && <Text style={getUnitStyle()}>{unit}</Text>}
      </View>

      {/* Trend */}
      {trend && (
        <View style={getTrendStyle()}>
          <Ionicons
            name={getTrendIcon()!}
            size={16}
            color={getTrendColor()}
            style={{ marginRight: 4 }}
          />
          <Text style={{ fontSize: 12, color: getTrendColor() }}>
            {trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable'}
          </Text>
        </View>
      )}

      {/* Last Updated */}
      {lastUpdated && (
        <Text style={getLastUpdatedStyle()}>
          Last updated: {lastUpdated}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Card onPress={onPress} style={style}>
        {renderContent()}
      </Card>
    );
  }

  return (
    <Card style={style}>
      {renderContent()}
    </Card>
  );
}

