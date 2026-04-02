import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, LogIn, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">ResumeAI</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
              Pricing
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors flex items-center gap-1">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    navigate('/');
                  }}
                  className="flex items-center gap-2 text-slate-600 hover:text-red-600 font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
