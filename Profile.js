import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors }
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm
  } = useForm();

  const newPassword = watch('newPassword');

  const onProfileSubmit = async (data) => {
    try {
      const result = await updateProfile(data);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      const result = await changePassword(data.currentPassword, data.newPassword);
      if (result.success) {
        setIsChangingPassword(false);
        resetPasswordForm();
      }
    } catch (error) {
      console.error('Password change error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account information and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-outline text-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">First Name</label>
                  <p className="text-gray-900">{user?.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Name</label>
                  <p className="text-gray-900">{user?.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Member Since</label>
                  <p className="text-gray-900">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      type="text"
                      className={`input-field pl-10 ${profileErrors.firstName ? 'border-red-500' : ''}`}
                      {...registerProfile('firstName', {
                        required: 'First name is required'
                      })}
                    />
                  </div>
                  {profileErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    className={`input-field ${profileErrors.lastName ? 'border-red-500' : ''}`}
                    {...registerProfile('lastName', {
                      required: 'Last name is required'
                    })}
                  />
                  {profileErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      className={`input-field pl-10 ${profileErrors.email ? 'border-red-500' : ''}`}
                      {...registerProfile('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                  </div>
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Change Password */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="btn-outline text-sm"
                >
                  Change Password
                </button>
              )}
            </div>

            {!isChangingPassword ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Password</label>
                  <p className="text-gray-900">••••••••</p>
                </div>
                <p className="text-sm text-gray-600">
                  Last changed: {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      className={`input-field pl-10 pr-10 ${passwordErrors.currentPassword ? 'border-red-500' : ''}`}
                      {...registerPassword('currentPassword', {
                        required: 'Current password is required'
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      className={`input-field pl-10 pr-10 ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                      {...registerPassword('newPassword', {
                        required: 'New password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`input-field pl-10 pr-10 ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                      {...registerPassword('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value => value === newPassword || 'Passwords do not match'
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Update Password</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      resetPasswordForm();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
