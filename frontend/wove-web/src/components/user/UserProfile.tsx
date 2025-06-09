import React from 'react';
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
  avatarUrl: 'https://picsum.photos/seed/alexwove/200/200', // Placeholder avatar
  dateOfBirth: new Date('1990-05-15'),
  ageTier: 'ADULTS', // Example
  isEmailVerified: true,
  isAgeVerified: true,
  roles: ['user', 'creator'],
};

interface UserProfileProps {
  userId?: string; // If viewing someone else's profile, or defaults to logged-in user
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  // const { user: loggedInUser } = useAuth(); // Placeholder
  // const profileUser = userId ? fetchUserProfile(userId) : loggedInUser; // Placeholder logic
  const profileUser = dummyUser; // Using dummy data for now

  if (!profileUser) {
    return (
      <div className="text-center p-8" data-oid="briom4.">
        Loading profile... or User not found.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl" data-oid="4inu582">
      <div className="flex flex-col items-center md:flex-row md:items-start" data-oid="_v6m.-l">
        <img
          src={profileUser.avatarUrl || '/default-avatar.png'}
          alt={`${profileUser.displayName}'s avatar`}
          className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-6 border-4 border-purple-300"
          aria-hidden="true" // Decorative if name is present
          data-oid="t3hdmj2"
        />
        <div className="text-center md:text-left" data-oid="iyffj1-">
          <h1 className="text-3xl font-bold text-gray-800" data-oid="5yv48zf">
            {profileUser.displayName}
          </h1>
          <p className="text-md text-gray-600" data-oid="7qp9yld">
            {profileUser.firstName} {profileUser.lastName}
          </p>
          <p className="text-sm text-purple-600" data-oid="zvn-55t">
            {profileUser.email}
          </p>
          {profileUser.isAgeVerified && (
            <span
              className="mt-1 inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full"
              data-oid="6ipbv-t"
            >
              Age Verified ({profileUser.ageTier})
            </span>
          )}
        </div>
      </div>

      {profileUser.bio && (
        <div className="mt-6 pt-6 border-t border-gray-200" data-oid="g48rmbf">
          <h2 className="text-xl font-semibold text-gray-700 mb-2" data-oid="z6va_oz">
            Bio
          </h2>
          <p className="text-gray-600 whitespace-pre-line" data-oid="ip9_otx">
            {profileUser.bio}
          </p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200" data-oid="6i9.p1u">
        <h2 className="text-xl font-semibold text-gray-700 mb-2" data-oid="ae4npnx">
          Account Details
        </h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1" data-oid="da3tswe">
          <li data-oid="_wy4gbw">Email Verified: {profileUser.isEmailVerified ? 'Yes' : 'No'}</li>
          {/* Add more details as needed, e.g., join date, number of stories */}
        </ul>
      </div>

      {/* Placeholder for "Edit Profile" button if it's the logged-in user's profile */}
      {/* {loggedInUser?.id === profileUser.id && ( */}
      <div className="mt-8 text-center" data-oid="40.23cf">
        <button
          onClick={() => alert('Edit profile functionality not implemented.')}
          className="btn-primary px-6 py-2"
          aria-label="Edit your profile"
          data-oid="sft6t2:"
        >
          Edit Profile
        </button>
      </div>
      {/* )} */}
    </div>
  );
};

export default UserProfile;
