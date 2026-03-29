import { useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import { createUser } from '../services/userService';
import { USER_ROLES } from '../constants/enums';

export default function UserManagement() {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', first_name: '', last_name: '', role: '' });
  const [submitting, setSubmitting] = useState(false);
  const [createdUsers, setCreatedUsers] = useState([]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreate = async () => {
    if (!form.username || !form.email || !form.password || !form.first_name || !form.last_name || !form.role) {
      toast.error('All fields are required');
      return;
    }
    setSubmitting(true);
    try {
      const user = await createUser(form);
      toast.success(`User "${form.username}" created!`);
      setCreatedUsers((prev) => [user, ...prev]);
      setShowCreate(false);
      setForm({ username: '', email: '', password: '', first_name: '', last_name: '', role: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const roleOptions = Object.entries(USER_ROLES).map(([key, value]) => ({
    value,
    label: key.charAt(0) + key.slice(1).toLowerCase(),
  }));

  return (
    <>
      <PageHeader
        title="User Management"
        subtitle="Create and manage system users"
        action={
          <button onClick={() => setShowCreate(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            + Create User
          </button>
        }
      />

      {createdUsers.length > 0 ? (
        <div className="space-y-3">
          {createdUsers.map((u) => (
            <div key={u.id} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{u.first_name} {u.last_name}</p>
                <p className="truncate text-xs text-gray-500">@{u.username} &middot; {u.email} &middot; {u.role}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">Active</span>
                <button onClick={() => { navigator.clipboard.writeText(u.id); toast.success('User ID copied!'); }} className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200">
                  Copy ID
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white py-16 text-center">
          <p className="text-sm text-gray-500">No users created in this session. Click "+ Create User" to get started.</p>
          <p className="mt-1 text-xs text-gray-400">Created users will appear here with their IDs for use in other forms.</p>
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create User">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="First Name" name="first_name" value={form.first_name} onChange={handleChange} required />
            <FormField label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} required />
          </div>
          <FormField label="Username" name="username" value={form.username} onChange={handleChange} required />
          <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <FormField label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
          <FormField label="Role" name="role" type="select" value={form.role} onChange={handleChange} required options={roleOptions} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowCreate(false)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={handleCreate} disabled={submitting} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
