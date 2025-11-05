import React from 'react';
import { View, Text, Dimensions, ViewStyle, TextStyle } from 'react-native';
import Svg, { Path, Line, Circle, Text as SvgText, G } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DataPoint {
  x: number;
  y: number;
  label?: string;
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showDots?: boolean;
  showLabels?: boolean;
  showGrid?: boolean;
  gridColor?: string;
  labelColor?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  style?: ViewStyle;
}

export default function LineChart({
  data,
  width = SCREEN_WIDTH - 40,
  height = 200,
  color = '#4CAF50',
  strokeWidth = 2,
  showDots = true,
  showLabels = true,
  showGrid = true,
  gridColor = '#E0E0E0',
  labelColor = '#757575',
  xAxisLabel,
  yAxisLabel,
  style,
}: LineChartProps) {
  if (!data || data.length === 0) {
    return (
      <View style={[{ width, height, justifyContent: 'center', alignItems: 'center' }, style]}>
        <Text style={{ color: '#9E9E9E', fontSize: 16 }}>No data available</Text>
      </View>
    );
  }

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate min/max values
  const minX = Math.min(...data.map(d => d.x));
  const maxX = Math.max(...data.map(d => d.x));
  const minY = Math.min(...data.map(d => d.y));
  const maxY = Math.max(...data.map(d => d.y));

  // Add some padding to the Y range
  const yRange = maxY - minY;
  const yPadding = yRange * 0.1;
  const adjustedMinY = minY - yPadding;
  const adjustedMaxY = maxY + yPadding;

  // Scale data to chart coordinates
  const scaleX = (x: number) => ((x - minX) / (maxX - minX)) * chartWidth;
  const scaleY = (y: number) => chartHeight - ((y - adjustedMinY) / (adjustedMaxY - adjustedMinY)) * chartHeight;

  // Generate path string for the line
  const pathData = data
    .map((point, index) => {
      const x = scaleX(point.x) + padding;
      const y = scaleY(point.y) + padding;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Generate grid lines
  const generateGridLines = () => {
    if (!showGrid) return null;

    const gridLines = [];
    const numGridLines = 5;

    // Horizontal grid lines
    for (let i = 0; i <= numGridLines; i++) {
      const y = padding + (chartHeight / numGridLines) * i;
      const value = adjustedMaxY - (adjustedMaxY - adjustedMinY) * (i / numGridLines);
      
      gridLines.push(
        <Line
          key={`h-${i}`}
          x1={padding}
          y1={y}
          x2={padding + chartWidth}
          y2={y}
          stroke={gridColor}
          strokeWidth={0.5}
          strokeDasharray="2,2"
        />
      );

      // Y-axis labels
      if (showLabels && i % 2 === 0) {
        gridLines.push(
          <SvgText
            key={`y-label-${i}`}
            x={padding - 10}
            y={y + 4}
            fontSize="10"
            fill={labelColor}
            textAnchor="end"
          >
            {Math.round(value)}
          </SvgText>
        );
      }
    }

    // Vertical grid lines
    for (let i = 0; i <= numGridLines; i++) {
      const x = padding + (chartWidth / numGridLines) * i;
      
      gridLines.push(
        <Line
          key={`v-${i}`}
          x1={x}
          y1={padding}
          x2={x}
          y2={padding + chartHeight}
          stroke={gridColor}
          strokeWidth={0.5}
          strokeDasharray="2,2"
        />
      );
    }

    return gridLines;
  };

  return (
    <View style={[{ width, height }, style]}>
      <Svg width={width} height={height}>
        {/* Grid lines */}
        {generateGridLines()}

        {/* Chart line */}
        <Path
          d={pathData}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {showDots && data.map((point, index) => {
          const x = scaleX(point.x) + padding;
          const y = scaleY(point.y) + padding;
          
          return (
            <G key={index}>
              <Circle
                cx={x}
                cy={y}
                r={4}
                fill={color}
                stroke="white"
                strokeWidth={2}
              />
              {point.label && (
                <SvgText
                  x={x}
                  y={y - 10}
                  fontSize="10"
                  fill={labelColor}
                  textAnchor="middle"
                >
                  {point.label}
                </SvgText>
              )}
            </G>
          );
        })}

        {/* Axis labels */}
        {xAxisLabel && (
          <SvgText
            x={width / 2}
            y={height - 10}
            fontSize="12"
            fill={labelColor}
            textAnchor="middle"
          >
            {xAxisLabel}
          </SvgText>
        )}

        {yAxisLabel && (
          <SvgText
            x={10}
            y={height / 2}
            fontSize="12"
            fill={labelColor}
            textAnchor="middle"
            transform={`rotate(-90, 10, ${height / 2})`}
          >
            {yAxisLabel}
          </SvgText>
        )}
      </Svg>
    </View>
  );
}

