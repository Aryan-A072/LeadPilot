// import { NavLink } from 'react-router-dom';
// import { Bot, LayoutDashboard } from 'lucide-react';

// const Navbar = () => {
//   return (
//     <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
//       <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
//         {/* Brand */}
//         <NavLink to="/" className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
//             <Bot size={23} />
//           </div>

//           <div>
//             <h1 className="text-lg font-bold tracking-tight text-slate-900">
//               LeadPilot
//             </h1>
//             <p className="hidden text-xs text-slate-500 sm:block">
//               AI Lead Qualification & Outreach
//             </p>
//           </div>
//         </NavLink>

//         {/* Navigation */}
//         <NavLink
//           to="/"
//           end
//           className={({ isActive }) =>
//             `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
//               isActive
//                 ? 'bg-blue-50 text-blue-700'
//                 : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
//             }`
//           }
//         >
//           <LayoutDashboard size={18} />
//           Dashboard
//         </NavLink>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;


import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Bot,
  LayoutDashboard,
  Users,
  Target,
  Mail,
  Plus,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard, end: true },
  { label: 'All Leads', path: '/leads', icon: Users },
  { label: 'Qualification', path: '/qualification', icon: Target },
  { label: 'AI Outreach', path: '/outreach', icon: Mail },
];

const Navbar = ({ onAddLead }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-700'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const handleAddLead = () => {
    setMenuOpen(false);

    if (onAddLead) {
      onAddLead();
    } else {
      navigate('/leads/new');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <NavLink
          to="/"
          className="flex shrink-0 items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Bot size={23} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              LeadPilot
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              AI Lead Copilot
            </p>
          </div>
        </NavLink>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={linkClass}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleAddLead}
            className="hidden items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:flex"
          >
            <Plus size={17} />
            Add Lead
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map(({ label, path, icon: Icon, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={linkClass}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={handleAddLead}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:hidden"
            >
              <Plus size={18} />
              Add Lead
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;