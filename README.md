# Resume Screening & Candidate Ranking Web Application

## Overview

Resume Screening & Candidate Ranking Web Application is a full-stack web application that automates the initial recruitment screening process. The system analyzes uploaded resumes against a given Job Description (JD), calculates a matching score, and ranks candidates from highest to lowest suitability.

## Live Demo

Frontend:
https://resume-screener-project.vercel.app

Backend API:
https://resume-screener-project-ad2o.onrender.com

## GitHub Repository

https://github.com/SanjanaTiwari06/Resume-Screener_Project

## Features

### Resume Upload
- Upload single or multiple resumes
- Supports PDF, DOC, and DOCX formats

### Job Description Input
- Enter Job Description manually
- Analyze resumes against the provided JD

### Resume Screening & Scoring
- Skill matching
- Experience relevance analysis
- Education alignment
- Keyword similarity matching
- Match score generation (0–100)

### Candidate Ranking
- Automatic ranking from highest to lowest score

### Results Dashboard
- Candidate Name
- Match Score
- Rank
- Matching Skills
- Missing Skills
- Resume Preview
- Search Candidates
- Sort by Score

## Technology Stack

### Frontend
- React.js
- Vite
- CSS3

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Deployment
- Vercel
- Render
- Railway

## Project Architecture

Frontend (React)
↓
REST API (Express.js)
↓
Resume Parsing & Scoring Engine
↓
MySQL Database

## Candidate Scoring Approach

The system compares resumes with the Job Description using:
- Skills Matching
- Experience Relevance
- Education Alignment
- Keyword Similarity

Candidates are assigned a score between 0–100 and ranked accordingly.

## Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm start
```

## Environment Variables

```env
PORT=5000
DB_HOST=your_host
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
FRONTEND_URL=http://localhost:5173
```

## Future Enhancements

- AI-powered semantic matching
- Email notifications
- Advanced analytics
- Authentication system

## Author

Sanjana Tiwari

