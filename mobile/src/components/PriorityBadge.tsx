import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaskPriority } from '../types';
import { useTheme } from '../context/ThemeContext';

interface PriorityBadgeProps {
  priority: TaskPriority | string;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority = 'medium',
  size = 'sm',
}) => {
  const { colors } = useTheme();
  const p = priority.toLowerCase() as TaskPriority;

  let bg = colors.priorityMedBg;
  let text = colors.priorityMedText;
  let border = colors.priorityMedBorder;
  let label = 'MED';

  if (p === 'high') {
    bg = colors.priorityHighBg;
    text = colors.priorityHighText;
    border = colors.priorityHighBorder;
    label = 'HIGH';
  } else if (p === 'low') {
    bg = colors.priorityLowBg;
    text = colors.priorityLowText;
    border = colors.priorityLowBorder;
    label = 'LOW';
  }

  const isMd = size === 'md';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          borderColor: border,
          paddingHorizontal: isMd ? 8 : 6,
          paddingVertical: isMd ? 3 : 2,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: text,
            fontSize: isMd ? 11 : 9.5,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
