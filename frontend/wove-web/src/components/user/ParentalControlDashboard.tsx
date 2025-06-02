import React, { useState, useEffect } from 'react';
import { useAuth, User, ChildAccount, ChildSettings, PendingRequest } from '../../contexts/AuthContext';
import { AgeTier } from '@shared/types/age-tier'; // Still useful for AgeTier.KIDS etc.

const ParentalControlDashboard: React.FC = () => {
  const { user, fetchChildAccounts, fetchPendingRequests, updateChildSettings } = useAuth();
  
  const [childAccounts, setChildAccounts] = useState<ChildAccount[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingChild, setEditingChild] = useState<ChildAccount | null>(null);
  const [currentChildSettings, setCurrentChildSettings] = useState<Partial<ChildSettings>>({});

  useEffect(() => {
    if (user && user.role === 'parent') { // Check for parent role
      setIsLoading(true);
      Promise.all([
        fetchChildAccounts(), // Removed user.id, context function should know parent
        fetchPendingRequests()  // Removed user.id
      ]).then(([children, requests]) => {
        setChildAccounts(children);
        setPendingRequests(requests);
        setError(null); // Clear any previous errors
      }).catch(err => {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || 'Failed to load dashboard data.');
      }).finally(() => {
        setIsLoading(false);
      });
    } else if (user) { // User is logged in but not a parent
      setIsLoading(false);
      setError("You do not have permission to view this page.");
    } else { // No user logged in
        setIsLoading(false);
        // setError("Please log in to view this page."); // Or redirect, handled by page typically
    }
  }, [user, fetchChildAccounts, fetchPendingRequests]);

  const openSettingsModal = (child: ChildAccount) => {
    setEditingChild(child);
    // Ensure currentSettings is not undefined before spreading
    setCurrentChildSettings(child.currentSettings || {}); 
    setShowSettingsModal(true);
  };

  const closeSettingsModal = () => {
    setEditingChild(null);
    setShowSettingsModal(false);
  };

  const handleSettingChange = (settingKey: keyof ChildSettings, value: any) => {
    setCurrentChildSettings(prev => ({ ...prev, [settingKey]: value }));
  };

  const handleTimeLimitChange = (value: string) => {
    setCurrentChildSettings(prev => ({
      ...prev,
      timeLimits: { ...(prev.timeLimits || { dailyMinutes: 0 }), dailyMinutes: parseInt(value,10) || 0 }
    }));
  };

  const handleContentRestrictionToggle = (restriction: string) => {
    setCurrentChildSettings(prev => {
      const currentRestrictions = prev.contentRestrictions || [];
      const newRestrictions = currentRestrictions.includes(restriction)
        ? currentRestrictions.filter(r => r !== restriction)
        : [...currentRestrictions, restriction];
      return { ...prev, contentRestrictions: newRestrictions };
    });
  };


  const handleApproveRequest = (requestId: string) => {
    console.log(`Approving request ${requestId} (placeholder)`);
    // API call to approve request
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    // alert('Request approval functionality not yet implemented.');
  };

  const handleDenyRequest = (requestId: string) => {
    console.log(`Denying request ${requestId} (placeholder)`);
    // API call to deny request
    setPendingRequests(prev => prev.filter(req => req.id !== requestId));
    // alert('Request denial functionality not yet implemented.');
  };

  const handleSaveChildSettings = () => {
    if (!editingChild) return;
    console.log(`Saving settings for child ${editingChild.id}:`, currentChildSettings);
    
    updateChildSettings(editingChild.id, currentChildSettings as ChildSettings)
      .then(() => {
        // Optimistically update local state or re-fetch
        setChildAccounts(prev =>
          prev.map(child =>
            child.id === editingChild!.id
              ? { ...child, currentSettings: currentChildSettings as ChildSettings }
              : child,
          ),
        );
        closeSettingsModal();
      })
      .catch(err => {
        console.error("Error updating child settings:", err);
        // Display error to user in modal or dashboard
        setError("Failed to update settings. Please try again.");
      });
  };

  if (!user) {
     // Handled by page or layout, or show login prompt
    return <div className="text-center p-8">Please log in to access this page.</div>;
  }
  
  if (isLoading) {
    return <div className="text-center p-8">Loading dashboard...</div>;
  }

  if (error) { // This will now catch "No permission" error as well
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }
  
  // Additional check specifically for role if error is more generic
  if (user.role !== 'parent') {
    return <div className="text-center p-8 text-orange-500">You do not have permission to view this page.</div>;
  }


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Parental Control Dashboard</h1>

      {/* Linked Child Accounts Section */}
      <section className="p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Linked Child Accounts</h2>
        {childAccounts.length === 0 ? (
          <p className="text-gray-600">No child accounts linked yet.</p>
        ) : (
          <div className="space-y-4">
            {childAccounts.map(child => (
              <div
                key={child.id}
                className="p-4 border border-gray-200 rounded-md hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-purple-700">
                  {child.displayName} ({child.ageTier})
                </h3>
                <p className="text-sm text-gray-500">Last Activity: {child.lastActivity}</p>
                <p className="text-sm text-gray-500">Time Spent Today: {child.timeSpentToday}</p>
                <p className="text-sm text-gray-500">
                  Content Restrictions: {(child.currentSettings?.contentRestrictions || []).join(', ') || 'None'}
                </p>
                 <p className="text-sm text-gray-500">
                  Collaboration: {child.currentSettings?.collaborationPermissions || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  Story Publishing: {child.currentSettings?.storyPublishingAllowed ? 'Allowed' : 'Disallowed'}
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => openSettingsModal(child)}
                    className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1 rounded-full"
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
        >
          Link New Child Account
        </button>
      </section>

      {/* Pending Requests Section */}
      <section className="p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Pending Requests ({pendingRequests.length})
        </h2>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-600">No pending requests.</p>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map(req => (
              <div key={req.id} className="p-4 border border-amber-300 bg-amber-50 rounded-md">
                <h3 className="text-lg font-medium text-amber-800">
                  {req.requestType} for {req.childName}
                </h3>
                <p className="text-sm text-gray-700">{req.details}</p>
                <p className="text-xs text-gray-500">Requested: {req.requestedAt}</p>
                <div className="mt-3 space-x-2">
                  <button
                    onClick={() => handleApproveRequest(req.id)}
                    className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-full"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDenyRequest(req.id)}
                    className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-full"
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Settings Modal */}
      {showSettingsModal && editingChild && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="relative p-8 bg-white w-full max-w-2xl mx-auto rounded-lg shadow-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Manage Settings for {editingChild.displayName}
            </h3>
            
            {/* Time Limits */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Time Limit (minutes)</label>
              <input
                type="number"
                value={currentChildSettings.timeLimits?.dailyMinutes || 0}
                onChange={e => handleTimeLimitChange(e.target.value)}
                className="input-field w-full"
              />
            </div>

            {/* Content Restrictions - Example: Checkboxes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Restrictions</label>
              {['violence', 'mature_themes', 'horror', 'strong_language'].map(restriction => (
                <div key={restriction} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`restriction-${restriction}`}
                    checked={(currentChildSettings.contentRestrictions || []).includes(restriction)}
                    onChange={() => handleContentRestrictionToggle(restriction)}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <label htmlFor={`restriction-${restriction}`} className="ml-2 text-sm text-gray-700">
                    {restriction.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                </div>
              ))}
            </div>

            {/* Collaboration Permissions */}
            <div className="mb-4">
              <label htmlFor="collaborationPermissions" className="block text-sm font-medium text-gray-700 mb-1">
                Collaboration Permissions
              </label>
              <select
                id="collaborationPermissions"
                value={currentChildSettings.collaborationPermissions || 'blocked'}
                onChange={e => handleSettingChange('collaborationPermissions', e.target.value)}
                className="input-field w-full"
              >
                <option value="blocked">Blocked</option>
                <option value="supervised">Supervised</option>
                <option value="friends_only">Friends Only</option>
                <option value="allowed">Allowed</option>
              </select>
            </div>

            {/* Story Publishing */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Story Publishing</label>
              <div className="flex items-center">
                 <input
                    type="checkbox"
                    id="storyPublishingAllowed"
                    checked={currentChildSettings.storyPublishingAllowed || false}
                    onChange={e => handleSettingChange('storyPublishingAllowed', e.target.checked)}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                <label htmlFor="storyPublishingAllowed" className="ml-2 text-sm text-gray-700">
                  Allow child to publish stories
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button onClick={closeSettingsModal} className="btn-secondary">Cancel</button>
              <button onClick={handleSaveChildSettings} className="btn-primary">Save Changes</button>
            </div>
            <button
                onClick={closeSettingsModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
// .input-field { @apply mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm; }
// .btn-primary { @apply px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50; }
// .btn-secondary {
//   @apply px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500;
// }
export default ParentalControlDashboard;
