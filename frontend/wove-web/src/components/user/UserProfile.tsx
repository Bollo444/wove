import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

// Removed dummyUser, will use context user

interface UserProfileProps {
  // Assuming this component always shows the logged-in user's profile for now
  // userId?: string; 
}

const UserProfile: React.FC<UserProfileProps> = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center p-8">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center p-8">User not found. Please log in.</div>;
  }

  // Use 'user' from AuthContext as profileUser
  const profileUser = user;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <div className="flex flex-col items-center md:flex-row md:items-start">
        <img
          src={'https://picsum.photos/seed/' + profileUser.id + '/200/200' || '/default-avatar.png'} // Using user ID for a unique placeholder avatar
          alt={`${profileUser.username}'s avatar`}
          className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-6 border-4 border-purple-300"
        />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">{profileUser.username}</h1>
          {/* Assuming User object might not have firstName/lastName directly, username is primary */}
          {/* <p className="text-md text-gray-600">{profileUser.firstName} {profileUser.lastName}</p> */}
          <p className="text-sm text-purple-600 mb-2">{profileUser.email}</p>
          
          <div className="mb-2">
            Role: <span className="font-semibold">{profileUser.role.toUpperCase()}</span>
          </div>

          {profileUser.isAgeVerified ? (
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Age Verified ({profileUser.ageTier.toUpperCase()})
            </span>
          ) : (
            <div className="mt-1">
              <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                Age Not Verified
              </span>
              <Link href="/verify-age" legacyBehavior>
                <a className="text-sm text-purple-600 hover:underline">Verify Now</a>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Bio section could be added if user object has bio */}
      {/* {profileUser.bio && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Bio</h2>
          <p className="text-gray-600 whitespace-pre-line">{profileUser.bio}</p>
        </div>
      )} */}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Account Details</h2>
        <ul className="text-gray-600 space-y-1">
          <li>Email Verified: {profileUser.isEmailVerified ? 'Yes' : 'No'}</li>
          {/* Consider a button/link to re-send verification email if not verified */}
        </ul>
      </div>
      
      <div className="mt-8 space-y-3 md:space-y-0 md:flex md:space-x-3 justify-center">
        <Link href="/settings/profile" legacyBehavior>
          <a className="btn-primary w-full md:w-auto justify-center py-2 px-6">Edit Profile & Settings</a>
        </Link>
        {profileUser.role === 'parent' && (
          <Link href="/parental-controls" legacyBehavior>
            <a className="btn-secondary w-full md:w-auto justify-center py-2 px-6">Parental Dashboard</a>
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
