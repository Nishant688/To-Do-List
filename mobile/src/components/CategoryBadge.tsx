import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CategoryBadgeProps {
  category: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const { colors } = useTheme();
  const cat = (category || 'Work').toLowerCase();

  let bg = colors.categoryWorkBg;
  let text = colors.categoryWorkText;

  if (cat.includes('personal') || cat.includes('health') || cat.includes('life')) {
    bg = colors.categoryPersonalBg;
    text = colors.categoryPersonalText;
  } else if (cat.includes('design') || cat.includes('ui') || cat.includes('ux')) {
    bg = colors.categoryDesignBg;
    text = colors.categoryDesignText;
  } else if (cat.includes('dev') || cat.includes('backend') || cat.includes('frontend') || cat.includes('code')) {
    bg = colors.categoryDevBg;
    text = colors.categoryDevText;
  } else if (cat.includes('work') || cat.includes('office') || cat.includes('project')) {
    bg = colors.categoryWorkBg;
    text = colors.categoryWorkText;
  } else {
    bg = colors.categoryOtherBg;
    text = colors.categoryOtherText;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>
        {category || 'Work'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
