import React from 'react';
import {
  ArrowUpRight,
  Building2,
  ChevronDown,
  Search,
} from 'lucide-react';

const statusStyles = {
  high_fit: 'bg-emerald-50 text-emerald-700',
  medium_fit: 'bg-amber-50 text-amber-700',
  low_fit: 'bg-rose-50 text-rose-700',
  insufficient_data: 'bg-slate-100 text-slate-600',
  not_assessed: 'bg-slate-100 text-slate-600',
};

const formatStatus = (status) => {
  if (!status) return 'Not assessed';

  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const LeadTable = ({
  leads,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onViewLead,
}) => {
  const filteredLeads = leads.filter((lead) => {
    const searchText = search.toLowerCase();

    const matchesSearch = [
      lead.companyName,
      lead.website,
      lead.industry,
    ].some((value) =>
      (value || '').toLowerCase().includes(searchText)
    );

    const status =
      lead.qualification?.qualificationStatus || 'not_assessed';

    const matchesStatus =
      statusFilter === 'all' || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold">Your leads</h3>
          <p className="mt-1 text-sm text-slate-500">
            Search companies and review their qualification status.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search companies..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-56"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm outline-none focus:border-blue-500 sm:w-48"
            >
              <option value="all">All statuses</option>
              <option value="high_fit">High fit</option>
              <option value="medium_fit">Medium fit</option>
              <option value="low_fit">Low fit</option>
              <option value="insufficient_data">Insufficient data</option>
              <option value="not_assessed">Not assessed</option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
          <Building2 size={30} className="text-slate-400" />

          <p className="mt-3 font-semibold">
            {leads.length === 0 ? 'No leads yet' : 'No matching leads'}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {leads.length === 0
              ? 'Add your first company to start qualifying leads.'
              : 'Try changing your search or qualification filter.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Company</th>
                <th className="px-5 py-4 font-semibold">Industry</th>
                <th className="px-5 py-4 font-semibold">Employees</th>
                <th className="px-5 py-4 font-semibold">Score</th>
                <th className="px-5 py-4 font-semibold">Qualification</th>
                <th className="px-5 py-4 font-semibold">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => {
                const status =
                  lead.qualification?.qualificationStatus ||
                  'not_assessed';

                const score = lead.qualification?.confirmedScore;

                return (
                  <tr
                    key={lead._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {lead.companyName || 'Unnamed company'}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {lead.website || 'No website provided'}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {lead.industry || '—'}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {lead.employeeCount ?? '—'}
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold">
                        {typeof score === 'number' ? score : '—'}
                      </span>

                      {typeof score === 'number' && (
                        <span className="text-slate-400"> / 100</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusStyles[status] ||
                          statusStyles.not_assessed
                        }`}
                      >
                        {formatStatus(status)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => onViewLead(lead)}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        View <ArrowUpRight size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="border-t border-slate-200 px-5 py-4 text-xs text-slate-500">
        Showing {filteredLeads.length} of {leads.length} leads
      </div>
    </section>
  );
};

export default LeadTable;