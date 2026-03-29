import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import { listClaims, verifyClaim } from '../services/claimService';
import { getDocumentsByClaim } from '../services/documentService';
import { CLAIM_STATUS } from '../constants/enums';

export default function SurveyorDashboard() {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const loadClaims = () => {
    setLoading(true);
    listClaims()
      .then((data) => setClaims(Array.isArray(data) ? data : []))
      .catch((err) => toast.error(err.message || 'Failed to load claims'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadClaims(); }, []);

  const openReview = (row) => {
    setSelected(row);
    setStatus('');
    setDocuments([]);
    setLoadingDocs(true);
    getDocumentsByClaim(row.id)
      .then((data) => setDocuments(Array.isArray(data) ? data : []))
      .catch(() => setDocuments([]))
      .finally(() => setLoadingDocs(false));
  };

  const handleVerify = async () => {
    if (!status) {
      toast.error('Please select a status');
      return;
    }

    setSubmitting(true);
    try {
      await verifyClaim(selected.id, user.id, status);
      toast.success(
        `Claim ${selected.claim_number} updated to "${status}" — assessed by ${user.first_name} ${user.last_name}`
      );
      setSelected(null);
      loadClaims();
    } catch (err) {
      toast.error(err.message || 'Verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'claim_number', label: 'Claim #' },
    { key: 'claim_status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'estimated_loss_amount', label: 'Amount', render: (val) => (val != null ? `₹${Number(val).toLocaleString('en-IN')}` : '—') },
    { key: 'created_at', label: 'Filed On', render: (val) => (val ? new Date(val).toLocaleDateString() : '—') },
    {
      key: 'id',
      label: 'Action',
      render: (_, row) => (
        <button
          onClick={(e) => { e.stopPropagation(); openReview(row); }}
          className="rounded-md bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
        >
          Review
        </button>
      ),
    },
  ];

  const statusOptions = [
    { value: CLAIM_STATUS.UNDER_REVIEW, label: 'Under Review' },
    { value: CLAIM_STATUS.VERIFIED, label: 'Verified' },
    { value: CLAIM_STATUS.APPROVED, label: 'Approved' },
    { value: CLAIM_STATUS.REJECTED, label: 'Rejected' },
    { value: CLAIM_STATUS.SETTLED, label: 'Settled' },
  ];

  return (
    <>
      <PageHeader
        title="Surveyor Panel"
        subtitle="Review and verify insurance claims"
      />

      <DataTable
        columns={columns}
        data={claims}
        loading={loading}
        emptyMessage="No claims to review."
      />

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Review Claim: ${selected?.claim_number || ''}`}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-4 text-sm">
              <div><span className="text-gray-500">Status:</span> <StatusBadge status={selected.claim_status} /></div>
              <div><span className="text-gray-500">Amount:</span> <span className="font-medium">₹{Number(selected.estimated_loss_amount).toLocaleString('en-IN')}</span></div>
              <div><span className="text-gray-500">Filed:</span> <span className="font-medium">{new Date(selected.created_at).toLocaleDateString()}</span></div>
              <div><span className="text-gray-500">Loss ID:</span> <span className="font-medium">{selected.loss_id ? selected.loss_id.slice(0, 8) + '...' : '—'}</span></div>
            </div>

            {/* Documents section */}
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-700">Attached Documents</h4>
              {loadingDocs ? (
                <p className="text-sm text-gray-400">Loading documents...</p>
              ) : documents.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                  <p className="text-sm text-gray-400">No documents attached to this claim.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">{doc.document_name}</p>
                        <p className="text-xs text-gray-500">{doc.file_format.toUpperCase()}</p>
                      </div>
                      <span className="flex-shrink-0 rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">{doc.document_type}</span>
                    </div>
                  ))}
                  <p className="text-xs text-gray-500">{documents.length} document(s)</p>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3">
              <p className="text-xs font-medium text-indigo-600">Assessing as</p>
              <p className="mt-0.5 text-sm font-semibold text-indigo-900">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-indigo-700">@{user.username} &middot; {user.role}</p>
            </div>

            <FormField
              label="Update Status"
              name="status"
              type="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              options={statusOptions}
            />

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setSelected(null)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleVerify} disabled={submitting} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
