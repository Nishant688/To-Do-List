import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, AlertCircle } from 'lucide-react-native';
import { Task } from '../types';
import { useTheme } from '../context/ThemeContext';
import { CustomCheckbox } from './CustomCheckbox';
import { PriorityBadge } from './PriorityBadge';
import { CategoryBadge } from './CategoryBadge';
import { getDueStatus } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggleComplete: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onToggleComplete,
}) => {
  const { colors } = useTheme();
  const dueStatus = getDueStatus(task.dueDate, task.completed);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.contentRow}>
        <View style={styles.checkboxWrapper}>
          <CustomCheckbox
            checked={task.completed || task.status === 'done'}
            onPress={onToggleComplete}
            size={20}
          />
        </View>

        <View style={styles.mainContent}>
          <Text
            style={[
              styles.title,
              {
                color: task.completed ? colors.textSubtle : colors.text,
                textDecorationLine: task.completed ? 'line-through' : 'none',
              },
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {task.description ? (
            <Text
              style={[styles.description, { color: colors.textMuted }]}
              numberOfLines={1}
            >
              {task.description}
            </Text>
          ) : null}

          <View style={styles.footerRow}>
            <View style={styles.badgesRow}>
              <CategoryBadge category={task.category} />
              <PriorityBadge priority={task.priority} />
            </View>

            {dueStatus && (
              <View style={styles.dueRow}>
                {dueStatus.isOverdue ? (
                  <AlertCircle size={12} color={colors.danger} strokeWidth={2} />
                ) : (
                  <Calendar size={12} color={colors.textMuted} strokeWidth={2} />
                )}
                <Text
                  style={[
                    styles.dueText,
                    {
                      color: dueStatus.isOverdue
                        ? colors.danger
                        : dueStatus.isToday
                        ? colors.primary
                        : colors.textMuted,
                      fontWeight: dueStatus.isOverdue || dueStatus.isToday ? '600' : '400',
                    },
                  ]}
                >
                  {dueStatus.text}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 13,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxWrapper: {
    paddingTop: 2,
    marginRight: 12,
  },
  mainContent: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueText: {
    fontSize: 11.5,
  },
});
