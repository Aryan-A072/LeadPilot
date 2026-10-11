import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createLead } from '../services/leadServices.js';

const initialFormData = {
  companyName: '',
  website: '',
  industry: '',
  employeeCount: '',
  supportAutomationNeed: '',
  hasRelevantContact: '',
};

const LeadForm = ({ onClose, onLeadCreated }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const employeeCount =
      formData.employeeCount.trim() === ''
        ? undefined
        : Number(formData.employeeCount);

    if (
      employeeCount !== undefined &&
      (!Number.isInteger(employeeCount) || employeeCount < 0)
    ) {
      setError('Employee count must be a non-negative whole number.');
      return;
    }

    const leadData = {
      companyName: formData.companyName.trim(),
      website: formData.website.trim(),
      industry: formData.industry.trim(),
      ...(employeeCount !== undefined && { employeeCount }),
      ...(formData.supportAutomationNeed !== '' && {
        supportAutomationNeed: formData.supportAutomationNeed === 'true',
      }),
      ...(formData.hasRelevantContact !== '' && {
        hasRelevantContact: formData.hasRelevantContact === 'true',
      }),
    };

    try {
      setLoading(true);

      await createLead(leadData);
      await onLeadCreated();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'Failed to create lead. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-form-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 id="lead-form-title" className="text-xl font-bold">
              Add a new lead
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter company details to start qualifying this lead.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="companyName" className="text-sm font-medium">
              Company name *
            </label>
            <input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Acme Technologies"
              className={inputClass}
              required
              maxLength={150}
            />
          </div>

          <div>
            <label htmlFor="website" className="text-sm font-medium">
              Website
            </label>
            <input
              id="website"
              name="website"
              type="text"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className={inputClass}
              maxLength={300}
            />
          </div>

          <div>
            <label htmlFor="industry" className="text-sm font-medium">
              Industry
            </label>
            <input
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="e.g. B2B SaaS"
              className={inputClass}
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="employeeCount" className="text-sm font-medium">
              Number of employees
            </label>
            <input
              id="employeeCount"
              name="employeeCount"
              type="number"
              min="0"
              step="1"
              value={formData.employeeCount}
              onChange={handleChange}
              placeholder="e.g. 50"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="supportAutomationNeed"
              className="text-sm font-medium"
            >
              Support automation need
            </label>
            <select
              id="supportAutomationNeed"
              name="supportAutomationNeed"
              value={formData.supportAutomationNeed}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Unknown</option>
              <option value="true">Reported</option>
              <option value="false">Not reported</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="hasRelevantContact"
              className="text-sm font-medium"
            >
              Relevant contact identified
            </label>
            <select
              id="hasRelevantContact"
              name="hasRelevantContact"
              value={formData.hasRelevantContact}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Unknown</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-700"
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Create lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;