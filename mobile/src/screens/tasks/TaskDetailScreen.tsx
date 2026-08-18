import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  CheckCircle,
  RotateCcw,
  Tag,
  AlertTriangle,
} from 'lucide-react-native';
import { useTasks } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { PriorityBadge } from '../../components/PriorityBadge';
import { CategoryBadge } from '../../components/CategoryBadge';
import { ConfirmModal } from '../../components/ConfirmModal';
import { getDueStatus } from '../../utils/dateUtils';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, Task, TaskStatus } from '../../types';

type Props = StackScreenProps<RootStackParamList, 'TaskDetail'>;

export const TaskDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const { tasks, updateTaskStatus, toggleTaskComplete, deleteTask } = useTasks();
  const { colors } = useTheme();

  const task = tasks.find((t) => t._id === taskId);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  if (!task) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: colors.text }]}>Task not found</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backHomeBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.backHomeText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const dueStatus = getDueStatus(task.dueDate, task.completed);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      setStatusLoading(true);
      await updateTaskStatus(task._id, newStatus);
    } catch (e) {
      console.warn('Failed to update status', e);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    try {
      setStatusLoading(true);
      await toggleTaskComplete(task._id);
    } catch (e) {
      console.warn('Failed to toggle complete', e);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteTask(task._id);
      setShowDeleteModal(false);
      navigation.goBack();
    } catch (e) {
      console.warn('Failed to delete task', e);
    } finally {
      setDeleting(false);
    }
  };

  const formattedDueDate = task.dueDate
    ? new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(task.dueDate))
    : 'No due date';

  const formattedCreated = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(task.createdAt));

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.topBarActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditTask', { taskId: task._id })}
            style={[styles.actionIconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Edit2 size={18} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowDeleteModal(true)}
            style={[styles.actionIconBtn, { backgroundColor: colors.dangerBg, borderColor: colors.danger }]}
          >
            <Trash2 size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Details Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Header Badges */}
          <View style={styles.badgesRow}>
            <CategoryBadge category={task.category} />
            <PriorityBadge priority={task.priority} size="md" />
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    task.status === 'done'
                      ? colors.doneBg
                      : task.status === 'in_progress'
                      ? colors.inProgressBg
                      : colors.todoBg,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  {
                    color:
                      task.status === 'done'
                        ? colors.doneText
                        : task.status === 'in_progress'
                        ? colors.inProgressText
                        : colors.todoText,
                  },
                ]}
              >
                {task.status === 'in_progress'
                  ? 'IN PROGRESS'
                  : task.status.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text
            style={[
              styles.title,
              {
                color: task.completed ? colors.textSubtle : colors.text,
                textDecorationLine: task.completed ? 'line-through' : 'none',
              },
            ]}
          >
            {task.title}
          </Text>

          {/* Description */}
          {task.description ? (
            <View style={styles.descBox}>
              <Text style={[styles.description, { color: colors.textMuted }]}>
                {task.description}
              </Text>
            </View>
          ) : null}

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          {/* Date & Metadata Rows */}
          <View style={styles.metaRow}>
            <View style={styles.metaLabelRow}>
              <Calendar size={16} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Due Date</Text>
            </View>
            <View style={styles.metaValueRow}>
              <Text style={[styles.metaValue, { color: colors.text }]}>{formattedDueDate}</Text>
              {dueStatus && (
                <Text
                  style={[
                    styles.dueRelativeText,
                    {
                      color: dueStatus.isOverdue
                        ? colors.danger
                        : dueStatus.isToday
                        ? colors.primary
                        : colors.textMuted,
                    },
                  ]}
                >
                  ({dueStatus.text})
                </Text>
              )}
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaLabelRow}>
              <Clock size={16} color={colors.textSubtle} style={{ marginRight: 8 }} />
              <Text style={[styles.metaLabel, { color: colors.textMuted }]}>Created</Text>
            </View>
            <Text style={[styles.metaValue, { color: colors.textMuted }]}>{formattedCreated}</Text>
          </View>
        </View>

        {/* Status Transition Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Move Status</Text>
          <View style={styles.statusButtonsRow}>
            {(['todo', 'in_progress', 'done'] as TaskStatus[]).map((s) => {
              const isSelected = task.status === s;
              const label = s === 'todo' ? 'To Do' : s === 'in_progress' ? 'In Progress' : 'Done';
              return (
                <TouchableOpacity
                  key={s}
                  activeOpacity={0.7}
                  disabled={statusLoading}
                  onPress={() => handleStatusChange(s)}
                  style={[
                    styles.statusBtn,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.borderLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBtnText,
                      { color: isSelected ? '#FFFFFF' : colors.textMuted, fontWeight: isSelected ? '700' : '500' },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Main Action Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={statusLoading}
          onPress={handleToggleComplete}
          style={[
            styles.completeButton,
            {
              backgroundColor: task.completed ? colors.card : colors.primary,
              borderColor: colors.primary,
              borderWidth: task.completed ? 1.5 : 0,
            },
          ]}
        >
          {statusLoading ? (
            <ActivityIndicator color={task.completed ? colors.primary : '#FFFFFF'} />
          ) : task.completed ? (
            <>
              <RotateCcw size={18} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.completeButtonText, { color: colors.primary }]}>
                Reopen Task
              </Text>
            </>
          ) : (
            <>
              <CheckCircle size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.completeButtonText}>Mark as Completed</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        visible={showDeleteModal}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        isDestructive
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  topBarActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    marginBottom: 10,
  },
  descBox: {
    marginTop: 4,
    marginBottom: 8,
  },
  description: {
    fontSize: 14.5,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  metaLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 13.5,
    fontWeight: '500',
  },
  metaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaValue: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  dueRelativeText: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  statusButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBtnText: {
    fontSize: 13,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 14,
    marginTop: 4,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  backHomeBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backHomeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
