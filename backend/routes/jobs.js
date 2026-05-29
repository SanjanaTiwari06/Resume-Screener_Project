const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const upload = require('../middleware/upload');
const { extractText } = require('../utils/extractor');
const { scoreResume } = require('../utils/scorer');
const { v4: uuidv4 } = require('uuid');

// POST /api/jobs
router.post(
  '/',
  upload.fields([
    { name: 'resumes', maxCount: 20 },
    { name: 'jdFile', maxCount: 1 }
  ]),
  async (req, res) => {
    const { jobTitle, jobDescription } = req.body;
    const resumeFiles = req.files?.resumes || [];
    const jdFile = req.files?.jdFile?.[0];

    if (!resumeFiles.length) {
      return res.status(400).json({
        error: 'At least one resume is required'
      });
    }

    let jdText = jobDescription || '';

    if (jdFile) {
      jdText = await extractText(jdFile.buffer, jdFile.originalname);
    }

    if (!jdText.trim()) {
      return res.status(400).json({
        error: 'Job description is required'
      });
    }

    const client = await pool.getConnection();

    try {
      const jobId = uuidv4();

      // Save job
      await client.query(
        'INSERT INTO jobs (id, title, description) VALUES (?, ?, ?)',
        [jobId, jobTitle || 'Untitled Position', jdText]
      );

      const candidates = [];

      // Process resumes
      for (const file of resumeFiles) {
        let resumeText = '';

        try {
          resumeText = await extractText(
            file.buffer,
            file.originalname
          );
        } catch {
          resumeText = file.originalname;
        }

        let scoring = {
          candidateName: 'Unknown',
          score: 0,
          matchedSkills: [],
          missingSkills: [],
          summary: ''
        };

        try {
          scoring = await scoreResume(resumeText, jdText);
        } catch (err) {
          console.error(
            'Scoring error:',
            err.message
          );
        }

        const candidateId = uuidv4();

        await client.query(
          `INSERT INTO candidates
          (id, job_id, name, filename, resume_text, score, matched_skills, missing_skills, summary)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            candidateId,
            jobId,
            scoring.candidateName,
            file.originalname,
            resumeText.slice(0, 5000),
            scoring.score,
            JSON.stringify(scoring.matchedSkills),
            JSON.stringify(scoring.missingSkills),
            scoring.summary
          ]
        );

        candidates.push({
          id: candidateId,
          name: scoring.candidateName,
          score: scoring.score,
          matched_skills: scoring.matchedSkills,
          missing_skills: scoring.missingSkills,
          summary: scoring.summary,
          filename: file.originalname
        });
      }

      // Ranking
      candidates.sort((a, b) => b.score - a.score);

      for (let i = 0; i < candidates.length; i++) {
        await client.query(
          'UPDATE candidates SET rank_no = ? WHERE id = ?',
          [i + 1, candidates[i].id]
        );

        candidates[i].rank_no = i + 1;
      }

      res.json({
        jobId,
        candidates
      });

    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: 'Analysis failed: ' + err.message
      });

    } finally {
      client.release();
    }
  }
);

// GET all jobs
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT jobs.id, jobs.title, jobs.created_at,
      COUNT(candidates.id) AS candidate_count
      FROM jobs
      LEFT JOIN candidates
      ON jobs.id = candidates.job_id
      GROUP BY jobs.id
      ORDER BY jobs.created_at DESC`
    );

    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET candidates
router.get('/:id/candidates', async (req, res) => {

  try {

    const { search, sort } = req.query;

    let query = `
      SELECT *
      FROM candidates
    `;

    const params = [];

    // Search by candidate name
    if (search) {
      query += `
        WHERE LOWER(name) LIKE ?
      `;

      params.push(
        `%${search.toLowerCase()}%`
      );
    }

    // Sorting
    if (sort === 'name') {

      query += `
        ORDER BY name ASC
      `;

    } else {

      query += `
        ORDER BY score DESC
      `;
    } const [rows] =
      await pool.query(query, params);

    rows.forEach(row => {

      // matched skills
      try {

        row.matched_skills =
          typeof row.matched_skills === 'string'
            ? JSON.parse(row.matched_skills)
            : row.matched_skills || [];

      } catch {

        row.matched_skills =
          String(row.matched_skills || '')
            .split(',')
            .filter(Boolean);
      }

      // missing skills
      try {
        row.missing_skills =
          typeof row.missing_skills === 'string'
            ? JSON.parse(row.missing_skills)
            : row.missing_skills || [];

      } catch {

        row.missing_skills =
          String(row.missing_skills || '')
            .split(',')
            .filter(Boolean);
      }
    });

    res.json(rows);

  } catch (err) {

    console.error(err);

    res.status(500).json([]);
  }
});

// DELETE job
router.delete('/:id', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM jobs WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Job deleted'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;