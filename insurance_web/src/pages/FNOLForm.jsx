import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import FormField from '../components/FormField';
import LoadingSpinner from '../components/LoadingSpinner';
import { createClaimant } from '../services/claimantService';
import { createClaim } from '../services/claimService';
import { getUserPolicies } from '../services/policyService';
import { LOSS_TYPES, USER_ROLES } from '../constants/enums';

const INITIAL_STATE = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  relationship_to_insured: '',
  user_id: '',
  user_policy_id: '',
  claim_number: '',
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
    if (!form.claim_number.trim()) errs.claim_number = 'Claim number is required';
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setSubmitting(true);
    try {
      const claimant = await createClaimant({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        relationship_to_insured: form.relationship_to_insured,
      });

      await createClaim({
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

      toast.success('Claim filed successfully!');
      navigate(isPolicyholder ? '/portal/claims' : '/admin/claims');
    } catch (err) {
      toast.error(err.message || 'Failed to submit claim');
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabels = ['Claimant Info', 'Policy & Claim', 'Loss Details'];

  return (
    <>
      <PageHeader title="File a Claim (FNOL)" subtitle="First Notice of Loss — create a new insurance claim" />

      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-2">
        {stepLabels.map((label, i) => {
          const num = i + 1;
          const active = step === num;
          const done = step > num;
          return (
            <div key={num} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  done ? 'bg-indigo-600 text-white' : active ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {done ? '✓' : num}
              </div>
              <span className={`text-sm font-medium ${active ? 'text-indigo-700' : 'text-gray-500'}`}>{label}</span>
              {i < stepLabels.length - 1 && <div className="mx-2 h-px w-8 bg-gray-300" />}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Step 1 */}
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="First Name" name="first_name" value={form.first_name} onChange={handleChange} error={errors.first_name} required />
            <FormField label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} error={errors.last_name} required />
            <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required />
            <FormField label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} required />
            <FormField label="Relationship to Insured" name="relationship_to_insured" type="select" value={form.relationship_to_insured} onChange={handleChange} error={errors.relationship_to_insured} required options={['Self', 'Spouse', 'Child', 'Parent', 'Other']} />
          </div>
        )}

        {/* Step 2 */}
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
            <FormField label="Claim Number" name="claim_number" value={form.claim_number} onChange={handleChange} error={errors.claim_number} required placeholder="e.g. CLM-2026-001" />
            <FormField label="Estimated Loss Amount (₹)" name="estimated_loss_amount" type="number" value={form.estimated_loss_amount} onChange={handleChange} error={errors.estimated_loss_amount} required />
          </div>
        )}

        {/* Step 3 */}
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

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          {step > 1 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Back
            </button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <button type="button" onClick={handleNext} className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Next
            </button>
          ) : (
            <button type="submit" disabled={submitting} className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          )}
        </div>
      </form>
    </>
  );
}
