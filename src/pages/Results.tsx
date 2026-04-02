import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft, Download, Sparkles, FileText } from 'lucide-react';

export default function Results() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
      return;
    }

    const fetchReport = async () => {
      if (!id || !user) return;
      try {
        const docRef = doc(db, 'resumes', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().userId === user.uid) {
          const data = docSnap.data();
          setReport({
            ...data,
            analysis: JSON.parse(data.analysis)
          });
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `resumes/${id}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [id, user, loading, navigate]);

  if (loading || isLoading) {
    return <div className="flex justify-center items-center h-64">Loading report...</div>;
  }

  if (!report) return null;

  const { analysis } = report;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // emerald
    if (score >= 60) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return { text: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (score >= 60) return { text: 'Needs Work', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { text: 'Poor', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const scoreStatus = getScoreText(analysis.score);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <Link to="/dashboard" className="flex items-center text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Overview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main Score Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Overall ATS Score</h2>
            <div className="w-48 h-48 mx-auto mb-6">
              <CircularProgressbar 
                value={analysis.score} 
                text={`${analysis.score}`}
                styles={buildStyles({
                  pathColor: getScoreColor(analysis.score),
                  textColor: '#0f172a',
                  trailColor: '#f1f5f9',
                  textSize: '24px',
                })}
              />
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-full font-bold ${scoreStatus.bg} ${scoreStatus.color}`}>
              {scoreStatus.text}
            </div>
            <p className="text-slate-500 mt-4 text-sm">
              Based on keyword matching, formatting, and content quality.
            </p>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Score Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: 'Keywords Match', score: analysis.keywordsMatch },
                { label: 'Formatting', score: analysis.formatting },
                { label: 'Readability', score: analysis.readability },
                { label: 'Skills Relevance', score: analysis.skillsRelevance },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className="font-bold text-slate-900">{item.score}/100</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${item.score}%`,
                        backgroundColor: getScoreColor(item.score)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Keywords Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="text-indigo-600" /> Keyword Analysis
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-emerald-700 flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5" /> Matched Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedKeywords.map((kw: string, i: number) => (
                    <span key={i} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium border border-emerald-200">
                      {kw}
                    </span>
                  ))}
                  {analysis.matchedKeywords.length === 0 && <p className="text-slate-500 text-sm">No matched keywords found.</p>}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-red-700 flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5" /> Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((kw: string, i: number) => (
                    <span key={i} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-200">
                      {kw}
                    </span>
                  ))}
                  {analysis.missingKeywords.length === 0 && <p className="text-slate-500 text-sm">Great job! No major missing keywords.</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Issues Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="text-amber-500" /> Formatting & Structure
            </h3>
            
            <div className="space-y-4">
              {analysis.formattingIssues.length > 0 ? (
                analysis.formattingIssues.map((issue: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-amber-900">{issue}</p>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-3 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-emerald-900">No formatting issues detected. Your resume is highly parsable.</p>
                </div>
              )}

              {analysis.weakSections.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Sections to Improve</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.weakSections.map((section: string, i: number) => (
                      <span key={i} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-sm font-medium">
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Sparkles className="text-indigo-600" /> AI Bullet Improvements
            </h3>
            
            <div className="space-y-6">
              {analysis.improvementSuggestions.map((suggestion: any, i: number) => (
                <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 p-4 border-b border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Original</p>
                    <p className="text-slate-700 line-through decoration-red-300">{suggestion.original}</p>
                  </div>
                  <div className="bg-indigo-50/50 p-4 border-b border-slate-200">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Improved
                    </p>
                    <p className="text-slate-900 font-medium">{suggestion.improved}</p>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">Why:</span> {suggestion.reason}</p>
                  </div>
                </div>
              ))}
              {analysis.improvementSuggestions.length === 0 && (
                <p className="text-slate-500">Your bullet points look strong! No major improvements suggested.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
