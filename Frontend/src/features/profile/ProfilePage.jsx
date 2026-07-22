import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Avatar } from '../../components/common/Avatar';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  KeyRound, 
  Upload, 
  Trash2, 
  Save, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export function ProfilePage() {
  const { user, refreshUser } = useAuth();

  // Profile Edit Form State
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  // Avatar Upload State
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setBio(user.bio || '');
    }
  }, [user]);

  // Handle Profile Text Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileSaving(true);

    try {
      await api.updateProfile({ full_name: fullName, bio });
      await refreshUser();
      setProfileMessage({ type: 'success', text: 'Profile information updated successfully!' });
    } catch (err) {
      setProfileMessage({ type: 'error', text: err?.response?.data?.detail || err.message || 'Failed to update profile' });
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle Avatar Selection & Preview
  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setAvatarMessage({ type: 'error', text: 'Invalid file format. Only JPG, PNG, and WEBP images are allowed.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarMessage({ type: 'error', text: 'File size exceeds maximum limit of 5MB.' });
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarMessage(null);
  };

  // Upload Selected Avatar
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setAvatarUploading(true);
    setAvatarMessage(null);

    try {
      await api.uploadAvatar(avatarFile);
      await refreshUser();
      setAvatarFile(null);
      setAvatarPreview(null);
      setAvatarMessage({ type: 'success', text: 'Profile avatar uploaded successfully!' });
    } catch (err) {
      setAvatarMessage({ type: 'error', text: err?.response?.data?.detail || err.message || 'Failed to upload avatar' });
    } finally {
      setAvatarUploading(false);
    }
  };

  // Delete Avatar
  const handleAvatarDelete = async () => {
    setAvatarUploading(true);
    setAvatarMessage(null);

    try {
      await api.deleteAvatar();
      await refreshUser();
      setAvatarFile(null);
      setAvatarPreview(null);
      setAvatarMessage({ type: 'success', text: 'Profile picture removed. Reverted to generated initials.' });
    } catch (err) {
      setAvatarMessage({ type: 'error', text: err?.response?.data?.detail || err.message || 'Failed to remove avatar' });
    } finally {
      setAvatarUploading(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
      return;
    }

    setPasswordSaving(true);

    try {
      await api.changePassword({ current_password: currentPassword, new_password: newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage({ type: 'success', text: 'Security credentials updated successfully!' });
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err?.response?.data?.detail || err.message || 'Failed to change password' });
    } finally {
      setPasswordSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-[1200px] mx-auto p-8 space-y-8 select-none font-sans">
      
      {/* Header Banner */}
      <div className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-6 relative z-10">
          <Avatar user={user} src={avatarPreview || user.profile_picture} size="xl" />
          <div className="space-y-1 font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[var(--accent-cyan)] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/5">
                Researcher Profile
              </span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/5">
                Verified Account
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {user.full_name}
            </h1>
            <p className="text-xs text-[var(--text-muted)] flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </p>
          </div>
        </div>

        <div className="font-mono text-[10px] text-[var(--text-muted)] border-t md:border-t-0 md:border-l border-[var(--border-subtle)] pt-4 md:pt-0 md:pl-6 space-y-1.5">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[var(--accent-indigo)]" />
            <span>Member Since: <strong className="text-[var(--text-primary)]">{formatDate(user.created_at)}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Security: <strong className="text-[var(--text-primary)]">JWT 256-bit Encrypted</strong></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & System Meta (1 Col) */}
        <div className="space-y-8">
          
          {/* Avatar Management Card */}
          <section className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-6 font-mono">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--accent-cyan)]" /> Profile Avatar
              </h3>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Avatar user={user} src={avatarPreview || user.profile_picture} size="xl" />
              </div>

              {avatarMessage && (
                <div className={`w-full p-3 rounded-lg text-xs flex items-start gap-2 border ${
                  avatarMessage.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {avatarMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                  <span>{avatarMessage.text}</span>
                </div>
              )}

              <div className="w-full space-y-2">
                <label className="w-full py-2.5 px-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] hover:border-[var(--accent-indigo)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center justify-center gap-2 cursor-pointer font-bold">
                  <Upload className="w-4 h-4" />
                  <span>Choose Image</span>
                  <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleAvatarSelect} className="hidden" />
                </label>

                {avatarPreview && (
                  <button
                    onClick={handleAvatarUpload}
                    disabled={avatarUploading}
                    className="w-full py-2.5 px-4 rounded-lg bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {avatarUploading ? 'Uploading...' : 'Save Avatar'}
                  </button>
                )}

                {user.profile_picture && (
                  <button
                    onClick={handleAvatarDelete}
                    disabled={avatarUploading}
                    className="w-full py-2 px-4 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Avatar</span>
                  </button>
                )}
              </div>

              <span className="text-[10px] text-[var(--text-muted)] text-center">
                Supported: JPG, PNG, WEBP. Max 5MB. If deleted, initials will be generated automatically.
              </span>
            </div>
          </section>

          {/* Account Telemetry HUD */}
          <section className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4 font-mono text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border-subtle)] pb-3">
              Account Metadata
            </h3>
            
            <div className="space-y-3 text-[11px]">
              <div>
                <span className="text-[var(--text-muted)] block text-[9px] uppercase tracking-wider">Account ID</span>
                <span className="font-bold text-[var(--text-primary)] break-all">{user.id}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block text-[9px] uppercase tracking-wider">Email Status</span>
                <span className="text-emerald-400 font-bold">Verified & Isolated</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block text-[9px] uppercase tracking-wider">Storage Directory</span>
                <span className="text-[var(--text-secondary)] font-mono">uploads/user_{user.id.slice(0, 8)}...</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Editable Profile & Security (2 Cols) */}
        <div className="lg:col-span-2 space-y-8 font-mono">
          
          {/* Edit Profile Form */}
          <section className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--accent-indigo)]" /> Personal Information
              </h3>
            </div>

            {profileMessage && (
              <div className={`p-4 rounded-xl text-xs flex items-start gap-2.5 border ${
                profileMessage.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {profileMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                <span>{profileMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 font-bold">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full px-4 py-3 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-indigo)] transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 font-bold">
                  Email Address (Read Only)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-3 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)]/50 text-[var(--text-muted)] font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 font-bold">
                  Researcher Bio / Academic Affiliation
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your research focus, institutional affiliation, or interests..."
                  className="w-full px-4 py-3 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-indigo)] transition-all font-sans"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-6 py-3 text-xs font-bold rounded-lg bg-[var(--accent-indigo)] hover:bg-[var(--accent-indigo-hover)] text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{profileSaving ? 'Saving Updates...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </section>

          {/* Security & Password Change */}
          <section className="p-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-rose-400" /> Security & Password
              </h3>
            </div>

            {passwordMessage && (
              <div className={`p-4 rounded-xl text-xs flex items-start gap-2.5 border ${
                passwordMessage.type === 'success' 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {passwordMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                <span>{passwordMessage.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 font-bold">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-rose-400 transition-all font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 font-bold">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-3 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-rose-400 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 font-bold">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-4 py-3 text-xs rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-rose-400 transition-all font-sans"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="px-6 py-3 text-xs font-bold rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{passwordSaving ? 'Updating Password...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </section>

        </div>

      </div>

    </div>
  );
}

export default ProfilePage;
