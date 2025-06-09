import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext'; // Placeholder
// import { User } from '@shared/types/user'; // Assuming shared User type
// import { AgeTier } from '@shared/types/age-tier'; // Assuming shared AgeTier type

// Dummy data for placeholder
const dummyChildAccounts = [
  {
    id: 'child1',
    displayName: 'Kiddo1',
    ageTier: 'KIDS',
    lastActivity: '2 hours ago',
    timeSpentToday: '45min / 2hr limit',
    contentRestrictions: ['violence', 'mature_themes'],
  },
  {
    id: 'child2',
    displayName: 'Teenager2',
    ageTier: 'TEENS_U16',
    lastActivity: '30 mins ago',
    timeSpentToday: '1hr 15min / 3hr limit',
    contentRestrictions: ['mature_themes'],
  },
];

const dummyPendingRequests = [
  {
    id: 'req1',
    childName: 'Kiddo1',
    requestType: 'Story Publishing',
    details: 'Request to publish "Adventures in Space"',
    requestedAt: new Date(Date.now() - 3600000).toLocaleString(),
  },
  {
    id: 'req2',
    childName: 'Teenager2',
    requestType: 'Collaboration Invite',
    details: 'Request to collaborate on "Mystery Island" with UserX',
    requestedAt: new Date(Date.now() - 7200000).toLocaleString(),
  },
];

const ParentalControlDashboard: React.FC = () => {
  // const { user, fetchChildAccounts, fetchPendingRequests, updateChildSettings } = useAuth(); // Placeholder
  const [childAccounts, setChildAccounts] = useState(dummyChildAccounts);
  const [pendingRequests, setPendingRequests] = useState(dummyPendingRequests);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   if (user) {
  //     setIsLoading(true);
  //     Promise.all([
  //       fetchChildAccounts(user.id),
  //       fetchPendingRequests(user.id)
  //     ]).then(([children, requests]) => {
  //       setChildAccounts(children);
  //       setPendingRequests(requests);
  //     }).catch(err => {
  //       setError(err.message || 'Failed to load dashboard data.');
  //     }).finally(() => {
  //       setIsLoading(false);
  //     });
  //   }
  // }, [user, fetchChildAccounts, fetchPendingRequests]);

  const handleApproveRequest = (requestId: string) => {
    console.log(`Approving request ${requestId} (placeholder)`);
    // API call to approve request
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    alert('Request approval functionality not yet implemented.');
  };

  const handleDenyRequest = (requestId: string) => {
    console.log(`Denying request ${requestId} (placeholder)`);
    // API call to deny request
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    alert('Request denial functionality not yet implemented.');
  };

  const handleUpdateChildSettings = (childId: string, settings: any) => {
    console.log(`Updating settings for child ${childId}:`, settings, '(placeholder)');
    // API call to update settings
    alert('Child settings update functionality not yet implemented.');
  };

  if (isLoading) {
    return (
      <div className="text-center p-8" data-oid="198wv0f">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500" data-oid="1eoac6.">
        Error: {error}
      </div>
    );
  }

  // if (!user) {
  //   return <div className="text-center p-8">Please log in to view the parental control dashboard.</div>;
  // }

  return (
    <div className="space-y-8" data-oid="e8c90fi">
      <h1 className="text-3xl font-bold text-gray-800" data-oid="q95bvsj">
        Parental Control Dashboard
      </h1>

      {/* Linked Child Accounts Section */}
      <section className="p-6 bg-white rounded-lg shadow-xl" data-oid=".nwg84c">
        <h2 className="text-xl font-semibold text-gray-700 mb-4" data-oid="3b22kj6">
          Linked Child Accounts
        </h2>
        {childAccounts.length === 0 ? (
          <p className="text-gray-600" data-oid="an36:v3">
            No child accounts linked yet.
          </p>
        ) : (
          <div className="space-y-4" data-oid="npf60r-">
            {childAccounts.map(child => (
              <div
                key={child.id}
                className="p-4 border border-gray-200 rounded-md hover:shadow-md transition-shadow"
                data-oid="to_-:jh"
              >
                <h3 className="text-lg font-medium text-purple-700" data-oid="pn0wy6a">
                  {child.displayName} ({child.ageTier})
                </h3>
                <p className="text-sm text-gray-500" data-oid="yvg2ku5">
                  Last Activity: {child.lastActivity}
                </p>
                <p className="text-sm text-gray-500" data-oid="jz2tsjg">
                  Time Spent Today: {child.timeSpentToday}
                </p>
                <p className="text-sm text-gray-500" data-oid="dn.vw31">
                  Content Restrictions: {child.contentRestrictions.join(', ') || 'None'}
                </p>
                <div className="mt-2" data-oid=":2ga95n">
                  <button
                    onClick={() =>
                      handleUpdateChildSettings(child.id, {
                        /* new settings */
                      })
                    }
                    className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 rounded-full"
                    data-oid="030q2vb"
                  >
                    Manage Settings
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => alert('Link new child account functionality not implemented.')}
          className="mt-4 btn-secondary text-sm"
          data-oid="pc6akq3"
        >
          Link New Child Account
        </button>
      </section>

      {/* Pending Requests Section */}
      <section className="p-6 bg-white rounded-lg shadow-xl" data-oid="tk7r-06">
        <h2 className="text-xl font-semibold text-gray-700 mb-4" data-oid="wacdcom">
          Pending Requests ({pendingRequests.length})
        </h2>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-600" data-oid="-eultl3">
            No pending requests.
          </p>
        ) : (
          <div className="space-y-4" data-oid="j7um6kf">
            {pendingRequests.map(req => (
              <div
                key={req.id}
                className="p-4 border border-amber-300 bg-amber-50 rounded-md"
                data-oid="v0oljut"
              >
                <h3 className="text-lg font-medium text-amber-800" data-oid="w083yfr">
                  {req.requestType} for {req.childName}
                </h3>
                <p className="text-sm text-gray-700" data-oid="8pbo1f1">
                  {req.details}
                </p>
                <p className="text-xs text-gray-500" data-oid=".mk39iw">
                  Requested: {req.requestedAt}
                </p>
                <div className="mt-3 space-x-2" data-oid="5jcu_qe">
                  <button
                    onClick={() => handleApproveRequest(req.id)}
                    className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-full"
                    data-oid="x:k1.k_"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDenyRequest(req.id)}
                    className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-full"
                    data-oid="q:st658"
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
// .btn-secondary {
//   @apply px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500;
// }
export default ParentalControlDashboard;
