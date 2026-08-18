import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlignLeft, Check, Clock, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

export type StatType = 'total' | 'completed' | 'pending' | 'overdue';

interface StatCardProps {
  type: StatType;
  count: number;
}

export const StatCard: React.FC<StatCardProps> = ({ type, count = 0 }) => {
  const { colors } = useTheme();

  const configs = {
    total: {
      label: 'Total tasks',
      Icon: AlignLeft,
      bg: colors.statTotalBg,
      iconColor: colors.statTotalIcon,
    },
    completed: {
      label: 'Completed',
      Icon: Check,
      bg: colors.statCompletedBg,
      iconColor: colors.statCompletedIcon,
    },
    pending: {
      label: 'Pending',
      Icon: Clock,
      bg: colors.statPendingBg,
      iconColor: colors.statPendingIcon,
    },
    overdue: {
      label: 'Overdue',
      Icon: AlertTriangle,
      bg: colors.statOverdueBg,
      iconColor: colors.statOverdueIcon,
    },
  };

  const config = configs[type] || configs.total;
  const { Icon } = config;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
        <Icon size={16} color={config.iconColor} strokeWidth={2.5} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: colors.textMuted }]}>
          {config.label}
        </Text>
        <Text style={[styles.count, { color: colors.text }]}>
          {count}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '46%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'space-between',
    minHeight: 104,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  textContainer: {
    marginTop: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  count: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});
