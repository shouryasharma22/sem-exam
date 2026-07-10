import { useState } from 'react';
import { uploadResource } from '../api/resourceApi';
import { departmentsList, examTypes } from '../constants/academic'

const initialFormState = {
  title: '',
  subjectCode: '',
  department: '',
  semester: '',
  resourceType: 'Exam Paper',
  examType: 'End-Sem',
  year: '',
  tags: '',
  resourceFile: null,
  adminToken: '',
};

const resourceTypes = ['Exam Paper', 'Textbook', 'Class Notes'];
const semesters = Array.from({ length: 8 }, (_, index) => index + 1);

function AdminPortal() {
  const [formState, setFormState] = useState(initialFormState);
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    if (!formState.adminToken) {
      setStatus({ type: 'error', message: 'Admin authentication token is required.' });
      return;
    }

    if (!formState.resourceFile) {
      setStatus({ type: 'error', message: 'Please attach a PDF or image document for upload.' });
      return;
    }

    const formData = new FormData();
    formData.append('title', formState.title);
    formData.append('subjectCode', formState.subjectCode);
    formData.append('department', formState.department);
    formData.append('semester', formState.semester);
    formData.append('resourceType', formState.resourceType);
    formData.append('examType', formState.examType);
    formData.append('year', formState.year);
    formData.append('tags', formState.tags);
    formData.append('resourceFile', formState.resourceFile);

    setIsSubmitting(true);

    try {
      await uploadResource(formData, formState.adminToken);
      setStatus({ type: 'success', message: 'Resource uploaded successfully.' });
      setFormState(initialFormState);
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Upload failed due to a validation error.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Admin Portal</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">Upload student resources</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Submit new materials with metadata, file attachments, and admin authentication for secure publishing.
          </p>
        </div>
      </header>

      {status && (
        <div
          className={`rounded-3xl border p-5 text-sm ${status.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-600">Title</span>
            <input
              value={formState.title}
              onChange={(event) => updateField('title', event.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="Resource title"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-600">Subject Code</span>
            <input
              value={formState.subjectCode}
              onChange={(event) => updateField('subjectCode', event.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="CS101"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-600">Department</span>
            <select
              value={formState.department}
              onChange={(event) => updateField('department', event.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              {/* 🟩 FIXED CORRECT WAY */}
              {departmentsList.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-600">Semester</span>
            <select
              value={formState.semester}
              onChange={(event) => updateField('semester', event.target.value)}
              required={formState.resourceType !== 'Textbook'}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select semester</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  Semester {semester}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-600">Resource Type</span>
            <select
              value={formState.resourceType}
              onChange={(event) => updateField('resourceType', event.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              {resourceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-600">Exam Type</span>
            <select
              value={formState.examType}
              onChange={(event) => updateField('examType', event.target.value)}
              required={formState.resourceType !== 'Textbook'}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              {examTypes.map((examType) => (
                <option key={examType} value={examType}>
                  {examType}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-600">Year</span>
            <input
              type="number"
              min="2000"
              max="2099"
              value={formState.year}
              onChange={(event) => updateField('year', event.target.value)}
              required={formState.resourceType !== 'Textbook'}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="2026"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-600">Admin Authentication Token</span>
            <input
              type="password"
              value={formState.adminToken}
              onChange={(event) => updateField('adminToken', event.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="Enter admin token"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-slate-600">Attach file</span>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(event) => updateField('resourceFile', event.target.files?.[0] || null)}
            required
            className="mt-2 w-full text-sm text-slate-600"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-600">Tags</span>
          <input
            value={formState.tags}
            onChange={(event) => updateField('tags', event.target.value)}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            placeholder="exam, notes, pdf"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? 'Submitting…' : 'Submit resource'}
        </button>
      </form>
    </section>
  );
}

export default AdminPortal;
