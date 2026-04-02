import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import Pricing from './pages/Pricing';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/results/:id" element={<Results />} />
                <Route path="/pricing" element={<Pricing />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
