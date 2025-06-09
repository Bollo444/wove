import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext'; // Placeholder
// import { User } from '@shared/types/user'; // Assuming shared User type

// Dummy user data for placeholder
const dummyUser = {
  id: '123',
  firstName: 'Alex',
  lastName: 'Wove',
  displayName: 'AlexW',
  email: 'alex.wove@example.com',
  bio: 'Loves creating interactive stories and exploring new worlds. Favorite genres: Sci-Fi and Fantasy.',
  // preferences: { notifications: true, theme: 'dark' } // Example
};

const UserSettingsForm: React.FC = () => {
  // const { user, updateUserProfile, changePassword } = useAuth(); // Placeholder
  const user = dummyUser; // Using dummy data

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '', // Email might not be changeable or require re-verification
    bio: '',
    // Add other settings like notification preferences, theme, etc.
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        displayName: user.displayName || '',
        email: user.email || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    setIsProfileLoading(true);
    // Placeholder for profile update logic
    console.log('Updating profile with:', formData);
    // try {
    //   await updateUserProfile(formData);
    //   setProfileSuccess('Profile updated successfully!');
    // } catch (err: any) {
    //   setProfileError(err.message || 'Failed to update profile.');
    // } finally {
    //   setIsProfileLoading(false);
    // }
    setTimeout(() => {
      // Simulate API call
      setIsProfileLoading(false);
      setProfileError('Profile update functionality not yet implemented.');
    }, 1000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setIsPasswordLoading(true);
    // Placeholder for password change logic
    console.log('Changing password...');
    // try {
    //   await changePassword(passwordData.currentPassword, passwordData.newPassword);
    //   setPasswordSuccess('Password changed successfully!');
    //   setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    // } catch (err: any) {
    //   setPasswordError(err.message || 'Failed to change password.');
    // } finally {
    //   setIsPasswordLoading(false);
    // }
    setTimeout(() => {
      // Simulate API call
      setIsPasswordLoading(false);
      setPasswordError('Password change functionality not yet implemented.');
    }, 1000);
  };

  if (!user) {
    return (
      <div className="text-center p-8" data-oid="7kwx7k2">
        Please log in to view settings.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6" data-oid="x7:t62.">
      <h1 className="text-3xl font-bold text-gray-800 mb-8" data-oid="sy55blh">
        Account Settings
      </h1>

      {/* Profile Information Form */}
      <section className="mb-12 p-6 bg-white rounded-lg shadow-xl" data-oid="6ik96cs">
        <h2 className="text-xl font-semibold text-gray-700 mb-4" data-oid="x6xli-z">
          Profile Information
        </h2>
        {profileError && (
          <p className="text-red-500 text-sm mb-4" data-oid="t7nfdun">
            {profileError}
          </p>
        )}
        {profileSuccess && (
          <p className="text-green-500 text-sm mb-4" data-oid="70ssgfk">
            {profileSuccess}
          </p>
        )}
        <form onSubmit={handleProfileSubmit} data-oid="k:r37gl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-oid="u.712mn">
            <div data-oid="-0jqj81">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
                data-oid="lipvuku"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleProfileChange}
                className="input-field"
                disabled={isProfileLoading}
                data-oid="j7g3ci9"
              />
            </div>
            <div data-oid=".ivamgs">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
                data-oid="p:7z7ji"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleProfileChange}
                className="input-field"
                disabled={isProfileLoading}
                data-oid="b_fs19:"
              />
            </div>
          </div>
          <div className="mb-4" data-oid=":ha:8-3">
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700 mb-1"
              data-oid="do_sr32"
            >
              Display Name
            </label>
            <input
              type="text"
              name="displayName"
              id="displayName"
              value={formData.displayName}
              onChange={handleProfileChange}
              className="input-field"
              disabled={isProfileLoading}
              data-oid="7kb6jyo"
            />
          </div>
          <div className="mb-4" data-oid="50-:-ta">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
              data-oid="tl-e_mn"
            >
              Email (cannot be changed)
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              readOnly
              className="input-field bg-gray-100 cursor-not-allowed"
              data-oid="cb8b036"
            />
          </div>
          <div className="mb-6" data-oid="-o3zdz-">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
              data-oid="-jr2fq3"
            >
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              rows={4}
              value={formData.bio}
              onChange={handleProfileChange}
              className="input-field"
              disabled={isProfileLoading}
              data-oid="fhk.ve5"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isProfileLoading}
            className="btn-primary"
            data-oid="hnm19f-"
          >
            {isProfileLoading ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </form>
      </section>

      {/* Change Password Form */}
      <section className="p-6 bg-white rounded-lg shadow-xl" data-oid="qzf2_eh">
        <h2 className="text-xl font-semibold text-gray-700 mb-4" data-oid="-mg6cvu">
          Change Password
        </h2>
        {passwordError && (
          <p className="text-red-500 text-sm mb-4" data-oid="7cvyyc2">
            {passwordError}
          </p>
        )}
        {passwordSuccess && (
          <p className="text-green-500 text-sm mb-4" data-oid="6siimg_">
            {passwordSuccess}
          </p>
        )}
        <form onSubmit={handlePasswordSubmit} data-oid="9v20.fy">
          <div className="mb-4" data-oid="na7sfk_">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
              data-oid="48r5lj4"
            >
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="input-field"
              disabled={isPasswordLoading}
              data-oid="w4uo8.b"
            />
          </div>
          <div className="mb-4" data-oid="b.hjoq1">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
              data-oid="6110izy"
            >
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="input-field"
              disabled={isPasswordLoading}
              data-oid="ieb7x-9"
            />
          </div>
          <div className="mb-6" data-oid="m0vl3ae">
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
              data-oid="6bl-539"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              id="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              className="input-field"
              disabled={isPasswordLoading}
              data-oid="ipevyx8"
            />
          </div>
          <button
            type="submit"
            disabled={isPasswordLoading}
            className="btn-primary"
            data-oid="7tc14y_"
          >
            {isPasswordLoading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default UserSettingsForm;
