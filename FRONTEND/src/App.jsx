import { useState } from 'react';
import { ResourceProvider } from './context/ResourceContext';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import AdminPortal from './pages/AdminPortal';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('browse');

  return (
    <ResourceProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar activeTab={activeTab} onChangeTab={setActiveTab} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {activeTab === 'browse' ? <Dashboard /> : <AdminPortal />}
        </main>
      </div>
    </ResourceProvider>
  );
}

export default App;
