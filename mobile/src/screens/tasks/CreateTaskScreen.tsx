import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Calendar, AlertCircle } from 'lucide-react-native';
import { useTasks } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, TaskPriority, TaskStatus } from '../../types';

type Props = StackScreenProps<RootStackParamList, 'CreateTask'>;

export const CreateTaskScreen: React.FC<Props> = ({ route, navigation }) => {
  const { initialDate, initialCategory } = route.params || {};
  const { createTask } = useTasks();
  const { colors } = useTheme();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(initialCategory || 'Work');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCat, setIsCustomCat] = useState(false);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');

  // Date selection presets: today, tomorrow, nextWeek, noDate
  const [dateOption, setDateOption] = useState<'today' | 'tomorrow' | 'nextWeek' | 'none'>(
    initialDate ? 'today' : 'today'
  );
  const [customDateString, setCustomDateString] = useState(
    initialDate ? new Date(initialDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predefinedCategories = ['Work', 'Personal', 'Design', 'Dev'];

  const resolveDueDate = (): string | null => {
    const now = new Date();
    if (dateOption === 'today') {
      return now.toISOString();
    }
    if (dateOption === 'tomorrow') {
      const tom = new Date(now);
      tom.setDate(tom.getDate() + 1);
      return tom.toISOString();
    }
    if (dateOption === 'nextWeek') {
      const next = new Date(now);
      next.setDate(next.getDate() + 7);
      return next.toISOString();
    }
    if (dateOption === 'none') {
      return null;
    }
    if (customDateString) {
      return new Date(customDateString).toISOString();
    }
    return now.toISOString();
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const finalCategory = isCustomCat && customCategory.trim() ? customCategory.trim() : category;
      const dueDate = resolveDueDate();

      await createTask({
        title: title.trim(),
        description: description.trim(),
        category: finalCategory,
        priority,
        status,
        dueDate,
      });

      navigation.goBack();
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <Text style={[styles.screenTitle, { color: colors.text }]}>New Task</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {error && (
            <View style={[styles.errorBanner, { backgroundColor: colors.dangerBg, borderColor: colors.danger }]}>
              <AlertCircle size={18} color={colors.danger} style={{ marginRight: 8 }} />
              <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
            </View>
          )}

          {/* Form Card */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* Title */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.inputBorder, backgroundColor: colors.inputBg }]}
                placeholder="What needs to be done?"
                placeholderTextColor={colors.textSubtle}
                value={title}
                onChangeText={(val) => {
                  setTitle(val);
                  setError(null);
                }}
                maxLength={200}
              />
            </View>

            {/* Description */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Description (Optional)</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { color: colors.text, borderColor: colors.inputBorder, backgroundColor: colors.inputBg },
                ]}
                placeholder="Add details, notes, or subtasks..."
                placeholderTextColor={colors.textSubtle}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Priority Selector */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
              <View style={styles.segmentedRow}>
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => {
                  const isSelected = priority === p;
                  return (
                    <TouchableOpacity
                      key={p}
                      activeOpacity={0.7}
                      onPress={() => setPriority(p)}
                      style={[
                        styles.segmentBtn,
                        {
                          backgroundColor: isSelected
                            ? p === 'high'
                              ? colors.danger
                              : p === 'medium'
                              ? colors.warning
                              : colors.success
                            : colors.borderLight,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          {
                            color: isSelected ? '#FFFFFF' : colors.textMuted,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {p.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Status Selector */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Initial Status</Text>
              <View style={styles.segmentedRow}>
                {(['todo', 'in_progress', 'done'] as TaskStatus[]).map((s) => {
                  const isSelected = status === s;
                  const label = s === 'todo' ? 'To Do' : s === 'in_progress' ? 'In Progress' : 'Done';
                  return (
                    <TouchableOpacity
                      key={s}
                      activeOpacity={0.7}
                      onPress={() => setStatus(s)}
                      style={[
                        styles.segmentBtn,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.borderLight,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          {
                            color: isSelected ? '#FFFFFF' : colors.textMuted,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Category Selector */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Category</Text>
              <View style={styles.chipsWrap}>
                {predefinedCategories.map((cat) => {
                  const isSelected = !isCustomCat && category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      activeOpacity={0.7}
                      onPress={() => {
                        setCategory(cat);
                        setIsCustomCat(false);
                      }}
                      style={[
                        styles.catChip,
                        {
                          backgroundColor: isSelected ? colors.primaryLight : colors.borderLight,
                          borderColor: isSelected ? colors.primary : 'transparent',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.catChipText,
                          { color: isSelected ? colors.primary : colors.textMuted },
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Due Date Presets */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Due Date</Text>
              <View style={styles.segmentedRow}>
                {[
                  { key: 'today' as const, label: 'Today' },
                  { key: 'tomorrow' as const, label: 'Tomorrow' },
                  { key: 'nextWeek' as const, label: 'Next Week' },
                  { key: 'none' as const, label: 'No Date' },
                ].map((opt) => {
                  const isSelected = dateOption === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      activeOpacity={0.7}
                      onPress={() => setDateOption(opt.key)}
                      style={[
                        styles.segmentBtn,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.borderLight,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          {
                            color: isSelected ? '#FFFFFF' : colors.textMuted,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
              style={[styles.cancelBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCreate}
              disabled={loading}
              style={[styles.createBtn, { backgroundColor: colors.primary }]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.createBtnText}>Create Task</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingVertical: 12,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  closeBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13.5,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 14.5,
  },
  textArea: {
    height: 80,
    paddingTop: 10,
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 12.5,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14.5,
    fontWeight: '600',
  },
  createBtn: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
});
