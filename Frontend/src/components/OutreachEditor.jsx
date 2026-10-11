import { useCallback, useEffect, useState } from 'react';
import { Copy, Mail, RefreshCw, Sparkles } from 'lucide-react';
import {
  generateOutreach,
  getOutreachDrafts,
} from '../services/outreachService.js';

const OutreachEditor = ({ leadId }) => {
  const [drafts, setDrafts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchDrafts = useCallback(async () => {
    try {
      const response = await getOutreachDrafts(leadId);
      const items = Array.isArray(response)
        ? response
        : response.drafts ??
          response.data?.drafts ??
          response.data ??
          [];

      setDrafts(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Could not load previous drafts.'
      );
    } finally {
      setLoadingHistory(false);
    }
  }, [leadId]);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setCopied(false);

    try {
      const response = await generateOutreach(leadId);
      const draft =
        response.draft ??
        response.data?.draft ??
        response.data;

      const draftContent =
        typeof draft === 'string' ? draft : draft?.content;

      if (!draftContent) {
        throw new Error('The server did not return draft content.');
      }

      setContent(draftContent);
      await fetchDrafts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to generate the outreach email.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
    } catch {
      setError('Could not copy the draft. Please copy it manually.');
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-violet-100 p-2 text-violet-700">
              <Mail size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              AI Outreach Copilot
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Generate a professional, personalized B2B email for this lead.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <RefreshCw size={17} className="animate-spin" />
          ) : (
            <Sparkles size={17} />
          )}
          {loading ? 'Generating...' : 'Generate email'}
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-6">
        <label
          htmlFor="outreach-content"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Email draft
        </label>

        <textarea
          id="outreach-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Your generated email will appear here..."
          rows={9}
          className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        />

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!content.trim()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Copy size={16} />
            {copied ? 'Copied!' : 'Copy draft'}
          </button>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Review and edit the AI-generated content before sending it.
        </p>
      </div>

      <div className="mt-7 border-t border-slate-100 pt-5">
        <h3 className="font-semibold text-slate-900">Previous drafts</h3>

        {loadingHistory ? (
          <p className="mt-3 text-sm text-slate-500">Loading draft history...</p>
        ) : drafts.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No saved drafts yet. Generate your first email above.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {drafts.map((draft) => (
              <button
                key={draft._id}
                type="button"
                onClick={() => {
                  setContent(draft.content || '');
                  setCopied(false);
                  setError('');
                }}
                className="block w-full rounded-xl border border-slate-200 p-3 text-left transition hover:border-violet-300 hover:bg-violet-50/50"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-800">
                    Outreach draft
                  </span>
                  <span className="text-xs text-slate-500">
                    {draft.createdAt
                      ? new Date(draft.createdAt).toLocaleDateString()
                      : ''}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                  {draft.content}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OutreachEditor;