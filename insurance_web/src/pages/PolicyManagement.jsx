import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import FormField from '../components/FormField';
import { listPolicies, createPolicyMaster, purchasePolicy } from '../services/policyService';

export default function PolicyManagement() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', policy_type: '', base_premium: '', coverage_details: '' });
  const [purchaseForm, setPurchaseForm] = useState({ user_id: '', policy_master_id: '', policy_number: '', start_date: '', end_date: '', premium_paid: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadPolicies = () => {
    setLoading(true);
    listPolicies()
      .then((data) => setPolicies(Array.isArray(data) ? data : []))
      .catch((err) => toast.error(err.message || 'Failed to load policies'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPolicies(); }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePurchaseChange = (e) => setPurchaseForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreate = async () => {
    if (!form.name || !form.policy_type || !form.base_premium) {
      toast.error('Name, type, and premium are required');
      return;
    }
    setSubmitting(true);
    try {
      await createPolicyMaster({ ...form, base_premium: parseFloat(form.base_premium) });
      toast.success('Policy created!');
      setShowCreate(false);
      setForm({ name: '', description: '', policy_type: '', base_premium: '', coverage_details: '' });
      loadPolicies();
    } catch (err) {
      toast.error(err.message || 'Failed to create policy');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePurchase = async () => {
    if (!purchaseForm.user_id || !purchaseForm.policy_master_id || !purchaseForm.policy_number || !purchaseForm.start_date || !purchaseForm.end_date || !purchaseForm.premium_paid) {
      toast.error('All fields are required');
      return;
    }
    setSubmitting(true);
    try {
      await purchasePolicy({ ...purchaseForm, premium_paid: parseFloat(purchaseForm.premium_paid) });
      toast.success('Policy purchased!');
      setShowPurchase(false);
      setPurchaseForm({ user_id: '', policy_master_id: '', policy_number: '', start_date: '', end_date: '', premium_paid: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to purchase policy');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Policy Name' },
    { key: 'policy_type', label: 'Type' },
    { key: 'base_premium', label: 'Premium', render: (val) => (val != null ? `₹${Number(val).toLocaleString('en-IN')}` : '—') },
    { key: 'description', label: 'Description', render: (val) => val ? (val.length > 50 ? val.slice(0, 50) + '...' : val) : '—' },
  ];

  return (
    <>
      <PageHeader
        title="Policies"
        subtitle="Manage policy master records and purchase policies for users"
        action={
          <div className="flex gap-2">
            <button onClick={() => setShowPurchase(true)} className="rounded-lg border border-indigo-600 bg-white px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50">
              Purchase Policy
            </button>
            <button onClick={() => setShowCreate(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              + Create Policy
            </button>
          </div>
        }
      />

      <DataTable columns={columns} data={policies} loading={loading} emptyMessage="No policies configured yet." />

      {/* Create policy modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Policy Master">
        <div className="space-y-4">
          <FormField label="Policy Name" name="name" value={form.name} onChange={handleChange} required />
          <FormField label="Policy Type" name="policy_type" type="select" value={form.policy_type} onChange={handleChange} required options={['Health', 'Auto', 'Home', 'Life', 'Travel', 'Commercial']} />
          <FormField label="Base Premium (₹)" name="base_premium" type="number" value={form.base_premium} onChange={handleChange} required />
          <FormField label="Description" name="description" type="textarea" value={form.description} onChange={handleChange} />
          <FormField label="Coverage Details" name="coverage_details" type="textarea" value={form.coverage_details} onChange={handleChange} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowCreate(false)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={handleCreate} disabled={submitting} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Purchase policy modal */}
      <Modal open={showPurchase} onClose={() => setShowPurchase(false)} title="Purchase Policy for User" wide>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="User ID (UUID)" name="user_id" value={purchaseForm.user_id} onChange={handlePurchaseChange} required placeholder="Policyholder UUID" />
          <FormField
            label="Policy"
            name="policy_master_id"
            type="select"
            value={purchaseForm.policy_master_id}
            onChange={handlePurchaseChange}
            required
            options={policies.map((p) => ({ value: p.id, label: `${p.name} (₹${Number(p.base_premium).toLocaleString('en-IN')})` }))}
          />
          <FormField label="Policy Number" name="policy_number" value={purchaseForm.policy_number} onChange={handlePurchaseChange} required placeholder="e.g. POL-2026-001" />
          <FormField label="Premium Paid (₹)" name="premium_paid" type="number" value={purchaseForm.premium_paid} onChange={handlePurchaseChange} required />
          <FormField label="Start Date" name="start_date" type="date" value={purchaseForm.start_date} onChange={handlePurchaseChange} required />
          <FormField label="End Date" name="end_date" type="date" value={purchaseForm.end_date} onChange={handlePurchaseChange} required />
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={() => setShowPurchase(false)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={handlePurchase} disabled={submitting} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
            {submitting ? 'Processing...' : 'Purchase'}
          </button>
        </div>
      </Modal>
    </>
  );
}
