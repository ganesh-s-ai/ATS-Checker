import { FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-400" />
            <span className="font-bold text-xl text-white tracking-tight">ResumeAI</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
