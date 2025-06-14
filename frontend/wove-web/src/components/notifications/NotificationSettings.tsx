'use client';

import React, { useState, useEffect } from 'react';
import useNotifications, { NotificationPreferences } from '../../hooks/useNotifications';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { ageTier } = useTheme();
  const { preferences, updatePreferences } = useNotifications();
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(preferences);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePreferences(localPreferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLocalPreferences(preferences);
  };

  const getAgeAppropriateContent = () => {
    switch (ageTier) {
      case 'kids':
        return {
          title: '🔔 Notification Settings',
          description: 'Choose what notifications you want to receive!',
          sections: {
            stories: {
              title: '📚 Story Notifications',
              icon: '📖',
              items: [
                {
                  key: 'storyUpdates',
                  label: 'New chapters in my stories',
                  description: 'Get notified when someone adds to your collaborative stories',
                },
              ],
            },
            social: {
              title: '👥 Friend Notifications',
              icon: '🤝',
              items: [
                {
                  key: 'collaborationInvites',
                  label: 'Story collaboration invites',
                  description: 'When friends invite you to write stories together',
                },
              ],
            },
            parental: {
              title: '👨‍👩‍👧‍👦 Parent Notifications',
              icon: '🛡️',
              items: [
                {
                  key: 'parentalAlerts',
                  label: 'Parent approval needed',
                  description: 'When your parent needs to approve something',
                },
              ],
            },
            system: {
              title: '📢 App Updates',
              icon: '🎉',
              items: [
                {
                  key: 'systemAnnouncements',
                  label: 'Fun app updates',
                  description: 'New features and exciting announcements',
                },
              ],
            },
          },
        };
      case 'teens':
        return {
          title: '🔔 Notification Preferences',
          description: 'Customize your notification experience',
          sections: {
            stories: {
              title: '📚 Story Activity',
              icon: '📖',
              items: [
                {
                  key: 'storyUpdates',
                  label: 'Story updates',
                  description: 'New chapters and story activity',
                },
              ],
            },
            social: {
              title: '👥 Social',
              icon: '🤝',
              items: [
                {
                  key: 'collaborationInvites',
                  label: 'Collaboration invites',
                  description: 'Invitations to collaborate on stories',
                },
              ],
            },
            parental: {
              title: '👨‍👩‍👧‍👦 Parental Controls',
              icon: '🛡️',
              items: [
                {
                  key: 'parentalAlerts',
                  label: 'Parental notifications',
                  description: 'Approval requests and safety alerts',
                },
              ],
            },
            system: {
              title: '📢 Platform Updates',
              icon: '🔔',
              items: [
                {
                  key: 'systemAnnouncements',
                  label: 'System announcements',
                  description: 'Platform updates and new features',
                },
              ],
            },
          },
        };
      default:
        return {
          title: '🔔 Notification Settings',
          description: 'Manage your notification preferences',
          sections: {
            stories: {
              title: '📚 Content',
              icon: '📖',
              items: [
                {
                  key: 'storyUpdates',
                  label: 'Story updates',
                  description: "Updates to stories you're following or collaborating on",
                },
              ],
            },
            social: {
              title: '👥 Collaboration',
              icon: '🤝',
              items: [
                {
                  key: 'collaborationInvites',
                  label: 'Collaboration invites',
                  description: 'Invitations to collaborate on projects',
                },
              ],
            },
            system: {
              title: '📢 System',
              icon: '🔔',
              items: [
                {
                  key: 'systemAnnouncements',
                  label: 'System announcements',
                  description: 'Platform updates and important notices',
                },
              ],
            },
          },
        };
    }
  };

  if (!isOpen) return null;

  const content = getAgeAppropriateContent();
  const hasChanges = JSON.stringify(localPreferences) !== JSON.stringify(preferences);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" data-oid="1ytvjvk">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        data-oid="j--fd_6"
      />

      {/* Settings Panel */}
      <div
        className="absolute right-0 top-0 h-full w-full max-w-lg bg-surface shadow-xl"
        data-oid="24csbw4"
      >
        <div className="flex h-full flex-col" data-oid="cx5zm2m">
          {/* Header */}
          <div className="border-b border-default p-6" data-oid="-.nlu4p">
            <div className="flex items-center justify-between" data-oid="yh-t:nu">
              <div data-oid="s.ksv43">
                <h2 className="text-xl font-semibold text-primary" data-oid=".t9uzol">
                  {content.title}
                </h2>
                <p className="mt-1 text-sm text-secondary" data-oid="_z.hca1">
                  {content.description}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-secondary hover:text-primary transition-colors p-2"
                data-oid="bx_pvrc"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 overflow-y-auto p-6" data-oid="71c_q:o">
            {/* Delivery Methods */}
            <div className="mb-8" data-oid="k0rafwt">
              <h3
                className="text-lg font-medium text-primary mb-4 flex items-center"
                data-oid="8k-:ijw"
              >
                📱 Delivery Methods
              </h3>
              <div className="space-y-4" data-oid="9z-r5b:">
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  data-oid="h75i_z1"
                >
                  <div data-oid="x-g::9x">
                    <label className="text-sm font-medium text-primary" data-oid="f3rth.6">
                      Email Notifications
                    </label>
                    <p className="text-xs text-secondary" data-oid="fcldyaf">
                      Receive notifications via email
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('emailNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      localPreferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    data-oid="1_pidl4"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localPreferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                      data-oid="5rrw4gf"
                    />
                  </button>
                </div>

                <div
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  data-oid=":jcdyco"
                >
                  <div data-oid="crtfi68">
                    <label className="text-sm font-medium text-primary" data-oid="koaur3z">
                      Push Notifications
                    </label>
                    <p className="text-xs text-secondary" data-oid="hwv8ha2">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('pushNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      localPreferences.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    data-oid="y2jq56q"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localPreferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                      data-oid="bz76.:6"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Categories */}
            {Object.entries(content.sections).map(([sectionKey, section]) => (
              <div key={sectionKey} className="mb-8" data-oid="dpc85q4">
                <h3
                  className="text-lg font-medium text-primary mb-4 flex items-center"
                  data-oid="dxcibn:"
                >
                  <span className="mr-2" data-oid="u_bl2ik">
                    {section.icon}
                  </span>
                  {section.title}
                </h3>
                <div className="space-y-3" data-oid="mf302q.">
                  {section.items.map(item => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      data-oid="fv_pa1m"
                    >
                      <div className="flex-1" data-oid="k4s3ri2">
                        <label className="text-sm font-medium text-primary" data-oid="9trxemu">
                          {item.label}
                        </label>
                        <p className="text-xs text-secondary mt-1" data-oid="qr-s11b">
                          {item.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggle(item.key as keyof NotificationPreferences)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ml-4 ${
                          localPreferences[item.key as keyof NotificationPreferences]
                            ? 'bg-blue-600'
                            : 'bg-gray-300'
                        }`}
                        data-oid="lvon1a0"
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            localPreferences[item.key as keyof NotificationPreferences]
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                          data-oid="6rqd0ou"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-default p-6" data-oid="y_3w.38">
            <div className="flex items-center justify-between" data-oid="ecxd7p5">
              <button
                onClick={handleReset}
                disabled={!hasChanges || saving}
                className="px-4 py-2 text-sm text-secondary hover:text-primary transition-colors disabled:opacity-50"
                data-oid="7mbgp4m"
              >
                Reset
              </button>

              <div className="flex items-center space-x-3" data-oid="kcl8qi.">
                {saved && (
                  <span className="text-sm text-green-600 flex items-center" data-oid="e:_lt6a">
                    ✓ Saved
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || saving}
                  className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                    hasChanges && !saving
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  data-oid="3jgix30"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
