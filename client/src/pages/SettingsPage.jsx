import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineColorSwatch,
  HiOutlineTranslate,
  HiOutlineInformationCircle,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'profile', label: 'Profile', icon: HiOutlineUser },
  { id: 'security', label: 'Security', icon: HiOutlineLockClosed },
  { id: 'appearance', label: 'Appearance', icon: HiOutlineColorSwatch },
  { id: 'language', label: 'Language', icon: HiOutlineTranslate },
  { id: 'account', label: 'Account', icon: HiOutlineInformationCircle },
];

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors },
  } = useForm();

  const newPassword = watch('newPassword');

  const onProfileSubmit = async (data) => {
    setSaving(true);
    try {
      const result = await authService.updateProfile({ name: data.name });
      if (result.success) {
        updateUser(result.user);
        toast.success('Profile updated successfully');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setSaving(true);
    try {
      const result = await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (result.success) {
        toast.success('Password updated successfully');
        resetPassword();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Settings
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors cursor-pointer
                    ${
                      activeTab === tab.id
                        ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-6 lg:p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                  Profile Information
                </h2>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                    <button className="mt-1 text-xs text-primary-500 hover:text-primary-600 font-medium cursor-pointer">
                      Change avatar
                    </button>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      {...registerProfile('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                    {profileErrors.name && (
                      <p className="mt-1 text-sm text-red-500">{profileErrors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-slate-400">Email cannot be changed</p>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                  Change Password
                </h2>
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-5 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      {...registerPassword('currentPassword', { required: 'Current password is required' })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-500">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      {...registerPassword('newPassword', {
                        required: 'New password is required',
                        minLength: { value: 6, message: 'Must be at least 6 characters' },
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-500">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      {...registerPassword('confirmNewPassword', {
                        required: 'Please confirm new password',
                        validate: (v) => v === newPassword || 'Passwords do not match',
                      })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                    {passwordErrors.confirmNewPassword && (
                      <p className="mt-1 text-sm text-red-500">{passwordErrors.confirmNewPassword.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer disabled:opacity-60"
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                  Appearance
                </h2>
                <div className="max-w-md">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Choose your preferred theme. This setting is saved locally.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => theme !== 'light' && toggleTheme()}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="w-full h-20 rounded-xl bg-white border border-slate-200 mb-3 flex items-center justify-center">
                        <div className="space-y-1.5">
                          <div className="w-16 h-2 bg-slate-200 rounded" />
                          <div className="w-12 h-2 bg-slate-100 rounded" />
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Light</p>
                    </button>
                    <button
                      onClick={() => theme !== 'dark' && toggleTheme()}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="w-full h-20 rounded-xl bg-slate-900 border border-slate-700 mb-3 flex items-center justify-center">
                        <div className="space-y-1.5">
                          <div className="w-16 h-2 bg-slate-700 rounded" />
                          <div className="w-12 h-2 bg-slate-800 rounded" />
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Dark</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Language Tab */}
            {activeTab === 'language' && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                  Language
                </h2>
                <div className="max-w-md">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Select your preferred language. More languages coming soon.
                  </p>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    defaultValue="en"
                  >
                    <option value="en">English</option>
                    <option value="es" disabled>Spanish (Coming Soon)</option>
                    <option value="fr" disabled>French (Coming Soon)</option>
                    <option value="de" disabled>German (Coming Soon)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                  Account Information
                </h2>
                <div className="max-w-md space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Account Status</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Role</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">{user?.role || 'user'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Member Since</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Last Login</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : '—'}
                    </span>
                  </div>

                  {/* Danger Zone */}
                  <div className="mt-8 p-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10">
                    <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">
                      Danger Zone
                    </h3>
                    <p className="text-xs text-red-600 dark:text-red-400/80 mb-3">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="px-4 py-2 rounded-xl text-xs font-semibold border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
