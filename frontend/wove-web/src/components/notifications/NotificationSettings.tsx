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
    <div className="fixed inset-0 z-50 overflow-hidden" data-oid="w1egx._">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        data-oid="ppupn3c"
      />

      {/* Settings Panel */}
      <div
        className="absolute right-0 top-0 h-full w-full max-w-lg bg-surface shadow-xl"
        data-oid="dajurad"
      >
        <div className="flex h-full flex-col" data-oid="cv5k4zn">
          {/* Header */}
          <div className="border-b border-default p-6" data-oid="g9dgbx.">
            <div className="flex items-center justify-between" data-oid="q2mkc65">
              <div data-oid="ugm:3s0">
                <h2 className="text-xl font-semibold text-primary" data-oid="2b79mn7">
                  {content.title}
                </h2>
                <p className="mt-1 text-sm text-secondary" data-oid="0jq6u9d">
                  {content.description}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-secondary hover:text-primary transition-colors p-2"
                data-oid="75fahma"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 overflow-y-auto p-6" data-oid="ajaosic">
            {/* Delivery Methods */}
            <div className="mb-8" data-oid="a1j3zng">
              <h3
                className="text-lg font-medium text-primary mb-4 flex items-center"
                data-oid="6rs6o_."
              >
                📱 Delivery Methods
              </h3>
              <div className="space-y-4" data-oid="._7hhoy">
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  data-oid="vec7gs:"
                >
                  <div data-oid=".vs9v4b">
                    <label className="text-sm font-medium text-primary" data-oid="w84q4-a">
                      Email Notifications
                    </label>
                    <p className="text-xs text-secondary" data-oid="w7g:6n2">
                      Receive notifications via email
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('emailNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      localPreferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    data-oid="8hjy_.6"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localPreferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                      data-oid="pngai8h"
                    />
                  </button>
                </div>

                <div
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  data-oid="1-2p::w"
                >
                  <div data-oid="33yvypl">
                    <label className="text-sm font-medium text-primary" data-oid="1jpn97a">
                      Push Notifications
                    </label>
                    <p className="text-xs text-secondary" data-oid="r9pnq1c">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggle('pushNotifications')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      localPreferences.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    data-oid="czlsi_v"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localPreferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                      data-oid="r-jag5:"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Categories */}
            {Object.entries(content.sections).map(([sectionKey, section]) => (
              <div key={sectionKey} className="mb-8" data-oid="_cj:oor">
                <h3
                  className="text-lg font-medium text-primary mb-4 flex items-center"
                  data-oid="88gus5m"
                >
                  <span className="mr-2" data-oid="-t3l99z">
                    {section.icon}
                  </span>
                  {section.title}
                </h3>
                <div className="space-y-3" data-oid="x3lg9a:">
                  {section.items.map(item => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      data-oid="m6i:u41"
                    >
                      <div className="flex-1" data-oid="v7-_:vp">
                        <label className="text-sm font-medium text-primary" data-oid="d1-z8fz">
                          {item.label}
                        </label>
                        <p className="text-xs text-secondary mt-1" data-oid="u61f8cq">
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
                        data-oid="z069om7"
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            localPreferences[item.key as keyof NotificationPreferences]
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                          data-oid="anyy8i6"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-default p-6" data-oid="2y4pben">
            <div className="flex items-center justify-between" data-oid="cdc9q.6">
              <button
                onClick={handleReset}
                disabled={!hasChanges || saving}
                className="px-4 py-2 text-sm text-secondary hover:text-primary transition-colors disabled:opacity-50"
                data-oid="xhpjtnt"
              >
                Reset
              </button>

              <div className="flex items-center space-x-3" data-oid="fl9vmt-">
                {saved && (
                  <span className="text-sm text-green-600 flex items-center" data-oid="0hwnc:e">
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
                  data-oid="weku2p6"
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
