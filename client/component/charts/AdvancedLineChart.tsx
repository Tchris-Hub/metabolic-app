import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import Svg, { Path, Circle, Line, Defs, LinearGradient as SvgLinearGradient, Stop, Rect } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DataPoint {
  value: number;
  label: string;
  color?: string;
}

interface AdvancedLineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  showGrid?: boolean;
  showDots?: boolean;
  animated?: boolean;
  onPointPress?: (point: DataPoint, index: number) => void;
}

export default function AdvancedLineChart({
  data,
  height = 220,
  color = '#E91E63',
  showGrid = true,
  showDots = true,
  animated = true,
  onPointPress,
}: AdvancedLineChartProps) {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  
  const chartWidth = SCREEN_WIDTH - 80;
  const chartHeight = height - 60;
  const padding = 20;
  
  // Calculate min and max values
  const values = data.map(d => d.value);
  const maxValue = Math.max(...values) * 1.1;
  const minValue = Math.min(...values) * 0.9;
  const valueRange = maxValue - minValue;
  
  // Calculate points
  const points = data.map((point, index) => {
    const x = padding + (index * (chartWidth - padding * 2)) / (data.length - 1);
    const y = chartHeight - padding - ((point.value - minValue) / valueRange) * (chartHeight - padding * 2);
    return { x, y, ...point };
  });
  
  // Create smooth curve path using cubic bezier
  const createSmoothPath = () => {
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      // Control points for smooth curve
      const controlX1 = current.x + (next.x - current.x) / 3;
      const controlY1 = current.y;
      const controlX2 = current.x + (2 * (next.x - current.x)) / 3;
      const controlY2 = next.y;
      
      path += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`;
    }
    
    return path;
  };
  
  // Create area fill path
  const createAreaPath = () => {
    const linePath = createSmoothPath();
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    
    return `${linePath} L ${lastPoint.x} ${chartHeight - padding} L ${firstPoint.x} ${chartHeight - padding} Z`;
  };
  
  const handlePointPress = (point: DataPoint, index: number) => {
    setSelectedPoint(index);
    onPointPress?.(point, index);
  };
  
  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={chartHeight}>
        <Defs>
          <SvgLinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </SvgLinearGradient>
        </Defs>
        
        {/* Grid lines */}
        {showGrid && (
          <>
            {[0, 1, 2, 3, 4].map((i) => {
              const y = padding + (i * (chartHeight - padding * 2)) / 4;
              return (
                <Line
                  key={`grid-${i}`}
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              );
            })}
          </>
        )}
        
        {/* Area fill */}
        <Path
          d={createAreaPath()}
          fill="url(#gradient)"
        />
        
        {/* Line */}
        <Path
          d={createSmoothPath()}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {showDots && points.map((point, index) => (
          <React.Fragment key={`point-${index}`}>
            {/* Outer glow circle */}
            <Circle
              cx={point.x}
              cy={point.y}
              r={selectedPoint === index ? 12 : 8}
              fill={point.color || color}
              opacity={0.2}
            />
            {/* Inner circle */}
            <Circle
              cx={point.x}
              cy={point.y}
              r={selectedPoint === index ? 6 : 4}
              fill={point.color || color}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          </React.Fragment>
        ))}
        
        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map((i) => {
          const value = maxValue - (i * valueRange) / 4;
          const y = padding + (i * (chartHeight - padding * 2)) / 4;
          return (
            <React.Fragment key={`y-label-${i}`}>
              <Rect
                x={0}
                y={y - 10}
                width={padding - 5}
                height={20}
                fill="#FFFFFF"
              />
            </React.Fragment>
          );
        })}
      </Svg>
      
      {/* X-axis labels */}
      <View style={styles.xAxisLabels}>
        {data.map((point, index) => (
          <TouchableOpacity
            key={`label-${index}`}
            style={styles.xLabel}
            onPress={() => handlePointPress(point, index)}
          >
            <Text style={[
              styles.xLabelText,
              selectedPoint === index && styles.xLabelTextSelected
            ]}>
              {point.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Y-axis value labels */}
      <View style={styles.yAxisLabels}>
        {[0, 1, 2, 3, 4].map((i) => {
          const value = Math.round(maxValue - (i * valueRange) / 4);
          return (
            <Text key={`y-value-${i}`} style={styles.yLabelText}>
              {value}
            </Text>
          );
        })}
      </View>
      
      {/* Selected point tooltip */}
      {selectedPoint !== null && (
        <View style={[
          styles.tooltip,
          {
            left: points[selectedPoint].x - 40,
            top: points[selectedPoint].y - 50,
          }
        ]}>
          <Text style={styles.tooltipValue}>{data[selectedPoint].value}</Text>
          <Text style={styles.tooltipLabel}>{data[selectedPoint].label}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  xLabel: {
    flex: 1,
    alignItems: 'center',
  },
  xLabelText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  xLabelTextSelected: {
    color: '#E91E63',
    fontWeight: 'bold',
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    top: 20,
    height: 180,
    justifyContent: 'space-between',
  },
  yLabelText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 8,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tooltipLabel: {
    fontSize: 10,
    color: '#D1D5DB',
    marginTop: 2,
  },
});
