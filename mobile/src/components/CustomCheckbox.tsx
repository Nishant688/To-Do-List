import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

interface CustomCheckboxProps {
  checked: boolean;
  onPress: () => void;
  size?: number;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onPress,
  size = 22,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.box,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: checked ? colors.primary : colors.border,
          backgroundColor: checked ? colors.primary : colors.card,
        },
      ]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {checked && (
        <Check size={size * 0.65} color="#FFFFFF" strokeWidth={3} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
