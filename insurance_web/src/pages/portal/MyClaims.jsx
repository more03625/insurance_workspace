import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { getUserPolicies } from '../../services/policyService';
import { listClaims } from '../../services/claimService';

export default function MyClaims() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const userPolicies = await getUserPolicies(user.id);
        const policyIds = new Set(
          (Array.isArray(userPolicies) ? userPolicies : []).map((p) => p.id)
        );
        const allClaims = await listClaims();
        setClaims(
          (Array.isArray(allClaims) ? allClaims : []).filter(
            (c) => policyIds.has(c.user_policy_id)
          )
        );
      } catch (err) {
        toast.error(err.message || 'Failed to load claims');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user.id]);

  const columns = [
    { key: 'claim_number', label: 'Claim #' },
    { key: 'claim_status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'estimated_loss_amount', label: 'Amount', render: (val) => (val != null ? `₹${Number(val).toLocaleString('en-IN')}` : '—') },
    { key: 'created_at', label: 'Filed On', render: (val) => (val ? new Date(val).toLocaleDateString() : '—') },
  ];

  return (
    <>
      <PageHeader
        title="My Claims"
        subtitle={`${claims.length} claim(s) filed`}
        action={
          <button onClick={() => navigate('/portal/fnol')} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            + File New Claim
          </button>
        }
      />
      <DataTable
        columns={columns}
        data={claims}
        loading={loading}
        emptyMessage="You haven't filed any claims yet."
        onRowClick={(row) => navigate(`/portal/claims/${row.id}`)}
      />
    </>
  );
}
