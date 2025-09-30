import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LineChart from '../charts/LineChart';

interface TrendDisplayProps {
  title: string;
  data: Array<{ x: number; y: number; label?: string }>;
  unit: string;
  period: '7d' | '30d' | '90d';
  trend: 'up' | 'down' | 'stable';
  changePercent?: number;
  average?: number;
  target?: number;
  status?: 'good' | 'warning' | 'danger';
  color?: string;
  style?: ViewStyle;
}

export default function TrendDisplay({
  title,
  data,
  unit,
  period,
  trend,
  changePercent,
  average,
  target,
  status = 'good',
  color = '#4CAF50',
  style,
}: TrendDisplayProps) {
  const getTrendIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      case 'stable':
        return 'remove';
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
    }
  };

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

  const getPeriodText = (): string => {
    switch (period) {
      case '7d':
        return 'Last 7 days';
      case '30d':
        return 'Last 30 days';
      case '90d':
        return 'Last 90 days';
    }
  };

  const getContainerStyle = (): ViewStyle => ({
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...style,
  });

  const getHeaderStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  });

  const getTitleStyle = (): TextStyle => ({
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  });

  const getTrendStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
  });

  const getTrendTextStyle = (): TextStyle => ({
    fontSize: 14,
    color: getTrendColor(),
    marginLeft: 4,
    fontWeight: '500',
  });

  const getStatsStyle = (): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  });

  const getStatStyle = (): ViewStyle => ({
    alignItems: 'center',
    flex: 1,
  });

  const getStatLabelStyle = (): TextStyle => ({
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  });

  const getStatValueStyle = (): TextStyle => ({
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  });

  return (
    <View style={getContainerStyle()}>
      {/* Header */}
      <View style={getHeaderStyle()}>
        <Text style={getTitleStyle()}>{title}</Text>
        <View style={getTrendStyle()}>
          <Ionicons
            name={getTrendIcon()}
            size={16}
            color={getTrendColor()}
          />
          {changePercent && (
            <Text style={getTrendTextStyle()}>
              {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%
            </Text>
          )}
        </View>
      </View>

      {/* Chart */}
      <LineChart
        data={data}
        width={280}
        height={150}
        color={color}
        showDots={true}
        showLabels={false}
        showGrid={true}
      />

      {/* Stats */}
      <View style={getStatsStyle()}>
        <View style={getStatStyle()}>
          <Text style={getStatLabelStyle()}>Period</Text>
          <Text style={getStatValueStyle()}>{getPeriodText()}</Text>
        </View>
        
        {average && (
          <View style={getStatStyle()}>
            <Text style={getStatLabelStyle()}>Average</Text>
            <Text style={getStatValueStyle()}>
              {average.toFixed(1)} {unit}
            </Text>
          </View>
        )}
        
        {target && (
          <View style={getStatStyle()}>
            <Text style={getStatLabelStyle()}>Target</Text>
            <Text style={getStatValueStyle()}>
              {target} {unit}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

