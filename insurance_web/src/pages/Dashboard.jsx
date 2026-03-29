import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { listClaims } from '../services/claimService';
import { listPolicies } from '../services/policyService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [claimsData, policiesData] = await Promise.all([listClaims(0, 10), listPolicies()]);
        setClaims(Array.isArray(claimsData) ? claimsData : []);
        setPolicies(Array.isArray(policiesData) ? policiesData : []);
      } catch (err) {
        toast.error(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const submitted = claims.filter((c) => c.claim_status === 'submitted').length;
  const verified = claims.filter((c) => c.claim_status === 'verified' || c.claim_status === 'approved').length;

  const columns = [
    { key: 'claim_number', label: 'Claim #' },
    { key: 'claim_status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'estimated_loss_amount', label: 'Est. Amount', render: (val) => (val != null ? `₹${Number(val).toLocaleString('en-IN')}` : '—') },
    { key: 'created_at', label: 'Created', render: (val) => (val ? new Date(val).toLocaleDateString() : '—') },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your insurance claim management system"
        action={
          <button onClick={() => navigate('/admin/claims')} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            View All Claims
          </button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Claims" value={claims.length} color="indigo" icon={ChartIcon} />
        <StatCard label="Submitted" value={submitted} color="blue" icon={InboxIcon} />
        <StatCard label="Verified / Approved" value={verified} color="green" icon={CheckIcon} />
        <StatCard label="Policies" value={policies.length} color="yellow" icon={ShieldIcon} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Recent Claims</h2>
        <DataTable columns={columns} data={claims} loading={loading} emptyMessage="No claims filed yet." onRowClick={(row) => navigate(`/admin/claims/${row.id}`)} />
      </div>
    </>
  );
}

function ChartIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
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

function ShieldIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}
