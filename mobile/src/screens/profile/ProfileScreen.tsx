import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User as UserIcon,
  Moon,
  Sun,
  LayoutList,
  Columns,
  Calendar,
  Bell,
  Lock,
  LogOut,
  Trash2,
  Edit3,
  Check,
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ConfirmModal } from '../../components/ConfirmModal';
import { EditProfileModal } from './EditProfileModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { formatMemberSince } from '../../utils/dateUtils';
import { UserPreferences } from '../../types';

export const ProfileScreen: React.FC = () => {
  const { user, logout, updatePreferences, deleteAccount } = useAuth();
  const { colors, theme, setThemeMode, isDark } = useTheme();

  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [prefLoading, setPrefLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const userInitials = (user?.name || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const memberSince = formatMemberSince(user?.createdAt);

  const handlePreferenceChange = async (update: Partial<UserPreferences>) => {
    try {
      setPrefLoading(true);
      await updatePreferences(update);
      if (update.theme) {
        setThemeMode(update.theme);
      }
    } catch (e) {
      console.warn('Failed to update preference', e);
    } finally {
      setPrefLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);
      await deleteAccount();
    } catch (e) {
      console.warn('Failed to delete account', e);
    } finally {
      setDeleteLoading(false);
      setDeleteModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatarBox, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{userInitials}</Text>
            </View>

            <View style={styles.profileDetails}>
              <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'User'}</Text>
              <Text style={[styles.userEmail, { color: colors.textMuted }]}>{user?.email}</Text>
              <Text style={[styles.memberSince, { color: colors.textSubtle }]}>{memberSince}</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setEditProfileVisible(true)}
            style={[styles.editProfileBtn, { borderColor: colors.border, backgroundColor: colors.borderLight }]}
          >
            <Edit3 size={15} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.editProfileText, { color: colors.primary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Preferences</Text>

          {/* Theme Option */}
          <View style={styles.prefRow}>
            <View style={styles.prefLabelRow}>
              {isDark ? (
                <Moon size={18} color={colors.primary} style={{ marginRight: 10 }} />
              ) : (
                <Sun size={18} color={colors.warning} style={{ marginRight: 10 }} />
              )}
              <Text style={[styles.prefLabel, { color: colors.text }]}>Theme</Text>
            </View>

            <View style={[styles.segmented, { backgroundColor: colors.borderLight }]}>
              <TouchableOpacity
                onPress={() => handlePreferenceChange({ theme: 'light' })}
                style={[
                  styles.segmentItem,
                  theme === 'light' && [styles.activeSegmentItem, { backgroundColor: colors.card }],
                ]}
              >
                <Sun size={13} color={theme === 'light' ? colors.warning : colors.textMuted} style={{ marginRight: 4 }} />
                <Text style={[styles.segmentText, { color: theme === 'light' ? colors.text : colors.textMuted }]}>
                  Light
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handlePreferenceChange({ theme: 'dark' })}
                style={[
                  styles.segmentItem,
                  theme === 'dark' && [styles.activeSegmentItem, { backgroundColor: colors.card }],
                ]}
              >
                <Moon size={13} color={theme === 'dark' ? colors.primary : colors.textMuted} style={{ marginRight: 4 }} />
                <Text style={[styles.segmentText, { color: theme === 'dark' ? colors.text : colors.textMuted }]}>
                  Dark
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          {/* Default View */}
          <View style={styles.prefRow}>
            <View style={styles.prefLabelRow}>
              <LayoutList size={18} color={colors.primary} style={{ marginRight: 10 }} />
              <Text style={[styles.prefLabel, { color: colors.text }]}>Default View</Text>
            </View>

            <View style={[styles.segmented, { backgroundColor: colors.borderLight }]}>
              <TouchableOpacity
                onPress={() => handlePreferenceChange({ defaultView: 'list' })}
                style={[
                  styles.segmentItem,
                  user?.preferences?.defaultView === 'list' && [
                    styles.activeSegmentItem,
                    { backgroundColor: colors.card },
                  ],
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    {
                      color:
                        user?.preferences?.defaultView === 'list'
                          ? colors.primary
                          : colors.textMuted,
                      fontWeight: user?.preferences?.defaultView === 'list' ? '700' : '500',
                    },
                  ]}
                >
                  List
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handlePreferenceChange({ defaultView: 'board' })}
                style={[
                  styles.segmentItem,
                  user?.preferences?.defaultView === 'board' && [
                    styles.activeSegmentItem,
                    { backgroundColor: colors.card },
                  ],
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    {
                      color:
                        user?.preferences?.defaultView === 'board'
                          ? colors.primary
                          : colors.textMuted,
                      fontWeight: user?.preferences?.defaultView === 'board' ? '700' : '500',
                    },
                  ]}
                >
                  Board
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          {/* Week Starts On */}
          <View style={styles.prefRow}>
            <View style={styles.prefLabelRow}>
              <Calendar size={18} color={colors.primary} style={{ marginRight: 10 }} />
              <Text style={[styles.prefLabel, { color: colors.text }]}>Week Starts</Text>
            </View>

            <View style={[styles.segmented, { backgroundColor: colors.borderLight }]}>
              <TouchableOpacity
                onPress={() => handlePreferenceChange({ weekStartsOn: 'monday' })}
                style={[
                  styles.segmentItem,
                  user?.preferences?.weekStartsOn !== 'sunday' && [
                    styles.activeSegmentItem,
                    { backgroundColor: colors.card },
                  ],
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    {
                      color:
                        user?.preferences?.weekStartsOn !== 'sunday'
                          ? colors.primary
                          : colors.textMuted,
                      fontWeight: user?.preferences?.weekStartsOn !== 'sunday' ? '700' : '500',
                    },
                  ]}
                >
                  Monday
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handlePreferenceChange({ weekStartsOn: 'sunday' })}
                style={[
                  styles.segmentItem,
                  user?.preferences?.weekStartsOn === 'sunday' && [
                    styles.activeSegmentItem,
                    { backgroundColor: colors.card },
                  ],
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    {
                      color:
                        user?.preferences?.weekStartsOn === 'sunday'
                          ? colors.primary
                          : colors.textMuted,
                      fontWeight: user?.preferences?.weekStartsOn === 'sunday' ? '700' : '500',
                    },
                  ]}
                >
                  Sunday
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          {/* Email Reminders */}
          <View style={styles.prefRow}>
            <View style={styles.prefLabelRow}>
              <Bell size={18} color={colors.primary} style={{ marginRight: 10 }} />
              <Text style={[styles.prefLabel, { color: colors.text }]}>Email Reminders</Text>
            </View>

            <Switch
              value={user?.preferences?.emailReminders ?? true}
              onValueChange={(val) => handlePreferenceChange({ emailReminders: val })}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Account & Security Section */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Account & Security</Text>

          {/* Change Password */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setChangePasswordVisible(true)}
            style={styles.actionRow}
          >
            <View style={styles.actionLeft}>
              <Lock size={18} color={colors.text} style={{ marginRight: 10 }} />
              <Text style={[styles.actionText, { color: colors.text }]}>Change Password</Text>
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          {/* Logout */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setLogoutModalVisible(true)}
            style={styles.actionRow}
          >
            <View style={styles.actionLeft}>
              <LogOut size={18} color={colors.danger} style={{ marginRight: 10 }} />
              <Text style={[styles.actionText, { color: colors.danger }]}>Log Out</Text>
            </View>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />

          {/* Delete Account */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setDeleteModalVisible(true)}
            style={styles.actionRow}
          >
            <View style={styles.actionLeft}>
              <Trash2 size={18} color={colors.danger} style={{ marginRight: 10 }} />
              <Text style={[styles.actionText, { color: colors.danger }]}>Delete Account</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={editProfileVisible}
        onClose={() => setEditProfileVisible(false)}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={changePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
      />

      {/* Logout Confirmation */}
      <ConfirmModal
        visible={logoutModalVisible}
        title="Log Out"
        message="Are you sure you want to log out of your TaskFlow account?"
        confirmText="Log Out"
        onConfirm={async () => {
          setLogoutModalVisible(false);
          await logout();
        }}
        onCancel={() => setLogoutModalVisible(false)}
      />

      {/* Delete Account Confirmation */}
      <ConfirmModal
        visible={deleteModalVisible}
        title="Delete Account"
        message="Are you sure you want to permanently delete your account and all associated tasks? This action CANNOT be undone."
        confirmText="Delete Account"
        isDestructive
        loading={deleteLoading}
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  profileDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13.5,
    marginBottom: 2,
  },
  memberSince: {
    fontSize: 12,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
  },
  editProfileText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  prefLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
  },
  segmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  activeSegmentItem: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  segmentText: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14.5,
    fontWeight: '600',
  },
});
