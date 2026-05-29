import { useEffect, useState } from 'react';
import UploadForm from './components/UploadForm';
import ResultsDashboard from './components/ResultsDashboard';
import { getJobs, getCandidates } from './utils/api';
import styles from './App.module.css';

export default function App() {
  const [results, setResults] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [dark, setDark] = useState(true);

  useEffect(() => { loadJobs(); }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const loadJobs = async () => {
    try {
      const res = await getJobs();
      setJobs(res.data || []);
    } catch (err) { console.error(err); }
  };

  const openJob = async (job) => {
    try {
      setActiveJob(job.id);
      const res = await getCandidates(job.id);
      setResults({ jobId: job.id, candidates: res.data });
    } catch (err) { console.error(err); }
  };

  const hasResults = !!results;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoDot} />
          ResumeScreener
        </div>

        <div className={styles.headerRight}>
          <p className={styles.tagline}>AI-powered candidate ranking for HR teams</p>
          <button
            className={styles.themeToggle}
            onClick={() => setDark(d => !d)}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className={`${styles.main} ${hasResults ? styles.mainSplit : styles.mainFull}`}>

        <aside className={`${styles.uploadPanel} ${hasResults ? styles.uploadPanelSidebar : styles.uploadPanelFull}`}>

          {jobs.length > 0 && !hasResults && (
            <div
              className={`${styles.prevCard} ${activeJob ? styles.prevCardActive : ''}`}
              onClick={() => openJob(jobs[0])}
            >
              <span className={styles.prevIcon}>🕘</span>
              <span className={styles.prevLabel}>Previous Screenings</span>
              <span className={styles.prevArrow}>›</span>
            </div>
          )}

          <div className={`${styles.uploadCard} ${!hasResults ? styles.uploadCardCentered : ''}`}>
            {hasResults ? (
              <>
                <p className={styles.sidebarTitle}>New Screening</p>
                <button
                  className={styles.btnNew}
                  onClick={() => { setResults(null); setActiveJob(null); }}
                >
                  + New Screening
                </button>

                {jobs.length > 0 && (
                  <div
                    className={`${styles.prevCardCompact} ${activeJob ? styles.prevCardActive : ''}`}
                    onClick={() => openJob(jobs[0])}
                  >
                    <span className={styles.prevIcon}>🕘</span>
                    <span className={styles.prevLabel}>Previous Screenings</span>
                    <span className={styles.prevArrow}>›</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className={styles.uploadHeader}>
                  <h2 className={styles.uploadTitle}>Screen Candidates</h2>
                  <p className={styles.uploadSub}>
                    Upload resumes + a job description to get AI-powered candidate rankings
                  </p>
                </div>
                <UploadForm
                  onResults={(data) => {
                    setResults(data);
                    setActiveJob(null);
                    loadJobs();
                  }}
                />
              </>
            )}
          </div>

        </aside>

        {hasResults && (
          <section className={styles.content}>
            <ResultsDashboard
              data={results}
              onReset={() => { setResults(null); setActiveJob(null); }}
            />
          </section>
        )}

      </main>

      <footer className={styles.footer}>
        ResumeScreener · Built for internship task
      </footer>
    </div>
  );
}