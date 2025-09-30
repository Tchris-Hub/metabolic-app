import React from 'react';
import { View, Text, TouchableOpacity, Image, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../ui/Card';

interface MealCardProps {
  title: string;
  description?: string;
  image?: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  time?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  onPress?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  style?: ViewStyle;
}

export default function MealCard({
  title,
  description,
  image,
  calories,
  carbs,
  protein,
  fat,
  fiber,
  sugar,
  sodium,
  time,
  difficulty,
  prepTime,
  cookTime,
  servings,
  onPress,
  onFavorite,
  isFavorite = false,
  style,
}: MealCardProps) {
  const getDifficultyColor = (): string => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getContainerStyle = (): ViewStyle => ({
    padding: 16,
    ...style,
  });

  const getImageStyle = (): ViewStyle => ({
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  });

  const getHeaderStyle = (): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  });

  const getTitleStyle = (): TextStyle => ({
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
    marginRight: 8,
  });

  const getDescriptionStyle = (): TextStyle => ({
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
    lineHeight: 20,
  });

  const getNutritionStyle = (): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  });

  const getNutritionItemStyle = (): ViewStyle => ({
    alignItems: 'center',
    flex: 1,
  });

  const getNutritionLabelStyle = (): TextStyle => ({
    fontSize: 12,
    color: '#757575',
    marginBottom: 2,
  });

  const getNutritionValueStyle = (): TextStyle => ({
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  });

  const getMetaStyle = (): ViewStyle => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  });

  const getTimeStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
  });

  const getDifficultyStyle = (): ViewStyle => ({
    flexDirection: 'row',
    alignItems: 'center',
  });

  const getDifficultyTextStyle = (): TextStyle => ({
    fontSize: 12,
    color: getDifficultyColor(),
    marginLeft: 4,
    fontWeight: '500',
  });

  const getFavoriteStyle = (): ViewStyle => ({
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  });

  return (
    <Card onPress={onPress} style={style}>
      <View style={getContainerStyle()}>
        {/* Image */}
        {image && (
          <Image
            source={{ uri: image }}
            style={getImageStyle()}
            resizeMode="cover"
          />
        )}

        {/* Favorite button */}
        {onFavorite && (
          <TouchableOpacity
            onPress={onFavorite}
            style={getFavoriteStyle()}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? '#F44336' : '#757575'}
            />
          </TouchableOpacity>
        )}

        {/* Header */}
        <View style={getHeaderStyle()}>
          <Text style={getTitleStyle()}>{title}</Text>
          {time && (
            <View style={getTimeStyle()}>
              <Ionicons name="time" size={14} color="#757575" />
              <Text style={{ fontSize: 12, color: '#757575', marginLeft: 4 }}>
                {time}
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        {description && (
          <Text style={getDescriptionStyle()}>{description}</Text>
        )}

        {/* Nutrition info */}
        <View style={getNutritionStyle()}>
          <View style={getNutritionItemStyle()}>
            <Text style={getNutritionLabelStyle()}>Calories</Text>
            <Text style={getNutritionValueStyle()}>{calories}</Text>
          </View>
          <View style={getNutritionItemStyle()}>
            <Text style={getNutritionLabelStyle()}>Carbs</Text>
            <Text style={getNutritionValueStyle()}>{carbs}g</Text>
          </View>
          <View style={getNutritionItemStyle()}>
            <Text style={getNutritionLabelStyle()}>Protein</Text>
            <Text style={getNutritionValueStyle()}>{protein}g</Text>
          </View>
          <View style={getNutritionItemStyle()}>
            <Text style={getNutritionLabelStyle()}>Fat</Text>
            <Text style={getNutritionValueStyle()}>{fat}g</Text>
          </View>
        </View>

        {/* Additional nutrition info */}
        {(fiber || sugar || sodium) && (
          <View style={getNutritionStyle()}>
            {fiber && (
              <View style={getNutritionItemStyle()}>
                <Text style={getNutritionLabelStyle()}>Fiber</Text>
                <Text style={getNutritionValueStyle()}>{fiber}g</Text>
              </View>
            )}
            {sugar && (
              <View style={getNutritionItemStyle()}>
                <Text style={getNutritionLabelStyle()}>Sugar</Text>
                <Text style={getNutritionValueStyle()}>{sugar}g</Text>
              </View>
            )}
            {sodium && (
              <View style={getNutritionItemStyle()}>
                <Text style={getNutritionLabelStyle()}>Sodium</Text>
                <Text style={getNutritionValueStyle()}>{sodium}mg</Text>
              </View>
            )}
          </View>
        )}

        {/* Meta info */}
        <View style={getMetaStyle()}>
          <View style={getDifficultyStyle()}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: getDifficultyColor(),
                marginRight: 4,
              }}
            />
            <Text style={getDifficultyTextStyle()}>
              {difficulty?.charAt(0).toUpperCase() + difficulty?.slice(1)}
            </Text>
          </View>

          {(prepTime || cookTime || servings) && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {prepTime && (
                <Text style={{ fontSize: 12, color: '#757575', marginRight: 8 }}>
                  Prep: {prepTime}min
                </Text>
              )}
              {cookTime && (
                <Text style={{ fontSize: 12, color: '#757575', marginRight: 8 }}>
                  Cook: {cookTime}min
                </Text>
              )}
              {servings && (
                <Text style={{ fontSize: 12, color: '#757575' }}>
                  {servings} servings
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

