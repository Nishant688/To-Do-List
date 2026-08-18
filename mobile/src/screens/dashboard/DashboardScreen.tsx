import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Plus, CheckCircle2 } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { StatCard } from '../../components/StatCard';
import { TaskCard } from '../../components/TaskCard';
import { QuickAddBar } from '../../components/QuickAddBar';
import { EmptyState } from '../../components/EmptyState';
import { getGreeting, formatHeaderDate } from '../../utils/dateUtils';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

export const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const {
    stats,
    todayTasks,
    dueSoonTasks,
    refreshing,
    fetchTasks,
    quickAddTask,
    toggleTaskComplete,
  } = useTasks();
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const greeting = getGreeting(user?.name || 'User');
  const dateString = formatHeaderDate();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchTasks}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Greeting & Date */}
        <View style={styles.header}>
          <View style={styles.dateRow}>
            <Calendar size={14} color={colors.primary} strokeWidth={2.2} style={{ marginRight: 6 }} />
            <Text style={[styles.dateText, { color: colors.textMuted }]}>{dateString}</Text>
          </View>
          <Text style={[styles.greetingText, { color: colors.text }]}>{greeting}</Text>
          
          <View style={styles.dueBadgeRow}>
            <View
              style={[
                styles.dueBadge,
                {
                  backgroundColor: stats.dueToday > 0 ? colors.priorityHighBg : colors.doneBg,
                  borderColor: stats.dueToday > 0 ? colors.priorityHighBorder : colors.success,
                },
              ]}
            >
              <Text
                style={[
                  styles.dueBadgeText,
                  { color: stats.dueToday > 0 ? colors.priorityHighText : colors.doneText },
                ]}
              >
                {stats.dueToday > 0
                  ? `${stats.dueToday} ${stats.dueToday === 1 ? 'task' : 'tasks'} due today`
                  : '✨ All caught up for today!'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Add Bar */}
        <View style={styles.section}>
          <QuickAddBar onAdd={quickAddTask} placeholder="Quick add a task for today..." />
        </View>

        {/* 4 Dynamic Metric Cards */}
        <View style={styles.section}>
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <StatCard type="total" count={stats.total} />
              <StatCard type="completed" count={stats.completed} />
            </View>
            <View style={styles.statsRow}>
              <StatCard type="pending" count={stats.pending} />
              <StatCard type="overdue" count={stats.overdue} />
            </View>
          </View>
        </View>

        {/* Today's Tasks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Today</Text>
              <View style={[styles.countPill, { backgroundColor: colors.borderLight }]}>
                <Text style={[styles.countPillText, { color: colors.textMuted }]}>
                  {todayTasks.length}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('CreateTask', { initialDate: new Date().toISOString() })}
              style={[styles.addInlineButton, { backgroundColor: colors.primaryLight }]}
            >
              <Plus size={14} color={colors.primary} strokeWidth={2.5} style={{ marginRight: 4 }} />
              <Text style={[styles.addInlineText, { color: colors.primary }]}>Add</Text>
            </TouchableOpacity>
          </View>

          {todayTasks.length === 0 ? (
            <EmptyState
              title="No tasks for today"
              description="Enjoy your day or tap '+ Add' above to schedule one."
              type="completed"
            />
          ) : (
            todayTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onPress={() => navigation.navigate('TaskDetail', { taskId: task._id })}
                onToggleComplete={() => toggleTaskComplete(task._id)}
              />
            ))
          )}
        </View>

        {/* Due Soon Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Due Soon</Text>
              <View style={[styles.countPill, { backgroundColor: colors.borderLight }]}>
                <Text style={[styles.countPillText, { color: colors.textMuted }]}>
                  {dueSoonTasks.length}
                </Text>
              </View>
            </View>
          </View>

          {dueSoonTasks.length === 0 ? (
            <EmptyState
              title="No upcoming tasks"
              description="No tasks scheduled for the next 7 days."
              type="empty"
            />
          ) : (
            dueSoonTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onPress={() => navigation.navigate('TaskDetail', { taskId: task._id })}
                onToggleComplete={() => toggleTaskComplete(task._id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 18,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  dueBadgeRow: {
    flexDirection: 'row',
  },
  dueBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  dueBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 22,
  },
  statsGrid: {
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  countPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addInlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  addInlineText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
