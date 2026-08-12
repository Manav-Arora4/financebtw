import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp, signInWithOAuth, signInWithOtp, isConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'magic'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        onClose();
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        setMessage('Sign up successful! Please check your email for confirmation.');
      } else if (mode === 'magic') {
        const { error } = await signInWithOtp(email);
        if (error) throw error;
        setMessage('Magic link sent to your email address!');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError(null);
    const { error } = await signInWithOAuth(provider);
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {mode === 'signin' && '[Sign In to FinanceBtw]'}
            {mode === 'signup' && '[Create FinanceBtw Account]'}
            {mode === 'magic' && '[Sign In with Magic Link]'}
          </h3>
          <button className="btn-close" onClick={onClose}>
            [X]
          </button>
        </div>

        {!isConfigured && (
          <div className="alert alert-warning" style={{ margin: '1rem 0' }}>
            <small>
              [!] Supabase keys not detected in <code>.env</code>. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to enable live authentication.
            </small>
          </div>
        )}

        {error && <div className="alert alert-error"><small>{error}</small></div>}
        {message && <div className="alert alert-success"><small>{message}</small></div>}

        {/* OAuth Buttons */}
        <div className="oauth-grid">
          <button
            type="button"
            className="btn btn-oauth"
            onClick={() => handleOAuth('google')}
            disabled={loading}
          >
            [G] Continue with Google
          </button>
          <button
            type="button"
            className="btn btn-oauth"
            onClick={() => handleOAuth('github')}
            disabled={loading}
          >
            [GH] Continue with GitHub
          </button>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode !== 'magic' && (
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Link'}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === 'signin' && (
            <>
              <span>New to FinanceBtw? </span>
              <button className="link-btn" onClick={() => setMode('signup')}>
                Create an account
              </button>
              <span style={{ margin: '0 0.5rem' }}>|</span>
              <button className="link-btn" onClick={() => setMode('magic')}>
                Magic link
              </button>
            </>
          )}
          {mode === 'signup' && (
            <>
              <span>Already have an account? </span>
              <button className="link-btn" onClick={() => setMode('signin')}>
                Sign In
              </button>
            </>
          )}
          {mode === 'magic' && (
            <>
              <span>Remember your password? </span>
              <button className="link-btn" onClick={() => setMode('signin')}>
                Sign In with password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
