import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  X,
  SlidersHorizontal,
  Plus,
  ArrowUpDown,
  Check,
} from 'lucide-react-native';
import { useTasks } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { TaskCard } from '../../components/TaskCard';
import { EmptyState } from '../../components/EmptyState';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, TaskPriority } from '../../types';

export const TasksScreen: React.FC = () => {
  const {
    tasks,
    filteredTasks,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filterCategory,
    setFilterCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    refreshing,
    fetchTasks,
    toggleTaskComplete,
  } = useTasks();
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [showSortModal, setShowSortModal] = useState(false);

  // Status tab counts
  const allCount = tasks.length;
  const activeCount = tasks.filter((t) => !t.completed && t.status !== 'done').length;
  const completedCount = tasks.filter((t) => t.completed || t.status === 'done').length;

  const categories = ['all', 'Work', 'Personal', 'Design', 'Dev'];
  const priorities = ['all', 'high', 'medium', 'low'];

  const sortOptions = [
    { label: 'Due Date', value: 'dueDate' as const },
    { label: 'Priority', value: 'priority' as const },
    { label: 'Task Name', value: 'title' as const },
    { label: 'Created Date', value: 'createdAt' as const },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Search & Sort Header Bar */}
      <View style={styles.topBar}>
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Search size={18} color={colors.textSubtle} style={{ marginRight: 8 }} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search tasks, descriptions, categories..."
            placeholderTextColor={colors.textSubtle}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={16} color={colors.textSubtle} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowSortModal(true)}
          style={[styles.sortButton, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <ArrowUpDown size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Status Segment Tabs */}
      <View style={styles.tabBarContainer}>
        <View style={[styles.tabBar, { backgroundColor: colors.borderLight }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setFilterStatus('all')}
            style={[styles.tab, filterStatus === 'all' && [styles.activeTab, { backgroundColor: colors.card }]]}
          >
            <Text
              style={[
                styles.tabText,
                { color: filterStatus === 'all' ? colors.primary : colors.textMuted },
              ]}
            >
              All ({allCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setFilterStatus('active')}
            style={[styles.tab, filterStatus === 'active' && [styles.activeTab, { backgroundColor: colors.card }]]}
          >
            <Text
              style={[
                styles.tabText,
                { color: filterStatus === 'active' ? colors.primary : colors.textMuted },
              ]}
            >
              Active ({activeCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setFilterStatus('completed')}
            style={[styles.tab, filterStatus === 'completed' && [styles.activeTab, { backgroundColor: colors.card }]]}
          >
            <Text
              style={[
                styles.tabText,
                { color: filterStatus === 'completed' ? colors.primary : colors.textMuted },
              ]}
            >
              Completed ({completedCount})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Priority & Category Chips Scroll */}
      <View style={styles.chipsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {/* Priority Chips */}
          {priorities.map((p) => {
            const isSelected = filterPriority.toLowerCase() === p.toLowerCase();
            return (
              <TouchableOpacity
                key={`p-${p}`}
                activeOpacity={0.7}
                onPress={() => setFilterPriority(isSelected && p !== 'all' ? 'all' : p)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: isSelected ? '#FFFFFF' : colors.textMuted },
                  ]}
                >
                  {p === 'all' ? 'All Priorities' : `${p.toUpperCase()} Priority`}
                </Text>
              </TouchableOpacity>
            );
          })}

          <View style={[styles.chipDivider, { backgroundColor: colors.border }]} />

          {/* Category Chips */}
          {categories.map((c) => {
            const isSelected = filterCategory.toLowerCase() === c.toLowerCase();
            return (
              <TouchableOpacity
                key={`c-${c}`}
                activeOpacity={0.7}
                onPress={() => setFilterCategory(isSelected && c !== 'all' ? 'all' : c)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? colors.primaryLight : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: isSelected ? colors.primary : colors.textMuted },
                  ]}
                >
                  {c === 'all' ? 'All Categories' : c}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item._id })}
            onToggleComplete={() => toggleTaskComplete(item._id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchTasks}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No matching tasks"
            description={
              searchQuery
                ? `No tasks matched query "${searchQuery}"`
                : 'Try adjusting your priority or category filters.'
            }
          />
        }
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('CreateTask', {})}
        style={[styles.fab, { backgroundColor: colors.primary }]}
      >
        <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={[styles.sortModalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sortModalTitle, { color: colors.text }]}>Sort Tasks By</Text>
            {sortOptions.map((opt) => {
              const isSelected = sortBy === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSortBy(opt.value);
                    setShowSortModal(false);
                  }}
                  style={[
                    styles.sortOptionRow,
                    { borderBottomColor: colors.borderLight },
                  ]}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      { color: isSelected ? colors.primary : colors.text, fontWeight: isSelected ? '700' : '400' },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && <Check size={18} color={colors.primary} strokeWidth={2.5} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  sortButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipsWrapper: {
    marginBottom: 8,
  },
  chipsScroll: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipDivider: {
    width: 1,
    height: 18,
    marginHorizontal: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sortModalContent: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
  },
  sortModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  sortOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sortOptionText: {
    fontSize: 14.5,
  },
});
