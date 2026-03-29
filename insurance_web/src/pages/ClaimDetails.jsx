import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { listClaims } from '../services/claimService';
import { USER_ROLES } from '../constants/enums';

export default function ClaimDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);

  const claimsPath = user?.role === USER_ROLES.POLICYHOLDER ? '/portal/claims' : '/admin/claims';

  useEffect(() => {
    listClaims()
      .then((data) => {
        const found = (Array.isArray(data) ? data : []).find((c) => c.id === id);
        setClaim(found || null);
      })
      .catch((err) => toast.error(err.message || 'Failed to load claim'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading claim details..." />;

  if (!claim) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-lg font-semibold text-gray-900">Claim not found</h2>
        <p className="mt-1 text-sm text-gray-500">The claim you're looking for doesn't exist.</p>
        <button onClick={() => navigate(claimsPath)} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          Back to Claims
        </button>
      </div>
    );
  }

  const details = [
    { label: 'Claim Number', value: claim.claim_number },
    { label: 'Status', value: <StatusBadge status={claim.claim_status} /> },
    { label: 'Estimated Loss', value: claim.estimated_loss_amount != null ? `₹${Number(claim.estimated_loss_amount).toLocaleString('en-IN')}` : '—' },
    { label: 'Policy ID', value: claim.user_policy_id?.slice(0, 12) + '...' },
    { label: 'Claimant ID', value: claim.claimant_id?.slice(0, 12) + '...' },
    { label: 'Loss ID', value: claim.loss_id ? claim.loss_id.slice(0, 12) + '...' : '—' },
    { label: 'Verified By', value: claim.verified_by_id || '—' },
    { label: 'Verified At', value: claim.verified_at ? new Date(claim.verified_at).toLocaleString() : '—' },
    { label: 'Filed On', value: claim.created_at ? new Date(claim.created_at).toLocaleString() : '—' },
  ];

  return (
    <>
      <PageHeader
        title={`Claim: ${claim.claim_number}`}
        subtitle="Detailed claim information"
        action={
          <button onClick={() => navigate(claimsPath)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Back to Claims
          </button>
        }
      />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <dl className="divide-y divide-gray-100">
          {details.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-6 py-4">
              <dt className="text-sm font-medium text-gray-500">{label}</dt>
              <dd className="text-sm font-semibold text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
