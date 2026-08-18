import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Plus, CornerDownLeft } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

interface QuickAddBarProps {
  onAdd: (title: string) => Promise<any>;
  placeholder?: string;
}

export const QuickAddBar: React.FC<QuickAddBarProps> = ({
  onAdd,
  placeholder = 'Add a task for today...',
}) => {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!title.trim() || loading) return;
    try {
      setLoading(true);
      await onAdd(title.trim());
      setTitle('');
      Keyboard.dismiss();
    } catch (e) {
      console.warn('Quick add error', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.inputWrapper}>
        <Plus size={18} color={colors.primary} strokeWidth={2.5} style={styles.icon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSubtle}
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          editable={!loading}
        />
      </View>

      {title.trim().length > 0 && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleAdd}
          disabled={loading}
          style={[styles.addButton, { backgroundColor: colors.primary }]}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <CornerDownLeft size={14} color="#FFFFFF" strokeWidth={2.5} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    paddingVertical: 8,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
});
