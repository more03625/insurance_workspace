import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import FormField from '../components/FormField';
import LoadingSpinner from '../components/LoadingSpinner';
import { createClaimant } from '../services/claimantService';
import { createClaim } from '../services/claimService';
import { uploadDocument } from '../services/documentService';
import { getUserPolicies } from '../services/policyService';
import { LOSS_TYPES, USER_ROLES } from '../constants/enums';

function generateClaimNumber() {
  const year = new Date().getFullYear();
  const seq = Math.floor(10000 + Math.random() * 90000);
  return `CLM-${year}-${seq}`;
}

const DOC_TYPES = ['Photo', 'Invoice', 'ID Proof', 'FIR Copy', 'Medical Report', 'Repair Estimate', 'Other'];

const INITIAL_STATE = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  relationship_to_insured: '',
  user_id: '',
  user_policy_id: '',
  claim_number: generateClaimNumber(),
  estimated_loss_amount: '',
  loss_date: '',
  loss_type: '',
  loss_cause: '',
  loss_location: '',
  loss_description: '',
};

export default function FNOLForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isPolicyholder = user?.role === USER_ROLES.POLICYHOLDER;
  const [form, setForm] = useState({ ...INITIAL_STATE, user_id: isPolicyholder ? user.id : '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [userPolicies, setUserPolicies] = useState([]);
  const [loadingPolicies, setLoadingPolicies] = useState(false);
  const [documents, setDocuments] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  useEffect(() => {
    const uid = isPolicyholder ? user.id : form.user_id;
    if (!uid) return;
    setLoadingPolicies(true);
    getUserPolicies(uid)
      .then((data) => setUserPolicies(Array.isArray(data) ? data : []))
      .catch(() => setUserPolicies([]))
      .finally(() => setLoadingPolicies(false));
  }, [isPolicyholder, user?.id, form.user_id]);

  const validateStep1 = () => {
    const errs = {};
    if (!form.first_name.trim()) errs.first_name = 'First name is required';
    if (!form.last_name.trim()) errs.last_name = 'Last name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.relationship_to_insured.trim()) errs.relationship_to_insured = 'Relationship is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!isPolicyholder && !form.user_id.trim()) errs.user_id = 'User ID is required';
    if (!form.user_policy_id.trim()) errs.user_policy_id = 'Please select a policy';
    if (!form.estimated_loss_amount) errs.estimated_loss_amount = 'Estimated amount is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!form.loss_date) errs.loss_date = 'Loss date is required';
    if (!form.loss_type) errs.loss_type = 'Loss type is required';
    if (!form.loss_cause.trim()) errs.loss_cause = 'Cause is required';
    if (!form.loss_location.trim()) errs.loss_location = 'Location is required';
    if (!form.loss_description.trim()) errs.loss_description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  // ---- Document helpers ----
  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map((file) => {
      const ext = file.name.split('.').pop().toLowerCase();
      return {
        _localId: crypto.randomUUID(),
        file,
        document_name: file.name,
        document_type: '',
        file_format: ext,
        file_size: file.size,
      };
    });
    setDocuments((prev) => [...prev, ...newDocs]);
    e.target.value = '';
  }, []);

  const updateDocType = useCallback((localId, type) => {
    setDocuments((prev) =>
      prev.map((d) => (d._localId === localId ? { ...d, document_type: type } : d))
    );
  }, []);

  const removeDocument = useCallback((localId) => {
    setDocuments((prev) => prev.filter((d) => d._localId !== localId));
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  // ---- Submit ----
  const handleSubmit = async () => {
    const untyped = documents.filter((d) => !d.document_type);
    if (untyped.length > 0) {
      toast.error('Please select a document type for all attached files.');
      return;
    }

    setSubmitting(true);
    try {
      const claimant = await createClaimant({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        relationship_to_insured: form.relationship_to_insured,
      });

      const claim = await createClaim({
        claim_number: form.claim_number,
        estimated_loss_amount: parseFloat(form.estimated_loss_amount),
        user_policy_id: form.user_policy_id,
        claimant_id: claimant.id,
        loss: {
          loss_date: form.loss_date,
          loss_type: form.loss_type,
          loss_cause: form.loss_cause,
          loss_location: form.loss_location,
          loss_description: form.loss_description,
        },
      });

      if (documents.length > 0) {
        const uploadPromises = documents.map((doc) =>
          uploadDocument({
            document_name: doc.document_name,
            document_type: doc.document_type,
            file_path: `/uploads/${claim.id}/${doc.document_name}`,
            file_format: doc.file_format,
            claim_id: claim.id,
          })
        );
        await Promise.all(uploadPromises);
      }

      const docMsg = documents.length > 0 ? ` with ${documents.length} document(s)` : '';
      toast.success(`Claim filed successfully${docMsg}!`);
      navigate(isPolicyholder ? '/portal/claims' : '/admin/claims');
    } catch (err) {
      toast.error(err.message || 'Failed to submit claim');
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabels = ['Claimant Info', 'Policy & Claim', 'Loss Details', 'Documents'];

  return (
    <>
      <PageHeader title="File a Claim (FNOL)" subtitle="First Notice of Loss — create a new insurance claim" />

      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-1 overflow-x-auto pb-2 sm:mb-8 sm:gap-2">
        {stepLabels.map((label, i) => {
          const num = i + 1;
          const active = step === num;
          const done = step > num;
          return (
            <div key={num} className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold sm:h-8 sm:w-8 sm:text-sm ${
                  done ? 'bg-indigo-600 text-white' : active ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {done ? '✓' : num}
              </div>
              <span className={`hidden text-sm font-medium sm:inline ${active ? 'text-indigo-700' : 'text-gray-500'}`}>{label}</span>
              <span className={`text-xs font-medium sm:hidden ${active ? 'text-indigo-700' : 'text-gray-500'}`}>{label.split(' ')[0]}</span>
              {i < stepLabels.length - 1 && <div className="mx-1 h-px w-4 bg-gray-300 sm:mx-2 sm:w-8" />}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        {/* Step 1 — Claimant */}
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="First Name" name="first_name" value={form.first_name} onChange={handleChange} error={errors.first_name} required />
            <FormField label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} error={errors.last_name} required />
            <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required />
            <FormField label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} required />
            <FormField label="Relationship to Insured" name="relationship_to_insured" type="select" value={form.relationship_to_insured} onChange={handleChange} error={errors.relationship_to_insured} required options={['Self', 'Spouse', 'Child', 'Parent', 'Other']} />
          </div>
        )}

        {/* Step 2 — Policy & Claim */}
        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {!isPolicyholder && (
              <FormField label="User ID (Policyholder UUID)" name="user_id" value={form.user_id} onChange={handleChange} error={errors.user_id} required placeholder="Enter policyholder user ID" />
            )}
            {loadingPolicies ? (
              <div className="flex items-end"><LoadingSpinner message="Loading policies..." /></div>
            ) : (
              <FormField
                label="User Policy"
                name="user_policy_id"
                type="select"
                value={form.user_policy_id}
                onChange={handleChange}
                error={errors.user_policy_id}
                required
                options={userPolicies.map((p) => ({ value: p.id, label: `${p.policy_number} (${p.status})` }))}
              />
            )}
            <FormField label="Claim Number" name="claim_number" value={form.claim_number} onChange={handleChange} disabled />
            <FormField label="Estimated Loss Amount (₹)" name="estimated_loss_amount" type="number" value={form.estimated_loss_amount} onChange={handleChange} error={errors.estimated_loss_amount} required />
          </div>
        )}

        {/* Step 3 — Loss Details */}
        {step === 3 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Loss Date" name="loss_date" type="date" value={form.loss_date} onChange={handleChange} error={errors.loss_date} required />
            <FormField label="Loss Type" name="loss_type" type="select" value={form.loss_type} onChange={handleChange} error={errors.loss_type} required options={LOSS_TYPES} />
            <FormField label="Loss Cause" name="loss_cause" value={form.loss_cause} onChange={handleChange} error={errors.loss_cause} required />
            <FormField label="Loss Location" name="loss_location" value={form.loss_location} onChange={handleChange} error={errors.loss_location} required />
            <div className="sm:col-span-2">
              <FormField label="Loss Description" name="loss_description" type="textarea" rows={4} value={form.loss_description} onChange={handleChange} error={errors.loss_description} required />
            </div>
          </div>
        )}

        {/* Step 4 — Documents */}
        {step === 4 && (
          <div>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-gray-800">Attach Supporting Documents</h3>
              <p className="mt-1 text-sm text-gray-500">
                Upload photos, invoices, ID proofs, FIR copies, or any other supporting documents. This step is optional.
              </p>
            </div>

            {/* File picker */}
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 transition-colors hover:border-indigo-400 hover:bg-indigo-50">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
              </svg>
              <span className="text-sm font-medium text-gray-600">Click to select files</span>
              <input type="file" multiple className="hidden" onChange={handleFileSelect} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" />
            </label>

            {/* Attached documents list */}
            {documents.length > 0 && (
              <div className="mt-4 space-y-3">
                {documents.map((doc) => (
                  <div key={doc._localId} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">{doc.document_name}</p>
                        <p className="text-xs text-gray-500">{doc.file_format.toUpperCase()} — {formatFileSize(doc.file_size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(doc._localId)}
                        className="flex-shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2 pl-[52px]">
                      <select
                        value={doc.document_type}
                        onChange={(e) => updateDocType(doc._localId, e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-auto"
                      >
                        <option value="">Select type</option>
                        {DOC_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                <p className="text-sm text-gray-500">{documents.length} document(s) attached</p>
              </div>
            )}

            {documents.length === 0 && (
              <p className="mt-4 text-center text-sm text-gray-400">No documents attached yet. You can skip this step if not needed.</p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          {step > 1 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Back
            </button>
          ) : (
            <div />
          )}
          {step < 4 ? (
            <button type="button" onClick={handleNext} className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Next
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={submitting} className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
