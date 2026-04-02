import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { extractTextFromPDF } from '../services/pdfService';
import { analyzeResume } from '../services/aiService';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';

export default function Upload() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) {
      await signInWithGoogle();
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Currently, only PDF files are supported.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // 1. Extract Text
      const text = await extractTextFromPDF(file);
      
      if (text.trim().length < 50) {
        throw new Error("Could not extract enough text from the PDF. It might be an image-based PDF.");
      }

      // 2. Analyze with AI
      const analysis = await analyzeResume(text, jobDescription);

      // 3. Save to Firestore
      let docRef;
      try {
        docRef = await addDoc(collection(db, 'resumes'), {
          userId: user.uid,
          fileName: file.name,
          jobDescription: jobDescription || null,
          score: analysis.score,
          analysis: JSON.stringify(analysis),
          createdAt: new Date().toISOString()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'resumes');
        return;
      }

      // 4. Navigate to Results
      navigate(`/results/${docRef.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, jobDescription, navigate, signInWithGoogle]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: isAnalyzing
  } as any);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Analyze Your Resume</h1>
        <p className="text-slate-600">Upload your resume and optionally paste a job description for tailored feedback.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
        
        {/* Job Description Input */}
        <div className="mb-8">
          <label htmlFor="jobDesc" className="block text-sm font-medium text-slate-700 mb-2">
            Target Job Description (Optional)
          </label>
          <textarea
            id="jobDesc"
            rows={4}
            className="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-4 border"
            placeholder="Paste the job description here to get keyword matching and specific recommendations..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={isAnalyzing}
          />
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
          } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          
          {isAnalyzing ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
              <p className="text-lg font-medium text-slate-900">Analyzing your resume...</p>
              <p className="text-slate-500 mt-2">This usually takes 10-15 seconds.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="text-xl font-medium text-slate-900 mb-2">
                {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
              </p>
              <p className="text-slate-500 mb-6">or click to browse files</p>
              <div className="flex gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> PDF</span>
                <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> DOCX</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-6 bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
          <AlertCircle className="w-4 h-4" />
          <p>Your files are secure and automatically deleted after analysis.</p>
        </div>
      </div>
    </div>
  );
}
