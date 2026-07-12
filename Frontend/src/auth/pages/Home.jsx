import { useState } from 'react';
import { Upload, Sparkles } from 'lucide-react';

const Home = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [resume, setResume] = useState(null);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-white p-8 md:p-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Column: Job Description */}
        <div className="space-y-4">
          <label className="block text-lg font-medium text-gray-200">Job Description</label>
          <textarea
            className="w-full h-[500px] bg-[#1a1d24] border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-500"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {/* Right Column: Upload & Self Description */}
        <div className="space-y-8">
          
          {/* Resume Upload */}
          <div className="space-y-3">
            <label className="block text-lg font-medium text-gray-200">
              Resume <span className="text-red-400 text-sm">(PDF required)</span>
            </label>
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center bg-[#1a1d24] hover:border-indigo-500 transition-colors cursor-pointer">
              <input type="file" className="hidden" id="file-upload" onChange={handleFileChange} />
              <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
                <Upload className="w-10 h-10 text-indigo-400 mb-2" />
                <span className="text-sm text-gray-400">
                  {resume ? resume.name : "Click to upload your resume"}
                </span>
              </label>
            </div>
          </div>

          {/* Self Description */}
          <div className="space-y-3">
            <label className="block text-lg font-medium text-gray-200">Self Description</label>
            <textarea
              className="w-full h-40 bg-[#1a1d24] border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-500"
              placeholder="Tell us about your strengths and goals..."
              value={selfDescription}
              onChange={(e) => setSelfDescription(e.target.value)}
            />
          </div>

          {/* Action Button */}
          <button
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-pink-900/20"
          >
            <Sparkles className="w-5 h-5" />
            Generate Interview Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;