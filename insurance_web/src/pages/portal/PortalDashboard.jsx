import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { getUserPolicies } from '../../services/policyService';
import { listClaims } from '../../services/claimService';

export default function PortalDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const userPolicies = await getUserPolicies(user.id);
        const policyList = Array.isArray(userPolicies) ? userPolicies : [];
        setPolicies(policyList);

        const policyIds = new Set(policyList.map((p) => p.id));
        const allClaims = await listClaims();
        const myClaims = (Array.isArray(allClaims) ? allClaims : []).filter(
          (c) => policyIds.has(c.user_policy_id)
        );
        setClaims(myClaims);
      } catch (err) {
        toast.error(err.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user.id]);

  const submitted = claims.filter((c) => c.claim_status === 'submitted').length;
  const resolved = claims.filter((c) => ['verified', 'approved', 'settled'].includes(c.claim_status)).length;

  const columns = [
    { key: 'claim_number', label: 'Claim #' },
    { key: 'claim_status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'estimated_loss_amount', label: 'Amount', render: (val) => (val != null ? `₹${Number(val).toLocaleString('en-IN')}` : '—') },
    { key: 'created_at', label: 'Filed', render: (val) => (val ? new Date(val).toLocaleDateString() : '—') },
  ];

  return (
    <>
      <PageHeader
        title={`Welcome, ${user.first_name}!`}
        subtitle="Your insurance overview"
        action={
          <button onClick={() => navigate('/portal/fnol')} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            + File New Claim
          </button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="My Policies" value={policies.length} color="indigo" icon={ShieldIcon} />
        <StatCard label="Open Claims" value={submitted} color="blue" icon={InboxIcon} />
        <StatCard label="Resolved" value={resolved} color="green" icon={CheckIcon} />
      </div>

      <h2 className="mb-3 text-lg font-semibold text-gray-900">My Recent Claims</h2>
      <DataTable
        columns={columns}
        data={claims.slice(0, 10)}
        loading={loading}
        emptyMessage="You haven't filed any claims yet."
        onRowClick={(row) => navigate(`/portal/claims/${row.id}`)}
      />
    </>
  );
}

function ShieldIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function InboxIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-17.5 0V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0111.048 0c1.131.094 1.976 1.057 1.976 2.192V13.5" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
