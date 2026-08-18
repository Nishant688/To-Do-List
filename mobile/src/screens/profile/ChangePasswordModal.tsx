import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Lock, AlertCircle, CheckCircle } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
}) => {
  const { updatePassword } = useAuth();
  const { colors } = useTheme();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword) {
      setError('Please provide current password and new password');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await updatePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardView}
          >
            <TouchableWithoutFeedback>
              <View style={[styles.content, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.header}>
                  <Text style={[styles.title, { color: colors.text }]}>Change Password</Text>
                  <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <X size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>

                {error && (
                  <View style={[styles.errorBanner, { backgroundColor: colors.dangerBg, borderColor: colors.danger }]}>
                    <AlertCircle size={16} color={colors.danger} style={{ marginRight: 6 }} />
                    <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
                  </View>
                )}

                {success && (
                  <View style={[styles.errorBanner, { backgroundColor: colors.doneBg, borderColor: colors.success }]}>
                    <CheckCircle size={16} color={colors.success} style={{ marginRight: 6 }} />
                    <Text style={[styles.errorText, { color: colors.doneText }]}>Password changed successfully!</Text>
                  </View>
                )}

                <View style={styles.fieldGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Current Password</Text>
                  <View style={[styles.inputContainer, { borderColor: colors.inputBorder, backgroundColor: colors.inputBg }]}>
                    <Lock size={16} color={colors.textSubtle} style={{ marginRight: 8 }} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Enter current password"
                      placeholderTextColor={colors.textSubtle}
                      value={currentPassword}
                      onChangeText={(val) => {
                        setCurrentPassword(val);
                        setError(null);
                      }}
                      secureTextEntry
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>New Password</Text>
                  <View style={[styles.inputContainer, { borderColor: colors.inputBorder, backgroundColor: colors.inputBg }]}>
                    <Lock size={16} color={colors.textSubtle} style={{ marginRight: 8 }} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="At least 6 characters"
                      placeholderTextColor={colors.textSubtle}
                      value={newPassword}
                      onChangeText={(val) => {
                        setNewPassword(val);
                        setError(null);
                      }}
                      secureTextEntry
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={[styles.label, { color: colors.text }]}>Confirm New Password</Text>
                  <View style={[styles.inputContainer, { borderColor: colors.inputBorder, backgroundColor: colors.inputBg }]}>
                    <Lock size={16} color={colors.textSubtle} style={{ marginRight: 8 }} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Repeat new password"
                      placeholderTextColor={colors.textSubtle}
                      value={confirmNewPassword}
                      onChangeText={(val) => {
                        setConfirmNewPassword(val);
                        setError(null);
                      }}
                      secureTextEntry
                    />
                  </View>
                </View>

                <View style={styles.btnRow}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleClose}
                    style={[styles.cancelBtn, { borderColor: colors.border }]}
                  >
                    <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSubmit}
                    disabled={loading || success}
                    style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.saveText}>Update Password</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  keyboardView: {
    width: '100%',
    maxWidth: 360,
  },
  content: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12.5,
    fontWeight: '500',
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 42,
    fontSize: 14,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1.4,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
