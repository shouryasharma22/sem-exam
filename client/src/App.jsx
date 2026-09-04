import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AdminPortal from './pages/AdminPortal';
import AdminGuard from './components/AdminGuard';
import AdminResourcesPage from './pages/AdminResourcePage';
import PyqsPage from './pages/PyqsPage';
import NotesPage from './pages/NotesPage';
import './App.css';
import BooksPage from './pages/BooksPage';
import Footer from './components/Footer';

function App() {
  return (
      <Router>
        <div className="min-h-screen">
          <Navbar /> 

          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />

              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <AdminPortal />
                  </AdminGuard>
                }
              />
              <Route path="/pyqs" element={<PyqsPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route
                path="/admin/resources"
                element={
                  <AdminGuard>
                    <AdminResourcesPage />
                  </AdminGuard>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
     <Footer />
      </Router>
  );
}

export default App;