import React, { useEffect, useState } from "react";
import {
  Activity,
  Building2,
  CircleAlert,
  LayoutDashboard,
  LoaderCircle,
  Plus,
  Target,
  Users,
  WandSparkles,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

import LeadTable from '../components/LeadTable';
import { getLeads } from '../services/leadServices.js';

import LeadForm from "../components/LeadForm";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddLead, setShowAddLead] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const payload = await getLeads();

      const fetchedLeads = Array.isArray(payload)
        ? payload
        : (payload.leads ?? payload.data?.leads ?? payload.data ?? []);

      if (!Array.isArray(fetchedLeads)) {
        throw new Error("Unexpected response from the leads API.");
      }

      setLeads(fetchedLeads);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Unable to load leads. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const highFitCount = leads.filter(
    (lead) => lead.qualification?.qualificationStatus === "high_fit",
  ).length;

  const assessedCount = leads.filter((lead) =>
    Boolean(lead.qualification?.qualificationStatus),
  ).length;

  const stats = [
    {
      label: "Leads loaded",
      value: leads.length,
      icon: Users,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      label: "High-fit leads",
      value: highFitCount,
      icon: Target,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Assessed leads",
      value: assessedCount,
      icon: Activity,
      iconStyle: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-5 py-7 md:flex">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <WandSparkles size={21} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">LeadPilot</h1>
              <p className="text-xs text-slate-500">Lead intelligence</p>
            </div>
          </div>

          <p className="mb-3 mt-10 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav>
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-3 py-3 font-medium text-blue-700">
              <LayoutDashboard size={19} />
              Dashboard
            </div>
          </nav>

          <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Target size={22} className="mb-3 text-blue-600" />

            <p className="text-sm font-semibold">Find better-fit leads</p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Qualify companies and prepare personalized outreach drafts.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
            <div className="flex items-center gap-2 font-bold md:hidden">
              <WandSparkles className="text-blue-600" size={21} />
              LeadPilot
            </div>

            <p className="hidden text-sm text-slate-500 md:block">
              Workspace /{" "}
              <span className="font-medium text-slate-800">Dashboard</span>
            </p>

            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-500 sm:block">
                AI Lead Copilot
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                LP
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Dashboard
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Manage, qualify, and prepare outreach for your leads.
                </p>
              </div>

              <button
                onClick={() => setShowAddLead(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={18} />
                Add lead
              </button>
            </div>

            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {stats.map(({ label, value, icon: Icon, iconStyle }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {label}
                      </p>

                      <p className="mt-3 text-3xl font-bold tracking-tight">
                        {loading ? "—" : value}
                      </p>
                    </div>

                    <div className={`rounded-xl p-3 ${iconStyle}`}>
                      <Icon size={21} />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <div className="mt-8">
              {loading ? (
                <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-500">
                  <LoaderCircle
                    size={28}
                    className="animate-spin text-blue-600"
                  />
                  <p className="text-sm">Loading your leads...</p>
                </div>
              ) : error ? (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center">
                  <CircleAlert size={30} className="text-rose-500" />

                  <p className="mt-3 font-semibold">Could not load leads</p>

                  <p className="mt-1 max-w-md text-sm text-slate-500">
                    {error}
                  </p>

                  <button
                    onClick={fetchLeads}
                    className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <LeadTable
                  leads={leads}
                  search={search}
                  setSearch={setSearch}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  onViewLead={(lead) => navigate(`/leads/${lead._id}`)}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {showAddLead && (
        <LeadForm
          onClose={() => setShowAddLead(false)}
          onLeadCreated={fetchLeads}
        />
      )}
      
    </div>
  );
};

export default DashboardPage;
