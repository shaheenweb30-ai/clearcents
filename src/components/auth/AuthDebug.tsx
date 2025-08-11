import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const AuthDebug = () => {
  const { user, session, loading, isEmailVerified } = useAuth();

  return (
    <div className="fixed top-20 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">Auth Debug Info</h3>
      <div className="text-xs space-y-1">
        <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
        <div><strong>User:</strong> {user ? user.email : 'None'}</div>
        <div><strong>Session:</strong> {session ? 'Active' : 'None'}</div>
        <div><strong>Email Verified:</strong> {isEmailVerified ? 'Yes' : 'No'}</div>
        <div><strong>User ID:</strong> {user?.id || 'None'}</div>
        <div><strong>Created At:</strong> {user?.created_at ? new Date(user.created_at).toLocaleString() : 'None'}</div>
      </div>
    </div>
  );
};
