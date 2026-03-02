'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Settings,
  Bell,
  Lock,
  LogOut,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

export default function SettingsPage() {
  const [schoolInfo, setSchoolInfo] = useState({
    name: 'Sekolah Example',
    contactPerson: 'Ibu Siti Nurhaliza',
    email: 'siti@sekolahexample.edu.id',
    phone: '+62 21 1234 5678',
    address: 'Jl. Pendidikan No. 123, Jakarta',
  })

  const [notifications, setNotifications] = useState({
    benefitUpdates: true,
    eventReminders: true,
    trainingNotifications: true,
    expiryAlerts: true,
    weeklyDigest: true,
  })

  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile')

  const handleSchoolInfoChange = (field: string, value: string) => {
    setSchoolInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string) => {
    // setNotifications((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSaveProfile = () => {
    setSaveMessage({ type: 'success', text: 'School information updated successfully!' })
    setTimeout(() => setSaveMessage(null), 3000)
  }

  const handleSaveNotifications = () => {
    setSaveMessage({ type: 'success', text: 'Notification preferences updated!' })
    setTimeout(() => setSaveMessage(null), 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem('mpp_session')
    window.location.href = '/'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Settings className="text-primary" size={32} />
          Account Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your school account, preferences, and security settings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto">
        {['profile', 'notifications', 'security'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'profile' | 'notifications' | 'security')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Messages */}
      {saveMessage && (
        <Alert className={saveMessage.type === 'success' ? 'border-l-4 border-l-green-500 bg-green-50' : 'border-l-4 border-l-red-500 bg-red-50'}>
          {saveMessage.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription>{saveMessage.text}</AlertDescription>
        </Alert>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <Card className="p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">School Information</h2>

            <div className="space-y-5">
              {/* School Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  School Name
                </label>
                <Input
                  type="text"
                  value={schoolInfo.name}
                  onChange={(e) => handleSchoolInfoChange('name', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Contact Person */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Primary Contact Person
                </label>
                <Input
                  type="text"
                  value={schoolInfo.contactPerson}
                  onChange={(e) => handleSchoolInfoChange('contactPerson', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={schoolInfo.email}
                  onChange={(e) => handleSchoolInfoChange('email', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={schoolInfo.phone}
                  onChange={(e) => handleSchoolInfoChange('phone', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  School Address
                </label>
                <textarea
                  value={schoolInfo.address}
                  onChange={(e) => handleSchoolInfoChange('address', e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                />
              </div>

              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
                onClick={handleSaveProfile}
              >
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card className="p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Bell size={28} />
              Notification Preferences
            </h2>

            <div className="space-y-4">
              {[
                {
                  key: 'benefitUpdates',
                  label: 'Benefit Updates',
                  description: 'Get notified when new benefits become available or when existing benefits change',
                },
                {
                  key: 'eventReminders',
                  label: 'Event Reminders',
                  description:
                    'Receive reminders about upcoming events, competitions, and registrations',
                },
                {
                  key: 'trainingNotifications',
                  label: 'Training Notifications',
                  description:
                    'Updates about your training requests and professional development opportunities',
                },
                {
                  key: 'expiryAlerts',
                  label: 'Benefit Expiry Alerts',
                  description:
                    'Be reminded when your benefits are about to expire so you can claim them in time',
                },
                {
                  key: 'weeklyDigest',
                  label: 'Weekly Digest',
                  description: 'Receive a weekly summary of your account activity and upcoming events',
                },
              ].map((pref) => (
                <div
                  key={pref.key}
                  className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{pref.label}</p>
                    <p className="text-sm text-muted-foreground mt-1">{pref.description}</p>
                  </div>
                  <label className="ml-4 flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[pref.key as keyof typeof notifications]}
                      onChange={() => handleNotificationChange(pref.key)}
                      className="w-5 h-5 accent-primary cursor-pointer"
                    />
                  </label>
                </div>
              ))}

              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
                onClick={handleSaveNotifications}
              >
                Save Preferences
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card className="p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Lock size={28} />
              Security Settings
            </h2>

            <div className="space-y-5">
              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <p className="font-medium text-foreground mb-2">Current Password</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Change your password to keep your account secure
                </p>
                <Button variant="outline">Change Password</Button>
              </div>

              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <p className="font-medium text-foreground mb-2">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>

              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <p className="font-medium text-foreground mb-2">Active Sessions</p>
                <p className="text-sm text-muted-foreground mb-3">
                  You are currently logged in on 1 device. Log out of all other devices to improve security.
                </p>
                <Button variant="outline">Log Out All Other Devices</Button>
              </div>

              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <p className="font-medium text-destructive mb-2">Danger Zone</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Deactivating your account cannot be undone. All your data will be permanently deleted.
                </p>
                <Button variant="outline" className="text-destructive hover:bg-destructive/10 bg-transparent">
                  Deactivate Account
                </Button>
              </div>

              <div className="border-t border-border pt-6 mt-6">
                <p className="text-sm font-medium text-foreground mb-3">
                  Want to log out? You can always log back in later.
                </p>
                <Button
                  onClick={handleLogout}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <LogOut size={18} />
                  Log Out
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
