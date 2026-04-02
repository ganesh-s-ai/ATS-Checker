import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Upload, Zap, FileSearch, Star, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-white -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6"
          >
            Beat the ATS. <span className="text-indigo-600">Land the Interview.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto mb-10"
          >
            Increase your chances of getting shortlisted by making your resume ATS-friendly in seconds. Get actionable insights, keyword optimization, and formatting fixes.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/upload" className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              Check My Resume <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/pricing" className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center">
              View Pricing
            </Link>
          </motion.div>
          <div className="mt-10 flex items-center justify-center gap-4 text-sm text-slate-500 font-medium">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} className="w-8 h-8 rounded-full border-2 border-white" src={`https://i.pravatar.cc/100?img=${i}`} alt="User" />
              ))}
            </div>
            <p>Used by <span className="text-slate-900 font-bold">10,000+</span> job seekers</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600">Three simple steps to a perfect resume.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Upload, title: "1. Upload Resume", desc: "Upload your PDF or DOCX resume securely. We don't store your data." },
              { icon: FileSearch, title: "2. AI Analysis", desc: "Our AI scans your resume against industry-standard ATS algorithms." },
              { icon: Zap, title: "3. Get Optimized", desc: "Receive a detailed score, missing keywords, and actionable improvements." }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Everything you need to pass the ATS</h2>
              <div className="space-y-6">
                {[
                  "Keyword Matching against specific job descriptions",
                  "Formatting analysis to ensure parsability",
                  "Action verb recommendations for bullet points",
                  "Readability and impact scoring"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
                    <p className="text-lg text-slate-700">{feature}</p>
                  </div>
                ))}
              </div>
              <Link to="/upload" className="inline-block mt-10 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors">
                Try it for free
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-3xl transform rotate-3 scale-105 -z-10" />
              <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800" alt="Resume Analysis Dashboard" className="rounded-3xl shadow-2xl border border-white/50" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Success Stories</h2>
            <p className="text-lg text-slate-600">Join thousands who landed their dream jobs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah J.", role: "Software Engineer", text: "I was applying for months with no luck. After fixing the missing keywords ResumeAI found, I got 3 interviews in a week!" },
              { name: "Michael T.", role: "Marketing Manager", text: "The bullet point suggestions transformed my resume from a list of duties to a list of achievements." },
              { name: "Emily R.", role: "Recent Graduate", text: "I had no idea my formatting was breaking the ATS. This tool is a lifesaver for fresh grads." }
            ].map((testimonial, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-slate-700 mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={`https://i.pravatar.cc/150?img=${i+10}`} alt={testimonial.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-bold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-indigo-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to get hired?</h2>
          <p className="text-xl text-indigo-100 mb-10">Stop guessing what recruiters want. Let AI optimize your resume today.</p>
          <Link to="/upload" className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl inline-block">
            Upload Your Resume Now
          </Link>
        </div>
      </section>
    </div>
  );
}
