import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle,
} from 'lucide-react-native';
import { useTasks } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { PriorityBadge } from '../../components/PriorityBadge';
import { CategoryBadge } from '../../components/CategoryBadge';
import { EmptyState } from '../../components/EmptyState';
import { getDueStatus } from '../../utils/dateUtils';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Task, TaskStatus } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = SCREEN_WIDTH * 0.82;

export const BoardScreen: React.FC = () => {
  const {
    todoTasks,
    inProgressTasks,
    doneTasks,
    refreshing,
    fetchTasks,
    updateTaskStatus,
    toggleTaskComplete,
  } = useTasks();
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [activeTab, setActiveTab] = useState<TaskStatus>('todo');
  const scrollRef = useRef<ScrollView>(null);

  const columns: {
    id: TaskStatus;
    title: string;
    tasks: Task[];
    color: string;
    bg: string;
  }[] = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: todoTasks,
      color: colors.todoText,
      bg: colors.todoBg,
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      tasks: inProgressTasks,
      color: colors.inProgressText,
      bg: colors.inProgressBg,
    },
    {
      id: 'done',
      title: 'Done',
      tasks: doneTasks,
      color: colors.doneText,
      bg: colors.doneBg,
    },
  ];

  const handleMoveStatus = async (taskId: string, targetStatus: TaskStatus) => {
    try {
      await updateTaskStatus(taskId, targetStatus);
    } catch (e) {
      console.warn('Failed to move status', e);
    }
  };

  const renderTaskCard = (task: Task, currentStatus: TaskStatus) => {
    const dueStatus = getDueStatus(task.dueDate, task.completed);

    return (
      <TouchableOpacity
        key={task._id}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('TaskDetail', { taskId: task._id })}
        style={[
          styles.boardCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <CategoryBadge category={task.category} />
          <PriorityBadge priority={task.priority} />
        </View>

        <Text
          style={[
            styles.cardTitle,
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
          <Text style={[styles.cardDescription, { color: colors.textMuted }]} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}

        <View style={styles.cardFooter}>
          {dueStatus ? (
            <View style={styles.dueTag}>
              {dueStatus.isOverdue ? (
                <AlertCircle size={11} color={colors.danger} />
              ) : (
                <Calendar size={11} color={colors.textMuted} />
              )}
              <Text
                style={[
                  styles.dueTagText,
                  {
                    color: dueStatus.isOverdue
                      ? colors.danger
                      : dueStatus.isToday
                      ? colors.primary
                      : colors.textMuted,
                  },
                ]}
              >
                {dueStatus.boardText}
              </Text>
            </View>
          ) : (
            <View />
          )}

          {/* Quick status movement buttons */}
          <View style={styles.moveButtonsRow}>
            {currentStatus === 'in_progress' && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleMoveStatus(task._id, 'todo')}
                style={[styles.moveBtn, { backgroundColor: colors.borderLight }]}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <ChevronLeft size={14} color={colors.textMuted} />
              </TouchableOpacity>
            )}

            {currentStatus === 'done' && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleMoveStatus(task._id, 'in_progress')}
                style={[styles.moveBtn, { backgroundColor: colors.borderLight }]}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <ChevronLeft size={14} color={colors.textMuted} />
              </TouchableOpacity>
            )}

            {currentStatus === 'todo' && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleMoveStatus(task._id, 'in_progress')}
                style={[styles.moveBtn, { backgroundColor: colors.primaryLight }]}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <ChevronRight size={14} color={colors.primary} />
              </TouchableOpacity>
            )}

            {currentStatus === 'in_progress' && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleMoveStatus(task._id, 'done')}
                style={[styles.moveBtn, { backgroundColor: colors.doneBg }]}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <ChevronRight size={14} color={colors.doneText} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Segmented Top Selector Bar */}
      <View style={styles.topSelector}>
        <View style={[styles.tabSegmentWrapper, { backgroundColor: colors.borderLight }]}>
          {columns.map((col, idx) => {
            const isSelected = activeTab === col.id;
            return (
              <TouchableOpacity
                key={col.id}
                activeOpacity={0.7}
                onPress={() => {
                  setActiveTab(col.id);
                  scrollRef.current?.scrollTo({ x: idx * (COLUMN_WIDTH + 14), animated: true });
                }}
                style={[
                  styles.tabSegment,
                  isSelected && [styles.activeTabSegment, { backgroundColor: colors.card }],
                ]}
              >
                <Text
                  style={[
                    styles.tabSegmentText,
                    { color: isSelected ? colors.primary : colors.textMuted },
                  ]}
                >
                  {col.title} ({col.tasks.length})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Horizontal Kanban Columns */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.columnsContainer}
        decelerationRate="fast"
        snapToInterval={COLUMN_WIDTH + 14}
        snapToAlignment="start"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchTasks}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {columns.map((col) => (
          <View
            key={col.id}
            style={[
              styles.column,
              {
                width: COLUMN_WIDTH,
                backgroundColor: colors.borderLight,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Column Header */}
            <View style={styles.colHeader}>
              <View style={styles.colTitleRow}>
                <View style={[styles.statusDot, { backgroundColor: col.color }]} />
                <Text style={[styles.colTitle, { color: colors.text }]}>{col.title}</Text>
              </View>
              <View style={[styles.colCountPill, { backgroundColor: colors.card }]}>
                <Text style={[styles.colCountText, { color: colors.text }]}>{col.tasks.length}</Text>
              </View>
            </View>

            {/* Task Cards List */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.cardsScroll}
            >
              {col.tasks.length === 0 ? (
                <EmptyState
                  title={`No tasks in ${col.title}`}
                  description={`Tasks moved to ${col.title} will appear here.`}
                  type={col.id === 'done' ? 'completed' : 'empty'}
                />
              ) : (
                col.tasks.map((task) => renderTaskCard(task, col.id))
              )}
            </ScrollView>
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('CreateTask', {})}
        style={[styles.fab, { backgroundColor: colors.primary }]}
      >
        <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topSelector: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tabSegmentWrapper: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  tabSegment: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  activeTabSegment: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabSegmentText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  columnsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
    gap: 14,
  },
  column: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    height: '100%',
  },
  colHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  colTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  colTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  colCountPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  colCountText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  cardsScroll: {
    paddingBottom: 100,
  },
  boardCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    lineHeight: 19,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12.5,
    lineHeight: 16,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  dueTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  moveButtonsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  moveBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5B50EC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
