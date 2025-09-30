import React from 'react';
import { View, Text, TouchableOpacity, Image, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../ui/Card';

interface FoodItemProps {
  name: string;
  brand?: string;
  image?: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize: string;
  servingUnit: string;
  quantity?: number;
  onPress?: () => void;
  onAdd?: () => void;
  onRemove?: () => void;
  onEdit?: () => void;
  showActions?: boolean;
  style?: ViewStyle;
}

export default function FoodItem({
  name,
  brand,
  image,
  calories,
  carbs,
  protein,
  fat,
  fiber,
  sugar,
  sodium,
  servingSize,
  servingUnit,
  quantity = 1,
  onPress,
  onAdd,
  onRemove,
  onEdit,
  showActions = true,
  style,
}: FoodItemProps) {
  const getContainerStyle = (): ViewStyle => ({
    padding: 12,
    ...style,
  });

  const getContentStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
  });

  const getImageStyle = (): ViewStyle => ({
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  });

  const getInfoStyle = (): ViewStyle => ({
    flex: 1,
  });

  const getNameStyle = (): TextStyle => ({
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  });

  const getBrandStyle = (): TextStyle => ({
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  });

  const getServingStyle = (): TextStyle => ({
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  });

  const getNutritionStyle = (): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  });

  const getNutritionItemStyle = (): ViewStyle => ({
    alignItems: 'center',
    flex: 1,
  });

  const getNutritionLabelStyle = (): TextStyle => ({
    fontSize: 10,
    color: '#757575',
    marginBottom: 2,
  });

  const getNutritionValueStyle = (): TextStyle => ({
    fontSize: 12,
    fontWeight: '600',
    color: '#212121',
  });

  const getActionsStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  });

  const getQuantityStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  });

  const getQuantityTextStyle = (): TextStyle => ({
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginHorizontal: 8,
  });

  const getActionButtonStyle = (): ViewStyle => ({
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    marginLeft: 8,
  });

  const getRemoveButtonStyle = (): ViewStyle => ({
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F44336',
    marginRight: 8,
  });

  const getEditButtonStyle = (): ViewStyle => ({
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    marginLeft: 8,
  });

  return (
    <Card onPress={onPress} style={style}>
      <View style={getContainerStyle()}>
        <View style={getContentStyle()}>
          {/* Image */}
          {image && (
            <Image
              source={{ uri: image }}
              style={getImageStyle()}
              resizeMode="cover"
            />
          )}

          {/* Food info */}
          <View style={getInfoStyle()}>
            <Text style={getNameStyle()}>{name}</Text>
            {brand && <Text style={getBrandStyle()}>{brand}</Text>}
            <Text style={getServingStyle()}>
              {servingSize} {servingUnit}
            </Text>

            {/* Nutrition info */}
            <View style={getNutritionStyle()}>
              <View style={getNutritionItemStyle()}>
                <Text style={getNutritionLabelStyle()}>Calories</Text>
                <Text style={getNutritionValueStyle()}>
                  {Math.round(calories * quantity)}
                </Text>
              </View>
              <View style={getNutritionItemStyle()}>
                <Text style={getNutritionLabelStyle()}>Carbs</Text>
                <Text style={getNutritionValueStyle()}>
                  {Math.round(carbs * quantity)}g
                </Text>
              </View>
              <View style={getNutritionItemStyle()}>
                <Text style={getNutritionLabelStyle()}>Protein</Text>
                <Text style={getNutritionValueStyle()}>
                  {Math.round(protein * quantity)}g
                </Text>
              </View>
              <View style={getNutritionItemStyle()}>
                <Text style={getNutritionLabelStyle()}>Fat</Text>
                <Text style={getNutritionValueStyle()}>
                  {Math.round(fat * quantity)}g
                </Text>
              </View>
            </View>

            {/* Actions */}
            {showActions && (
              <View style={getActionsStyle()}>
                <View style={getQuantityStyle()}>
                  {onRemove && (
                    <TouchableOpacity onPress={onRemove}>
                      <Ionicons name="remove" size={16} color="#F44336" />
                    </TouchableOpacity>
                  )}
                  <Text style={getQuantityTextStyle()}>{quantity}</Text>
                  {onAdd && (
                    <TouchableOpacity onPress={onAdd}>
                      <Ionicons name="add" size={16} color="#4CAF50" />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {onEdit && (
                    <TouchableOpacity onPress={onEdit} style={getEditButtonStyle()}>
                      <Ionicons name="create" size={16} color="white" />
                    </TouchableOpacity>
                  )}
                  {onAdd && !onRemove && (
                    <TouchableOpacity onPress={onAdd} style={getActionButtonStyle()}>
                      <Ionicons name="add" size={16} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
}

