import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Navbar from './components/NavBar';
import DashboardPage from './pages/DashboardPage';
import LeadDetailPage from './pages/LeadDetailPage';
import OutreachEditor from './components/OutreachEditor';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/leads/:id" element={<LeadDetailPage />} />
            <Route path="/outreach" element={<OutreachEditor />} />
            {/* Redirect unknown routes to the dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;