import { Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleAction = async () => {
    if (!user) {
      await signInWithGoogle();
    } else {
      navigate('/upload');
    }
  };

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-slate-600">Choose the plan that best fits your career goals.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
            <p className="text-slate-500 mb-6">Perfect for a quick check.</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-slate-900">$0</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              {['3 Resume Scans', 'Basic ATS Score', 'Formatting Check', 'Keyword Matching'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button onClick={handleAction} className="w-full py-3 px-4 rounded-xl font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
              {user ? 'Go to Dashboard' : 'Get Started'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-indigo-600 rounded-3xl p-8 border border-indigo-500 shadow-xl flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
            <p className="text-indigo-200 mb-6">For serious job seekers.</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-white">$12</span>
              <span className="text-indigo-200">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              {['Unlimited Scans', 'Advanced AI Suggestions', 'Bullet Point Rewriter', 'Industry Keyword Database', 'Priority Support'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button onClick={handleAction} className="w-full py-3 px-4 rounded-xl font-bold text-indigo-600 bg-white hover:bg-indigo-50 transition-colors shadow-sm">
              Upgrade to Pro
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Premium</h3>
            <p className="text-slate-500 mb-6">The ultimate career toolkit.</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-slate-900">$29</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              {['Everything in Pro', 'Full Resume Rewrite', 'Cover Letter Generator', 'LinkedIn Profile Analysis', '1-on-1 Expert Review'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button onClick={handleAction} className="w-full py-3 px-4 rounded-xl font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
