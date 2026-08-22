import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileCard } from '../components/profile/ProfileCard';
import { PreferencesCard } from '../components/profile/PreferencesCard';
import { AccountCard } from '../components/profile/AccountCard';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { ChangePasswordModal } from '../components/profile/ChangePasswordModal';
import { DeleteAccountModal } from '../components/profile/DeleteAccountModal';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-7 max-w-3xl animate-in fade-in duration-200">

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Profile & Settings
      </h1>

      <ProfileCard onEditProfile={() => setIsEditProfileOpen(true)} />

      <PreferencesCard />

      <AccountCard
        onChangePassword={() => setIsChangePasswordOpen(true)}
        onLogout={handleLogout}
        onDeleteAccount={() => setIsDeleteAccountOpen(true)}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
      <DeleteAccountModal
        isOpen={isDeleteAccountOpen}
        onClose={() => setIsDeleteAccountOpen(false)}
      />
    </div>
  );
};
