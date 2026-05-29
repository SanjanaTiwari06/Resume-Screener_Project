import { useEffect, useState } from 'react';
import styles from './ResultsDashboard.module.css';

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

function ScoreBar({ score }) {
  const color = score >= 70 ? '#4ade80' : score >= 40 ? '#fb923c' : '#f87171';
  return (
    <div className={styles.barWrap}>
      <div className={styles.barFill} style={{ width: `${score}%`, background: color }} />
    </div>
  );
}

function CandidateCard({ candidate }) {
  const [open, setOpen] = useState(false);
  const { rank_no, name, filename, score, matched_skills, missing_skills, summary } = candidate;

  const scoreClass =
    score >= 70 ? styles.scoreHigh : score >= 40 ? styles.scoreMid : styles.scoreLow;

  return (
    <div className={`${styles.card} ${open ? styles.cardOpen : ''}`}>
      <div className={styles.cardTop} onClick={() => setOpen(o => !o)}>
        <div
          className={`${styles.rankBadge} ${
            rank_no === 1 ? styles.rank1
            : rank_no === 2 ? styles.rank2
            : rank_no === 3 ? styles.rank3
            : styles.rankOther
          }`}
        >
          {MEDAL[rank_no] || `#${rank_no}`}
        </div>

        <div className={styles.info}>
          <div className={styles.name}>{name || 'Unknown'}</div>
          <div className={styles.filename}>{filename}</div>
        </div>

        <div className={styles.scoreBlock}>
          <span className={`${styles.scoreNum} ${scoreClass}`}>
            {score}
            <span className={styles.scoreMax}>/100</span>
          </span>
          <ScoreBar score={score || 0} />
        </div>

        <div className={styles.chevron} style={{ transform: open ? 'rotate(180deg)' : '' }}>
          ▾
        </div>
      </div>

      {open && (
        <div className={styles.detail}>
          {summary && <p className={styles.summary}>{summary}</p>}
          <div className={styles.skillsGrid}>
            <div>
              <div className={styles.skillLabel}>Matched skills</div>
              <div className={styles.skillTags}>
                {(matched_skills || []).length
                  ? matched_skills.map(s => (
                    <span key={s} className={styles.tagMatch}>{s}</span>
                  ))
                  : <span className={styles.none}>None detected</span>
                }
              </div>
            </div>
            <div>
              <div className={styles.skillLabel}>Missing skills</div>
              <div className={styles.skillTags}>
                {(missing_skills || []).length
                  ? missing_skills.map(s => (
                    <span key={s} className={styles.tagMissing}>{s}</span>
                  ))
                  : <span className={styles.none}>None — great match!</span>
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultsDashboard({ data, onReset }) {
  const [candidates, setCandidates] = useState(
    Array.isArray(data?.candidates) ? data.candidates : []
  );
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('score');

  useEffect(() => {
    setCandidates(Array.isArray(data?.candidates) ? data.candidates : []);
  }, [data]);

  const handleSearch = async (value) => {
    setSearch(value);
    try {
      if (!value.trim()) {
        setCandidates(Array.isArray(data?.candidates) ? data.candidates : []);
        return;
      }
      const res = await fetch(
  `https://resume-screener-project-ad2o.onrender.com/api/jobs/${data.jobId}/candidates?search=${value}`
);
      const result = await res.json();
      setCandidates(Array.isArray(result) ? result : []);
    } catch (err) { console.error(err); }
  };

  let filtered = [...candidates];
  if (sort === 'name') {
    filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else {
    filtered.sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
  }

  const avg = candidates.length
    ? Math.round(candidates.reduce((s, c) => s + Number(c.score || 0), 0) / candidates.length)
    : 0;

  const top = [...candidates].sort((a, b) => Number(b.score || 0) - Number(a.score || 0))[0];

  const exportCSV = () => {
    const rows = [['Rank', 'Name', 'File', 'Score', 'Matched Skills', 'Missing Skills', 'Summary']];
    candidates.forEach(c =>
      rows.push([
        c.rank_no, c.name, c.filename, c.score,
        (c.matched_skills || []).join('; '),
        (c.missing_skills || []).join('; '),
        c.summary || ''
      ])
    );
    const csv = rows
      .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'candidates.csv';
    a.click();
  };

  return (
    <div className={styles.dashboard}>
      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{candidates.length}</div>
          <div className={styles.statLabel}>Candidates</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statNum} ${styles.statAccent}`}>{avg}</div>
          <div className={styles.statLabel}>Avg Score</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statNum} ${styles.statGreen}`}>{top?.score ?? '—'}</div>
          <div className={styles.statLabel}>Top Score</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statNum} ${styles.statName}`}>{top?.name || '—'}</div>
          <div className={styles.statLabel}>Best Match</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="Search candidates..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
        />
        <select
          className={styles.sortSelect}
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="score">Score ↓</option>
          <option value="name">Name A–Z</option>
        </select>
        <button className={styles.btnExport} onClick={exportCSV}>⬇ Export CSV</button>
        <button className={styles.btnReset} onClick={onReset}>+ New</button>
      </div>

      {/* List */}
      <div className={styles.list}>
        {filtered.length === 0
          ? <p className={styles.empty}>No candidates found.</p>
          : filtered.map((c, i) => (
            <CandidateCard key={c.id || i} candidate={c} />
          ))
        }
      </div>
    </div>
  );
}
