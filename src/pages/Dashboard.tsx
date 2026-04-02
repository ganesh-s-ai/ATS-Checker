import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Plus, ArrowRight, Clock } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
      return;
    }

    const fetchResumes = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'resumes'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setResumes(data);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'resumes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumes();
  }, [user, loading, navigate]);

  if (loading || isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage your resume analyses and track your progress.</p>
        </div>
        <Link to="/upload" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" /> New Scan
        </Link>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No resumes analyzed yet</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">Upload your first resume to get an ATS score, keyword recommendations, and formatting fixes.</p>
          <Link to="/upload" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-block">
            Upload Resume
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Link key={resume.id} to={`/results/${resume.id}`} className="block group">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all hover:border-indigo-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 truncate max-w-[150px]" title={resume.fileName}>
                        {resume.fileName}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="w-14 h-14">
                    <CircularProgressbar 
                      value={resume.score} 
                      text={`${resume.score}`}
                      styles={buildStyles({
                        pathColor: resume.score >= 80 ? '#10b981' : resume.score >= 60 ? '#f59e0b' : '#ef4444',
                        textColor: '#0f172a',
                        trailColor: '#f1f5f9',
                        textSize: '28px',
                      })}
                    />
                  </div>
                </div>
                {resume.jobDescription && (
                  <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 mb-4 line-clamp-2">
                    <span className="font-semibold text-slate-700">Target:</span> {resume.jobDescription}
                  </div>
                )}
                <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:text-indigo-700">
                  View Full Report <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
