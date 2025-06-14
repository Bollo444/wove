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
      <div className="text-center p-8" data-oid="a6dg-6i">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500" data-oid=":.na43p">
        Error: {error}
      </div>
    );
  }

  // if (!user) {
  //   return <div className="text-center p-8">Please log in to view the parental control dashboard.</div>;
  // }

  return (
    <div className="space-y-8" data-oid="yujvtbz">
      <h1 className="text-3xl font-bold text-gray-800" data-oid="isg1dvn">
        Parental Control Dashboard
      </h1>

      {/* Linked Child Accounts Section */}
      <section className="p-6 bg-white rounded-lg shadow-xl" data-oid="u:18o3z">
        <h2 className="text-xl font-semibold text-gray-700 mb-4" data-oid=":19jx4.">
          Linked Child Accounts
        </h2>
        {childAccounts.length === 0 ? (
          <p className="text-gray-600" data-oid="12dbabf">
            No child accounts linked yet.
          </p>
        ) : (
          <div className="space-y-4" data-oid="_f5.40t">
            {childAccounts.map(child => (
              <div
                key={child.id}
                className="p-4 border border-gray-200 rounded-md hover:shadow-md transition-shadow"
                data-oid="-g2dhe:"
              >
                <h3 className="text-lg font-medium text-purple-700" data-oid="0fj6r-4">
                  {child.displayName} ({child.ageTier})
                </h3>
                <p className="text-sm text-gray-500" data-oid="4br9wtj">
                  Last Activity: {child.lastActivity}
                </p>
                <p className="text-sm text-gray-500" data-oid="h:83jf9">
                  Time Spent Today: {child.timeSpentToday}
                </p>
                <p className="text-sm text-gray-500" data-oid="i8_orkr">
                  Content Restrictions: {child.contentRestrictions.join(', ') || 'None'}
                </p>
                <div className="mt-2" data-oid="pzkhe4k">
                  <button
                    onClick={() =>
                      handleUpdateChildSettings(child.id, {
                        /* new settings */
                      })
                    }
                    className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 rounded-full"
                    data-oid="tgffvyq"
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
          data-oid="w-l1.aj"
        >
          Link New Child Account
        </button>
      </section>

      {/* Pending Requests Section */}
      <section className="p-6 bg-white rounded-lg shadow-xl" data-oid="d7p6_uf">
        <h2 className="text-xl font-semibold text-gray-700 mb-4" data-oid="chyp704">
          Pending Requests ({pendingRequests.length})
        </h2>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-600" data-oid="cwrobi_">
            No pending requests.
          </p>
        ) : (
          <div className="space-y-4" data-oid="sq.-97g">
            {pendingRequests.map(req => (
              <div
                key={req.id}
                className="p-4 border border-amber-300 bg-amber-50 rounded-md"
                data-oid="rqx3q5r"
              >
                <h3 className="text-lg font-medium text-amber-800" data-oid="o63ar0:">
                  {req.requestType} for {req.childName}
                </h3>
                <p className="text-sm text-gray-700" data-oid="mbdjj5h">
                  {req.details}
                </p>
                <p className="text-xs text-gray-500" data-oid="d3jf3d8">
                  Requested: {req.requestedAt}
                </p>
                <div className="mt-3 space-x-2" data-oid="kvs3wpc">
                  <button
                    onClick={() => handleApproveRequest(req.id)}
                    className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-full"
                    data-oid=".w0af:7"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDenyRequest(req.id)}
                    className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-full"
                    data-oid="rj3:2i:"
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
