import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ResourceProvider } from './context/ResourceContext';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import AdminPortal from './pages/AdminPortal';
import AdminGuard from './components/common/AdminGuard';
import './App.css';

function App() {
  return (
    <ResourceProvider>
      <Router>
        <div className="min-h-screen bg-[#0B0F19] text-slate-100">
          <Navbar /> {/* completely static, no props needed */}
          
          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              
              {/* 🔒 When someone visits /admin, the Guard wakes up and challenges them */}
              <Route 
                path="/admin" 
                element={
                  <AdminGuard>
                    <AdminPortal />
                  </AdminGuard>
                } 
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ResourceProvider>
  );
}

export default App;