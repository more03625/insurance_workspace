import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/PageHeader';
import LoadingSpinner from '../../components/LoadingSpinner';
import { listPolicies, purchasePolicy } from '../../services/policyService';

function generatePolicyNumber() {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
  return `POL-${year}-${seq}`;
}

function addYears(date, years) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function toInputDate(date) {
  return date.toISOString().split('T')[0];
}

const STEPS = { FORM: 'form', PAYMENT: 'payment', SUCCESS: 'success', FAILURE: 'failure' };

export default function PolicyPurchase() {
  const { policyMasterId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [policyMaster, setPolicyMaster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(STEPS.FORM);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date();
  const [form, setForm] = useState({
    start_date: toInputDate(today),
    end_date: toInputDate(addYears(today, 1)),
    premium_paid: '',
  });

  useEffect(() => {
    listPolicies()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const found = list.find((p) => p.id === policyMasterId);
        if (found) {
          setPolicyMaster(found);
          setForm((prev) => ({ ...prev, premium_paid: String(found.base_premium) }));
        }
      })
      .catch((err) => toast.error(err.message || 'Failed to load policy'))
      .finally(() => setLoading(false));
  }, [policyMasterId]);

  const handleProceedToPayment = () => {
    if (!form.start_date || !form.end_date || !form.premium_paid) {
      toast.error('Please fill all fields');
      return;
    }
    if (new Date(form.end_date) <= new Date(form.start_date)) {
      toast.error('End date must be after start date');
      return;
    }
    setStep(STEPS.PAYMENT);
  };

  const handlePayment = async (success) => {
    if (!success) {
      setStep(STEPS.FAILURE);
      return;
    }

    setSubmitting(true);
    try {
      await purchasePolicy({
        user_id: user.id,
        policy_master_id: policyMasterId,
        policy_number: generatePolicyNumber(),
        start_date: form.start_date,
        end_date: form.end_date,
        premium_paid: parseFloat(form.premium_paid),
      });
      setStep(STEPS.SUCCESS);
    } catch (err) {
      toast.error(err.message || 'Purchase failed');
      setStep(STEPS.FAILURE);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading policy details..." />;

  if (!policyMaster) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-lg font-semibold text-gray-900">Policy not found</h2>
        <p className="mt-1 text-sm text-gray-500">The policy you&apos;re looking for doesn&apos;t exist.</p>
        <button onClick={() => navigate('/portal/browse')} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          Browse Policies
        </button>
      </div>
    );
  }

  /* ---- Step: Success ---- */
  if (step === STEPS.SUCCESS) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Payment Successful!</h2>
        <p className="mt-2 text-sm text-gray-500">
          Your <span className="font-medium text-gray-700">{policyMaster.name}</span> policy has been purchased successfully.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Premium paid: <span className="font-semibold text-gray-900">₹{Number(form.premium_paid).toLocaleString('en-IN')}</span>
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button onClick={() => navigate('/portal/policies')} className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            View My Policies
          </button>
          <button onClick={() => navigate('/portal')} className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  /* ---- Step: Failure ---- */
  if (step === STEPS.FAILURE) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Payment Failed</h2>
        <p className="mt-2 text-sm text-gray-500">
          Your payment could not be processed. No amount has been charged.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button onClick={() => setStep(STEPS.PAYMENT)} className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            Retry Payment
          </button>
          <button onClick={() => navigate('/portal/browse')} className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Browse Policies
          </button>
        </div>
      </div>
    );
  }

  /* ---- Step: Payment Gateway (Mock) ---- */
  if (step === STEPS.PAYMENT) {
    return (
      <>
        <PageHeader title="Payment" subtitle="Complete your policy purchase" />
        <div className="mx-auto max-w-lg">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Gateway header */}
            <div className="rounded-t-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-white">
              <p className="text-xs font-medium uppercase tracking-wide opacity-80">InsureClaim Payment Gateway</p>
              <p className="mt-1 text-2xl font-bold">₹{Number(form.premium_paid).toLocaleString('en-IN')}</p>
            </div>

            {/* Order summary */}
            <div className="space-y-3 border-b border-gray-100 px-6 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Policy</span>
                <span className="font-medium text-gray-900">{policyMaster.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type</span>
                <span className="font-medium text-gray-900">{policyMaster.policy_type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium text-gray-900">
                  {new Date(form.start_date).toLocaleDateString()} — {new Date(form.end_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Policyholder</span>
                <span className="font-medium text-gray-900">{user.first_name} {user.last_name}</span>
              </div>
            </div>

            {/* Mock payment actions */}
            <div className="px-6 py-5">
              <p className="mb-4 rounded-lg bg-yellow-50 p-3 text-center text-xs font-medium text-yellow-700">
                This is a mock payment gateway for demo purposes. Choose an outcome below.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => handlePayment(true)}
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : 'Pay — Success'}
                </button>
                <button
                  onClick={() => handlePayment(false)}
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Pay — Failure
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep(STEPS.FORM)}
            className="mt-4 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            &larr; Back to details
          </button>
        </div>
      </>
    );
  }

  /* ---- Step: Form ---- */
  return (
    <>
      <PageHeader
        title={`Purchase: ${policyMaster.name}`}
        subtitle={`${policyMaster.policy_type} insurance plan`}
        action={
          <button onClick={() => navigate('/portal/browse')} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            &larr; Back to Policies
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Policy info card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-1">
          <h3 className="text-sm font-semibold text-gray-900">Plan Details</h3>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-xs text-gray-500">Plan Name</p>
              <p className="text-sm font-medium text-gray-900">{policyMaster.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="text-sm font-medium text-gray-900">{policyMaster.policy_type}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Base Premium</p>
              <p className="text-lg font-bold text-gray-900">₹{Number(policyMaster.base_premium).toLocaleString('en-IN')}<span className="text-sm font-normal text-gray-500">/year</span></p>
            </div>
            {policyMaster.description && (
              <div>
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm text-gray-700">{policyMaster.description}</p>
              </div>
            )}
            {policyMaster.coverage_details && (
              <div>
                <p className="text-xs text-gray-500">Coverage</p>
                <p className="text-sm text-gray-700">{policyMaster.coverage_details}</p>
              </div>
            )}
          </div>
        </div>

        {/* Purchase form */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Purchase Details</h3>
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-500">Purchasing as</p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="start_date" className="mb-1 block text-sm font-medium text-gray-700">Start Date<span className="ml-0.5 text-red-500">*</span></label>
                <input
                  id="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={(e) => {
                    const sd = e.target.value;
                    setForm((p) => ({
                      ...p,
                      start_date: sd,
                      end_date: toInputDate(addYears(new Date(sd), 1)),
                    }));
                  }}
                  min={toInputDate(today)}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="end_date" className="mb-1 block text-sm font-medium text-gray-700">End Date<span className="ml-0.5 text-red-500">*</span></label>
                <input
                  id="end_date"
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
                  min={form.start_date}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="premium_paid" className="mb-1 block text-sm font-medium text-gray-700">Premium Amount (₹)<span className="ml-0.5 text-red-500">*</span></label>
              <input
                id="premium_paid"
                type="number"
                value={form.premium_paid}
                onChange={(e) => setForm((p) => ({ ...p, premium_paid: e.target.value }))}
                min="0"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-400">Base premium: ₹{Number(policyMaster.base_premium).toLocaleString('en-IN')}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleProceedToPayment}
                className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
