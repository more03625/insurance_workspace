import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { createUser } from '../services/userService';

export default function Signup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/portal" replace />;

  const validate = () => {
    const errs = {};
    if (!form.first_name.trim()) errs.first_name = 'First name is required';
    if (!form.last_name.trim()) errs.last_name = 'Last name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (form.username.length < 3) errs.username = 'Username must be at least 3 characters';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm_password) errs.confirm_password = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await createUser({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        username: form.username,
        password: form.password,
        role: 'policyholder',
      });
      toast.success('Account created! Please sign in.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `block w-full rounded-lg border px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
      errors[field] ? 'border-red-300' : 'border-gray-300'
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg">
            IC
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-1 text-sm text-gray-500">Sign up to get started with InsureClaim</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="mb-1 block text-sm font-medium text-gray-700">First Name<span className="ml-0.5 text-red-500">*</span></label>
                <input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} className={inputClass('first_name')} placeholder="John" />
                {errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name}</p>}
              </div>
              <div>
                <label htmlFor="last_name" className="mb-1 block text-sm font-medium text-gray-700">Last Name<span className="ml-0.5 text-red-500">*</span></label>
                <input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} className={inputClass('last_name')} placeholder="Doe" />
                {errors.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email<span className="ml-0.5 text-red-500">*</span></label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputClass('email')} placeholder="john@example.com" />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">Username<span className="ml-0.5 text-red-500">*</span></label>
              <input id="username" name="username" value={form.username} onChange={handleChange} className={inputClass('username')} placeholder="johndoe" />
              {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">Password<span className="ml-0.5 text-red-500">*</span></label>
              <input id="password" name="password" type="password" value={form.password} onChange={handleChange} className={inputClass('password')} placeholder="Min. 6 characters" />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirm_password" className="mb-1 block text-sm font-medium text-gray-700">Confirm Password<span className="ml-0.5 text-red-500">*</span></label>
              <input id="confirm_password" name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} className={inputClass('confirm_password')} placeholder="Re-enter your password" />
              {errors.confirm_password && <p className="mt-1 text-xs text-red-600">{errors.confirm_password}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
