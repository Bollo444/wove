import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, User } from '../../contexts/AuthContext'; // Assuming User type is exported or use a local version

const UserSettingsForm: React.FC = () => {
  const { user, updateUserProfile, changePassword, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    // User in AuthContext might not have firstName, lastName, bio.
    // These fields are often part of a separate UserProfile object in more complex apps.
    // For now, let's assume 'username' is the primary display name and 'bio' might be added.
    username: '', // Using username from User context
    bio: '', 
    // email is from user context and read-only here
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
  const [isProfileLoading, setIsProfileLoading] = useState(false); // For profile updates
  const [isPasswordLoading, setIsPasswordLoading] = useState(false); // For password changes

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        // bio: user.bio || '', // Assuming user object might get a bio field
        bio: (user as any).bio || '', // Temporary, if bio is not in User type
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
    
    // Construct the data to update. Based on current User type, only username and potentially new fields like bio.
    // The AuthContext User type doesn't have firstName/lastName.
    // If your API expects these, the User type in AuthContext and its population need adjustment.
    const profileUpdateData: Partial<User> = {
        username: formData.username,
        // bio: formData.bio, // if bio is part of User type
    };
    if (formData.bio) { // Temporary if bio is not strictly in User type
        (profileUpdateData as any).bio = formData.bio;
    }

    updateUserProfile(profileUpdateData)
      .then(() => {
        setProfileSuccess('Profile updated successfully!');
      })
      .catch(err => {
        setProfileError(err.message || 'Failed to update profile.');
      })
      .finally(() => {
        setIsProfileLoading(false);
      });
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

    changePassword(passwordData.currentPassword, passwordData.newPassword)
      .then(() => {
        setPasswordSuccess('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      })
      .catch(err => {
        setPasswordError(err.message || 'Failed to change password.');
      })
      .finally(() => {
        setIsPasswordLoading(false);
      });
  };

  if (authLoading) {
    return <div className="text-center p-8">Loading settings...</div>;
  }

  if (!user) {
    return <div className="text-center p-8">Please log in to view settings.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Account Settings</h1>

      {/* Account Status Section */}
      <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Account Status</h2>
        <div className="space-y-2">
          <p><strong>Email:</strong> {user.email} ({user.isEmailVerified ? <span className="text-green-600">Verified</span> : <span className="text-yellow-600">Not Verified</span>})</p>
          <p><strong>Age Tier:</strong> {user.ageTier.toUpperCase()} ({user.isAgeVerified ? <span className="text-green-600">Verified</span> : <span className="text-yellow-600">Not Verified</span>})</p>
          <p><strong>Role:</strong> {user.role.toUpperCase()}</p>
          {!user.isAgeVerified && (
            <Link href="/verify-age" legacyBehavior>
              <a className="text-purple-600 hover:underline">Verify Your Age Now</a>
            </Link>
          )}
           {user.isAgeVerified && (
            <Link href="/verify-age" legacyBehavior>
              <a className="text-sm text-purple-600 hover:underline">Manage Age Verification</a>
            </Link>
          )}
        </div>
         {user.role === 'parent' && (
          <div className="mt-4">
            <Link href="/parental-controls" legacyBehavior>
              <a className="btn-secondary">View Parental Dashboard</a>
            </Link>
          </div>
        )}
      </section>
      
      {/* Profile Information Form */}
      <section className="mb-12 p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Edit Profile Information</h2>
        {profileError && <p className="text-red-500 text-sm mb-4">{profileError}</p>}
        {profileSuccess && <p className="text-green-500 text-sm mb-4">{profileSuccess}</p>}
        <form onSubmit={handleProfileSubmit}>
          {/* Removed firstName and lastName as they are not in AuthContext.User for now */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username (Display Name)
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleProfileChange}
              className="input-field"
              disabled={isProfileLoading || authLoading}
            />
          </div>
           <div className="mb-4">
            <label htmlFor="email_display" className="block text-sm font-medium text-gray-700 mb-1">
              Email (cannot be changed here)
            </label>
            <input
              type="email"
              name="email_display"
              id="email_display"
              value={user.email} 
              readOnly
              className="input-field bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio (Optional)
            </label>
            <textarea
              name="bio"
              id="bio"
              rows={4}
              value={formData.bio}
              onChange={handleProfileChange}
              className="input-field"
              disabled={isProfileLoading || authLoading}
            ></textarea>
          </div>
          <button type="submit" disabled={isProfileLoading || authLoading} className="btn-primary">
            {isProfileLoading ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </form>
      </section>

      {/* Change Password Form */}
      <section className="p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Change Password</h2>
        {passwordError && <p className="text-red-500 text-sm mb-4">{passwordError}</p>}
        {passwordSuccess && <p className="text-green-500 text-sm mb-4">{passwordSuccess}</p>}
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
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
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
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
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
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
            />
          </div>
          <button type="submit" disabled={isPasswordLoading} className="btn-primary">
            {isPasswordLoading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default UserSettingsForm;
