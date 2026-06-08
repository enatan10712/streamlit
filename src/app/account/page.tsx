'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowLeft, LogOut, User, Mail, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const { logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch {
      toast.error('Failed to log out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-12">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/browse"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-4xl font-bold text-white">Account Settings</h1>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Account Information */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <User className="w-6 h-6" />
            Account Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Email
              </label>
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-white">{user.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Display Name
              </label>
              <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
                {user.displayName || 'Not set'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                User ID
              </label>
              <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm break-all">
                {user.uid}
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Security
          </h2>

          <div className="space-y-4">
            <button className="w-full px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors text-left">
              Change Password
            </button>
            <button className="w-full px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors text-left">
              Two-Factor Authentication
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Preferences</h2>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-white">Email me about new content</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-white">Email me about special offers</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span className="text-white">Allow marketing emails</span>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
            <LogOut className="w-6 h-6" />
            Danger Zone
          </h2>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
