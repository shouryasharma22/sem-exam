import { useState } from 'react';

export default function AdminPortal({ adminToken }) {
  // Form Field States
  const [title, setTitle] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [department, setDepartment] = useState('computer science');
  const [semester, setSemester] = useState('3');
  const [resourceType, setResourceType] = useState('Exam Paper');
  const [examType, setExamType] = useState('End-Sem');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [file, setFile] = useState(null);
  const [tagsInput, setTagsInput] = useState('');

  // Status Management States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Operational layout error: Physical asset file attachment is required.' });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage({ type: 'info', text: 'Initializing cloud storage upload pipeline...' });

      // 📦 Building multipart Form Data packet to transport raw streams
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subjectCode', subjectCode.toUpperCase().trim());
      formData.append('department', department);
      formData.append('semester', Number(semester));
      formData.append('resourceType', resourceType);
      formData.append('examType', resourceType === 'Exam Paper' ? examType : 'Other');
      formData.append('year', Number(year));
      formData.append('resourceFile', file); // Matches your uploadFile local Multer destination criteria key!

      // Parse tags comma-separated string into a clean array structure
      if (tagsInput.trim()) {
        const parsedTags = tagsInput.split(',').map(tag => tag.trim().replace('#', '')).filter(Boolean);
        parsedTags.forEach(tag => formData.append('tags[]', tag));
      }

      // Direct streaming hit to your local Express deployment layer
      const response = await fetch('http://localhost:8000/api/v1/admin/upload', {
        method: 'POST',
        headers: {
          'x-admin-token': adminToken // 🔑 Passing along your secret verification handshake string
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({ type: 'success', text: 'Transaction absolute. Asset successfully committed to Cloudinary and MongoDB indexing engines.' });
        // Reset primary text fields safely
        setTitle('');
        setSubjectCode('');
        setFile(null);
        setTagsInput('');
        // Reset file input component visually
        e.target.reset();
      } else {
        throw new Error(result.message || 'Pipeline rejected transmission.');
      }
    } catch (err) {
      console.error('Data transport transmission failure:', err);
      setMessage({ type: 'error', text: `Transmission failed: ${err.message}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-[#0F1422] border border-slate-800 rounded-2xl p-8 shadow-2xl">
      <div className="border-b border-slate-800 pb-5 mb-6">
        <h2 className="text-xl font-bold text-white font-mono tracking-tight">admin.deploy_asset()</h2>
        <p className="text-xs text-slate-400 mt-1">Commit new study materials directly into the production cluster nodes.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border text-xs font-mono mb-6 transition-all ${
          message.type === 'error' ? 'bg-red-950/20 border-red-900 text-red-400' :
          message.type === 'success' ? 'bg-emerald-950/20 border-emerald-900 text-emerald-400' :
          'bg-blue-950/20 border-blue-900 text-blue-400 animate-pulse'
        }`}>
          [{message.type.toUpperCase()}]: {message.text}
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Resource Title</label>
          <input
            type="text"
            required
            placeholder="e.g., Data Structures & Algorithms End-Sem Paper"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#070A12] border border-slate-800 focus:border-blue-500 text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Subject Course Code</label>
            <input
              type="text"
              required
              placeholder="e.g., CS201"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="w-full bg-[#070A12] border border-slate-800 focus:border-blue-500 text-slate-100 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none transition-colors placeholder:font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Academic Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-[#070A12] border border-slate-800 focus:border-blue-500 text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors capitalize"
            >
              <option value="computer science">Computer Science</option>
              <option value="information technology">Information Technology</option>
              <option value="electronics">Electronics</option>
              <option value="mechanical">Mechanical</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full bg-[#070A12] border border-slate-800 focus:border-blue-500 text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>Semester {num}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Resource Structure</label>
            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              className="w-full bg-[#070A12] border border-slate-800 focus:border-blue-500 text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
            >
              <option value="Exam Paper">Exam Paper</option>
              <option value="Textbook">Textbook</option>
              <option value="Class Notes">Class Notes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Calendar Year</label>
            <input
              type="number"
              required
              min="2000"
              max="2030"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-[#070A12] border border-slate-800 focus:border-blue-500 text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
            />
          </div>
        </div>

        {resourceType === 'Exam Paper' && (
          <div className="bg-[#070A12] border border-slate-800/60 p-4 rounded-xl animate-fadeIn">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Evaluation Cycle Subtype</label>
            <div className="flex gap-4">
              {['Mid-Sem', 'End-Sem', 'Other'].map((type) => (
                <label key={type} className="flex items-center gap-2 text-sm text-slate-200 cursor-pointer">
                  <input
                    type="radio"
                    name="examType"
                    value={type}
                    checked={examType === type}
                    onChange={(e) => setExamType(e.target.value)}
                    className="accent-blue-500"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Metadata Search Tags (Comma Separated)</label>
          <input
            type="text"
            placeholder="e.g., #stack, #queue, #trees, #2025"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full bg-[#070A12] border border-slate-800 focus:border-blue-500 text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Asset File Payload (.PDF Only)</label>
          <div className="border border-dashed border-slate-800 bg-[#070A12] rounded-xl p-6 text-center hover:border-slate-700 transition-colors relative cursor-pointer">
            <input
              type="file"
              required
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-1 text-xs">
              <p className="text-slate-200 font-medium">
                {file ? `📎 Target selected: ${file.name}` : 'Click to anchor file stream or drag-and-drop here'}
              </p>
              <p className="text-slate-500">Maximum allocation weight threshold: 16 Megabytes</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 px-4 rounded-xl transition-colors font-mono tracking-wide ${isSubmitting ? 'opacity-40 cursor-not-allowed animate-pulse' : ''}`}
        >
          {isSubmitting ? 'EXECUTING_CLOUD_COMMIT...' : 'EXECUTE_TRANSACTION()'}
        </button>
      </form>
    </div>
  );
}