import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../constants/enums';

function getHomeRoute(role) {
  return role === USER_ROLES.POLICYHOLDER ? '/portal' : '/admin';
}

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to={getHomeRoute(user.role)} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Username and password are required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const userData = await login(form.username, form.password);
      toast.success(`Welcome, ${userData.first_name}!`);
      navigate(getHomeRoute(userData.role), { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg">
            IC
          </div>
          <h1 className="text-2xl font-bold text-gray-900">InsureClaim</h1>
          <p className="mt-1 text-sm text-gray-500">Insurance Claim Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Sign in to your account</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">Username</label>
              <input
                id="username"
                type="text"
                value={form.username}
                onChange={(e) => { setForm((p) => ({ ...p, username: e.target.value })); setError(''); }}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your username"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => { setForm((p) => ({ ...p, password: e.target.value })); setError(''); }}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Demo Credentials</h3>
          <p className="mb-3 text-xs text-gray-400">Click a row to auto-fill the login form.</p>
          <div className="overflow-hidden rounded-lg border border-gray-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-3 py-2 font-medium">Username</th>
                  <th className="px-3 py-2 font-medium">Password</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { username: 'admin_emp', password: 'password@123', role: 'Employee' },
                  { username: 'more03625', password: 'password@123', role: 'Policyholder' },
                  { username: 'johndoe', password: 'password@123', role: 'Policyholder' },
                ].map((cred) => (
                  <tr
                    key={cred.username}
                    onClick={() => { setForm({ username: cred.username, password: cred.password }); setError(''); }}
                    className="cursor-pointer transition-colors hover:bg-indigo-50"
                  >
                    <td className="px-3 py-2 font-mono text-gray-800">{cred.username}</td>
                    <td className="px-3 py-2 font-mono text-gray-800">{cred.password}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${cred.role === 'Employee' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                        {cred.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
