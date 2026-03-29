import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { listClaims } from '../services/claimService';

export default function ClaimsList() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listClaims()
      .then((data) => setClaims(Array.isArray(data) ? data : []))
      .catch((err) => toast.error(err.message || 'Failed to load claims'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'claim_number', label: 'Claim #' },
    {
      key: 'claim_status',
      label: 'Status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'estimated_loss_amount',
      label: 'Amount',
      render: (val) => (val != null ? `₹${Number(val).toLocaleString('en-IN')}` : '—'),
    },
    { key: 'claimant_id', label: 'Claimant ID', render: (val) => (val ? val.slice(0, 8) + '...' : '—') },
    {
      key: 'created_at',
      label: 'Filed On',
      render: (val) => (val ? new Date(val).toLocaleDateString() : '—'),
    },
  ];

  return (
    <>
      <PageHeader
        title="All Claims"
        subtitle={`${claims.length} claim(s) found`}
        action={
          <button onClick={() => navigate('/admin/fnol')} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            + New Claim
          </button>
        }
      />
      <DataTable
        columns={columns}
        data={claims}
        loading={loading}
        emptyMessage="No claims have been filed yet."
        onRowClick={(row) => navigate(`/admin/claims/${row.id}`)}
      />
    </>
  );
}
