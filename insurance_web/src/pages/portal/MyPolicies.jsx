import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import { getUserPolicies } from '../../services/policyService';

export default function MyPolicies() {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserPolicies(user.id)
      .then((data) => setPolicies(Array.isArray(data) ? data : []))
      .catch((err) => toast.error(err.message || 'Failed to load policies'))
      .finally(() => setLoading(false));
  }, [user.id]);

  const columns = [
    { key: 'policy_number', label: 'Policy #' },
    { key: 'status', label: 'Status', render: (val) => (
      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${val === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {val || 'active'}
      </span>
    )},
    { key: 'premium_paid', label: 'Premium', render: (val) => (val != null ? `₹${Number(val).toLocaleString('en-IN')}` : '—') },
    { key: 'start_date', label: 'Start', render: (val) => (val ? new Date(val).toLocaleDateString() : '—') },
    { key: 'end_date', label: 'End', render: (val) => (val ? new Date(val).toLocaleDateString() : '—') },
  ];

  return (
    <>
      <PageHeader title="My Policies" subtitle={`${policies.length} active policy/policies`} />
      <DataTable columns={columns} data={policies} loading={loading} emptyMessage="No policies found for your account." />
    </>
  );
}
