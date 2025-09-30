import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';

interface NutritionLabelProps {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  saturatedFat?: number;
  transFat?: number;
  showDailyValues?: boolean;
  style?: ViewStyle;
}

export default function NutritionLabel({
  calories,
  carbs,
  protein,
  fat,
  fiber,
  sugar,
  sodium,
  cholesterol,
  saturatedFat,
  transFat,
  showDailyValues = false,
  style,
}: NutritionLabelProps) {
  const getDailyValue = (value: number, dailyValue: number): number => {
    return Math.round((value / dailyValue) * 100);
  };

  const getContainerStyle = (): ViewStyle => ({
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    ...style,
  });

  const getHeaderStyle = (): ViewStyle => ({
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
    marginBottom: 12,
  });

  const getTitleStyle = (): TextStyle => ({
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    textAlign: 'center',
  });

  const getRowStyle = (): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  });

  const getLabelStyle = (): TextStyle => ({
    fontSize: 14,
    color: '#424242',
    flex: 1,
  });

  const getValueStyle = (): TextStyle => ({
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'right',
    minWidth: 60,
  });

  const getDailyValueStyle = (): TextStyle => ({
    fontSize: 12,
    color: '#757575',
    marginLeft: 8,
  });

  const getHighlightedRowStyle = (): ViewStyle => ({
    ...getRowStyle(),
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    marginHorizontal: -8,
    borderRadius: 4,
  });

  const getHighlightedLabelStyle = (): TextStyle => ({
    ...getLabelStyle(),
    fontWeight: 'bold',
    fontSize: 16,
  });

  const getHighlightedValueStyle = (): TextStyle => ({
    ...getValueStyle(),
    fontSize: 16,
    fontWeight: 'bold',
  });

  return (
    <View style={getContainerStyle()}>
      {/* Header */}
      <View style={getHeaderStyle()}>
        <Text style={getTitleStyle()}>Nutrition Facts</Text>
      </View>

      {/* Calories */}
      <View style={getHighlightedRowStyle()}>
        <Text style={getHighlightedLabelStyle()}>Calories</Text>
        <Text style={getHighlightedValueStyle()}>{calories}</Text>
      </View>

      {/* Macronutrients */}
      <View style={getRowStyle()}>
        <Text style={getLabelStyle()}>Total Carbohydrate</Text>
        <Text style={getValueStyle()}>
          {carbs}g
          {showDailyValues && (
            <Text style={getDailyValueStyle()}>
              {getDailyValue(carbs, 300)}%
            </Text>
          )}
        </Text>
      </View>

      <View style={getRowStyle()}>
        <Text style={getLabelStyle()}>Protein</Text>
        <Text style={getValueStyle()}>
          {protein}g
          {showDailyValues && (
            <Text style={getDailyValueStyle()}>
              {getDailyValue(protein, 50)}%
            </Text>
          )}
        </Text>
      </View>

      <View style={getRowStyle()}>
        <Text style={getLabelStyle()}>Total Fat</Text>
        <Text style={getValueStyle()}>
          {fat}g
          {showDailyValues && (
            <Text style={getDailyValueStyle()}>
              {getDailyValue(fat, 65)}%
            </Text>
          )}
        </Text>
      </View>

      {/* Additional nutrients */}
      {fiber && (
        <View style={getRowStyle()}>
          <Text style={getLabelStyle()}>Dietary Fiber</Text>
          <Text style={getValueStyle()}>
            {fiber}g
            {showDailyValues && (
              <Text style={getDailyValueStyle()}>
                {getDailyValue(fiber, 25)}%
              </Text>
            )}
          </Text>
        </View>
      )}

      {sugar && (
        <View style={getRowStyle()}>
          <Text style={getLabelStyle()}>Total Sugars</Text>
          <Text style={getValueStyle()}>{sugar}g</Text>
        </View>
      )}

      {sodium && (
        <View style={getRowStyle()}>
          <Text style={getLabelStyle()}>Sodium</Text>
          <Text style={getValueStyle()}>
            {sodium}mg
            {showDailyValues && (
              <Text style={getDailyValueStyle()}>
                {getDailyValue(sodium, 2400)}%
              </Text>
            )}
          </Text>
        </View>
      )}

      {cholesterol && (
        <View style={getRowStyle()}>
          <Text style={getLabelStyle()}>Cholesterol</Text>
          <Text style={getValueStyle()}>
            {cholesterol}mg
            {showDailyValues && (
              <Text style={getDailyValueStyle()}>
                {getDailyValue(cholesterol, 300)}%
              </Text>
            )}
          </Text>
        </View>
      )}

      {saturatedFat && (
        <View style={getRowStyle()}>
          <Text style={getLabelStyle()}>Saturated Fat</Text>
          <Text style={getValueStyle()}>
            {saturatedFat}g
            {showDailyValues && (
              <Text style={getDailyValueStyle()}>
                {getDailyValue(saturatedFat, 20)}%
              </Text>
            )}
          </Text>
        </View>
      )}

      {transFat && (
        <View style={getRowStyle()}>
          <Text style={getLabelStyle()}>Trans Fat</Text>
          <Text style={getValueStyle()}>{transFat}g</Text>
        </View>
      )}

      {/* Footer */}
      {showDailyValues && (
        <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#E0E0E0' }}>
          <Text style={{ fontSize: 12, color: '#757575', textAlign: 'center' }}>
            *Percent Daily Values are based on a 2,000 calorie diet
          </Text>
        </View>
      )}
    </View>
  );
}

