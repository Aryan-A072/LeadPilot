import React from 'react';

const ScoreBreakdown = ({ qualification }) => {
  if (!qualification) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold">Qualification results</h3>
        <p className="mt-2 text-sm text-slate-500">
          This lead has not been assessed yet.
        </p>
      </div>
    );
  }

  const {
    confirmedScore,
    evidenceCoverage,
    qualificationStatus,
    breakdown,
    missingEvidence,
    scoringNote,
  } = qualification;

  const statusColors = {
    high_fit: 'bg-emerald-50 text-emerald-700',
    medium_fit: 'bg-amber-50 text-amber-700',
    low_fit: 'bg-rose-50 text-rose-700',
    insufficient_data: 'bg-slate-100 text-slate-600',
  };

  const formatLabel = (value) =>
    String(value)
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const formatStatus = (value) =>
    value ? formatLabel(value) : 'Not assessed';

  const breakdownItems =
    breakdown && typeof breakdown === 'object'
      ? Object.entries(breakdown)
      : [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h3 className="text-lg font-bold">Qualification results</h3>
          <p className="mt-1 text-sm text-slate-500">
            Review the score and available supporting evidence.
          </p>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1.5 text-sm font-semibold ${
            statusColors[qualificationStatus] ||
            'bg-slate-100 text-slate-600'
          }`}
        >
          {formatStatus(qualificationStatus)}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Confirmed score</p>
          <p className="mt-2 text-3xl font-bold">
            {typeof confirmedScore === 'number'
              ? `${confirmedScore}/100`
              : '—'}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Evidence coverage</p>
          <p className="mt-2 text-3xl font-bold">
            {typeof evidenceCoverage === 'number'
              ? `${evidenceCoverage}%`
              : '—'}
          </p>

          {typeof evidenceCoverage === 'number' && (
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{
                  width: `${Math.max(0, Math.min(100, evidenceCoverage))}%`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      {breakdownItems.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold">Scoring breakdown</h4>

          <div className="mt-3 divide-y divide-slate-100">
            {breakdownItems.map(([criterion, value]) => (
              <div
                key={criterion}
                className="flex items-start justify-between gap-4 py-3 text-sm"
              >
                <span className="text-slate-600">
                  {formatLabel(criterion)}
                </span>

                <span className="text-right font-medium text-slate-800">
                  {typeof value === 'object' && value !== null
                    ? JSON.stringify(value)
                    : String(value ?? '—')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h4 className="font-semibold">Missing evidence</h4>

        {Array.isArray(missingEvidence) && missingEvidence.length > 0 ? (
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-600">
            {missingEvidence.map((item, index) => (
              <li key={`${item}-${index}`}>{String(item)}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            No missing evidence reported.
          </p>
        )}
      </div>

      {scoringNote && (
        <p className="mt-5 rounded-xl bg-blue-50 p-3 text-sm leading-6 text-blue-800">
          {scoringNote}
        </p>
      )}
    </section>
  );
};

export default ScoreBreakdown;