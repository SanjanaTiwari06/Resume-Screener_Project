import { useState, useRef } from 'react';
import { analyzeResumes } from '../utils/api';
import styles from './UploadForm.module.css';

export default function UploadForm({ onResults }) {
  const [resumes, setResumes] = useState([]);
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jdTab, setJdTab] = useState('text');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resumeRef = useRef();
  const jdRef = useRef();

  const addResumes = (files) => {
    const newFiles = Array.from(files).filter(
      f => !resumes.find(r => r.name === f.name)
    );
    setResumes(prev => [...prev, ...newFiles]);
  };

  const removeResume = (name) => setResumes(prev => prev.filter(f => f.name !== name));

  const handleDrop = (e) => {
    e.preventDefault();
    addResumes(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    if (!resumes.length) return setError('Please upload at least one resume.');
    if (!jdText.trim() && !jdFile) return setError('Please provide a job description.');
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('jobTitle', jobTitle || 'Untitled Position');
    if (jdFile) formData.append('jdFile', jdFile);
    else formData.append('jobDescription', jdText);
    resumes.forEach(f => formData.append('resumes', f));

    try {
      const { data } = await analyzeResumes(formData);
      onResults(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = resumes.length > 0 && (jdText.trim().length > 10 || jdFile);

  return (
    <div className={styles.form}>
      {/* Job Title */}
      <div className={styles.field}>
        <label className={styles.label}>Job title (optional)</label>
        <input
          className={styles.input}
          value={jobTitle}
          onChange={e => setJobTitle(e.target.value)}
          placeholder="e.g. Senior Frontend Engineer"
        />
      </div>

      {/* Resume Upload */}
      <div className={styles.field}>
        <label className={styles.label}>Resumes <span className={styles.required}>*</span></label>
        <div
          className={styles.dropZone}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => resumeRef.current.click()}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4M12 3v11M8 7l4-4 4 4"/></svg>
          <p>Click or drag & drop resumes here</p>
          <span>PDF, DOC, DOCX, TXT · Up to 20 files · 5MB each</span>
        </div>
        <input
          ref={resumeRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt"
          style={{ display: 'none' }}
          onChange={e => addResumes(e.target.files)}
        />
        {resumes.length > 0 && (
          <div className={styles.fileList}>
            {resumes.map(f => (
              <div key={f.name} className={styles.fileItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span className={styles.fileName}>{f.name}</span>
                <span className={styles.fileSize}>{(f.size / 1024).toFixed(0)} KB</span>
                <button className={styles.removeBtn} onClick={() => removeResume(f.name)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job Description */}
      <div className={styles.field}>
        <label className={styles.label}>Job description <span className={styles.required}>*</span></label>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${jdTab === 'text' ? styles.activeTab : ''}`} onClick={() => setJdTab('text')}>Type / Paste</button>
          <button className={`${styles.tab} ${jdTab === 'file' ? styles.activeTab : ''}`} onClick={() => setJdTab('file')}>Upload file</button>
        </div>
        {jdTab === 'text' ? (
          <textarea
            className={styles.textarea}
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            placeholder="Paste the full job description here — required skills, experience, responsibilities..."
            rows={6}
          />
        ) : (
          <div>
            <div className={styles.dropZone} style={{ padding: '1.25rem' }} onClick={() => jdRef.current.click()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4M12 3v11M8 7l4-4 4 4"/></svg>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>Upload JD file</p>
            </div>
            <input ref={jdRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} onChange={e => setJdFile(e.target.files[0])} />
            {jdFile && <p className={styles.jdFileName}>📄 {jdFile.name}</p>}
          </div>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
      >
        {loading ? (
          <><span className={styles.spinner} /> Analyzing candidates...</>
        ) : (
          <>✦ Analyze & rank candidates</>
        )}
      </button>
    </div>
  );
}
