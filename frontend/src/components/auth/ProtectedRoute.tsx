import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppStore } from '../../store/useAppStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  featureName?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, featureName = 'this feature' }) => {
  const { user, loading } = useAuth();
  const { openAuthModal } = useAppStore();

  if (loading) {
    return (
      <div className="protected-gate">
        <div className="card glass text-center" style={{ maxWidth: '480px', margin: '3rem auto', padding: '2.5rem' }}>
          <h3>[*] Verifying Authentication Session...</h3>
          <p className="card-desc">Connecting to Supabase Auth...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="protected-gate">
        <div className="card glass text-center" style={{ maxWidth: '520px', margin: '3rem auto', padding: '2.5rem' }}>
          <div className="badge badge-warning" style={{ marginBottom: '1rem' }}>
            [!] AUTHENTICATION REQUIRED
          </div>
          <h2 style={{ marginBottom: '0.75rem' }}>Access Restricted</h2>
          <p className="card-desc">
            You must be signed in to access {featureName}, manage custom portfolios, and sync research sessions.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={openAuthModal}>
              [+] Sign In / Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
