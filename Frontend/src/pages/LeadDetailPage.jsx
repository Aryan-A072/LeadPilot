import React, { useEffect, useState } from 'react';
import { ArrowLeft, LoaderCircle, Target } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { getLeadById, scoreLead } from '../services/leadServices.js';
import ScoreBreakdown from '../components/ScoreBreakdown';

import OutreachEditor from '../components/OutreachEditor';

const unwrapLead = (payload) =>
  payload?.lead ?? payload?.data?.lead ?? payload?.data ?? payload;

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [error, setError] = useState('');
  const [scoreError, setScoreError] = useState('');

  const [icp, setIcp] = useState({
    industry: '',
    minEmployees: '20',
    maxEmployees: '200',
  });

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        setError('');

        const payload = await getLeadById(id);
        const fetchedLead = unwrapLead(payload);

        if (!fetchedLead || !fetchedLead._id) {
          throw new Error('The API returned an unexpected lead response.');
        }

        setLead(fetchedLead);
        setIcp((previous) => ({
          ...previous,
          industry: fetchedLead.industry || previous.industry,
        }));
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            'Unable to load this lead.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  const handleIcpChange = (event) => {
    const { name, value } = event.target;

    setIcp((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleScoreLead = async (event) => {
    event.preventDefault();
    setScoreError('');

    const minEmployees = Number(icp.minEmployees);
    const maxEmployees = Number(icp.maxEmployees);

    if (!icp.industry.trim()) {
      setScoreError('Please enter an industry for your ideal customer profile.');
      return;
    }

    if (
      icp.minEmployees === '' ||
      icp.maxEmployees === '' ||
      !Number.isInteger(minEmployees) ||
      !Number.isInteger(maxEmployees) ||
      minEmployees < 0 ||
      maxEmployees < 0
    ) {
      setScoreError('Enter valid non-negative whole numbers for the employee range.');
      return;
    }

    if (minEmployees > maxEmployees) {
      setScoreError('Minimum employees cannot exceed maximum employees.');
      return;
    }

    try {
      setScoring(true);

      const payload = await scoreLead(id, {
        industry: icp.industry.trim(),
        minEmployees,
        maxEmployees,
      });

      const updatedLead = unwrapLead(payload);

      if (!updatedLead?.qualification) {
        throw new Error(
          'The score request completed, but no qualification result was returned.'
        );
      }

      setLead(updatedLead);
    } catch (err) {
      setScoreError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'Unable to qualify this lead.'
      );
    } finally {
      setScoring(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 text-slate-500">
        <LoaderCircle size={24} className="animate-spin text-blue-600" />
        Loading lead...
      </div>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <button
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </button>

        <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-white p-6">
          <h1 className="text-lg font-bold">Could not load lead</h1>
          <p className="mt-2 text-sm text-rose-700">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </button>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Lead details
              </p>

              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                {lead.companyName}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {lead.website || 'No website provided'}
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600">
              {lead.industry || 'Industry not provided'}
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Employees</p>
              <p className="mt-1 text-lg font-semibold">
                {lead.employeeCount ?? 'Unknown'}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Support automation</p>
              <p className="mt-1 text-lg font-semibold">
                {lead.supportAutomationNeed === true
                  ? 'Reported'
                  : lead.supportAutomationNeed === false
                    ? 'Not reported'
                    : 'Unknown'}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Relevant contact</p>
              <p className="mt-1 text-lg font-semibold">
                {lead.hasRelevantContact === true
                  ? 'Identified'
                  : lead.hasRelevantContact === false
                    ? 'Not identified'
                    : 'Unknown'}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Target size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold">Qualify this lead</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Define your ideal customer profile to assess this company.
                The score is a rule-based fit score, not a conversion probability.
              </p>
            </div>
          </div>

          <form onSubmit={handleScoreLead} className="mt-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="industry" className="text-sm font-medium">
                  Target industry *
                </label>

                <input
                  id="industry"
                  name="industry"
                  value={icp.industry}
                  onChange={handleIcpChange}
                  placeholder="e.g. B2B SaaS"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label htmlFor="minEmployees" className="text-sm font-medium">
                  Minimum employees
                </label>

                <input
                  id="minEmployees"
                  name="minEmployees"
                  type="number"
                  min="0"
                  step="1"
                  value={icp.minEmployees}
                  onChange={handleIcpChange}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label htmlFor="maxEmployees" className="text-sm font-medium">
                  Maximum employees
                </label>

                <input
                  id="maxEmployees"
                  name="maxEmployees"
                  type="number"
                  min="0"
                  step="1"
                  value={icp.maxEmployees}
                  onChange={handleIcpChange}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            {scoreError && (
              <p role="alert" className="mt-4 text-sm text-rose-600">
                {scoreError}
              </p>
            )}

            <button
              type="submit"
              disabled={scoring}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {scoring ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Target size={18} />
              )}
              {scoring ? 'Scoring lead...' : 'Run qualification'}
            </button>
          </form>
        </section>

        <div className="mt-6">
          <ScoreBreakdown qualification={lead.qualification} />
        </div>
      </div>
      <OutreachEditor leadId={id} />
    </main>
  );
};

export default LeadDetailPage;