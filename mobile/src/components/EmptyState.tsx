import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, Inbox } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

interface EmptyStateProps {
  title?: string;
  description?: string;
  type?: 'completed' | 'empty';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No tasks found',
  description = 'You have no tasks matching this criteria.',
  type = 'empty',
}) => {
  const { colors } = useTheme();
  const Icon = type === 'completed' ? CheckCircle2 : Inbox;
  const iconColor = type === 'completed' ? colors.success : colors.textSubtle;

  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { backgroundColor: colors.borderLight }]}>
        <Icon size={32} color={iconColor} strokeWidth={1.8} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textMuted }]}>
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 13.5,
    textAlign: 'center',
    lineHeight: 18,
  },
});
