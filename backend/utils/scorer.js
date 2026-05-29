const scoreResume = async (
  resumeText,
  jobDescription
) => {

  const resume = resumeText.toLowerCase();
  const jd = jobDescription.toLowerCase();

  // =========================
  // Technical Skills Dictionary
  // =========================

  const techSkills = [
    "javascript",
    "react",
    "reactjs",
    "node",
    "nodejs",
    "express",
    "mongodb",
    "mysql",
    "sql",
    "python",
    "java",
    "php",
    "html",
    "css",
    "bootstrap",
    "tailwind",
    "git",
    "github",
    "jwt",
    "rest api",
    "redux",
    "typescript",
    "nextjs",
    "aws",
    "docker",
    "kubernetes",
    "power bi",
    "tableau",
    "excel",
    "c",
    "c++",
    "c#"
  ];

  // =========================
  // Skills Matching (40 Marks)
  // =========================

  const matchedSkills = [];
  const missingSkills = [];

  techSkills.forEach(skill => {

    if (jd.includes(skill)) {

      if (resume.includes(skill)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }

    }

  });

  const totalRequiredSkills =
    matchedSkills.length +
    missingSkills.length;

  const skillsScore =
    totalRequiredSkills > 0
      ? Math.round(
          (matchedSkills.length /
            totalRequiredSkills) * 40
        )
      : 0;

  // =========================
  // Experience Matching (30 Marks)
  // =========================

  const experienceKeywords = [
    "experience",
    "intern",
    "developer",
    "engineer",
    "analyst",
    "project",
    "software"
  ];

  let requiredExperience = 0;
  let matchedExperience = 0;

  experienceKeywords.forEach(word => {

    if (jd.includes(word)) {

      requiredExperience++;

      if (resume.includes(word)) {
        matchedExperience++;
      }

    }

  });

  const experienceScore =
    requiredExperience > 0
      ? Math.round(
          (matchedExperience /
            requiredExperience) * 30
        )
      : 30;

  // =========================
  // Education Matching (20 Marks)
  // =========================

  const educationKeywords = [
    "bca",
    "mca",
    "b.tech",
    "btech",
    "m.tech",
    "mtech",
    "b.sc",
    "b.sc it",
    "computer science",
    "information technology",
    "engineering"
  ];

  let requiredEducation = 0;
  let matchedEducation = 0;

  educationKeywords.forEach(word => {

    if (jd.includes(word)) {

      requiredEducation++;

      if (resume.includes(word)) {
        matchedEducation++;
      }

    }

  });

  const educationScore =
    requiredEducation > 0
      ? Math.round(
          (matchedEducation /
            requiredEducation) * 20
        )
      : 20;

  // =========================
  // Keyword Similarity (10 Marks)
  // =========================

  const stopWords = [
    "and",
    "or",
    "the",
    "for",
    "with",
    "from",
    "required",
    "candidate",
    "must",
    "have",
    "good",
    "knowledge",
    "years",
    "year",
    "role",
    "job",
    "skills"
  ];

  const jdWords = [
    ...new Set(
      jd
        .split(/\W+/)
        .filter(
          word =>
            word.length > 3 &&
            !stopWords.includes(word)
        )
    )
  ];

  let keywordMatches = 0;

  jdWords.forEach(word => {

    if (resume.includes(word)) {
      keywordMatches++;
    }

  });

  const keywordScore =
    jdWords.length > 0
      ? Math.round(
          (keywordMatches /
            jdWords.length) * 10
        )
      : 0;

  // =========================
  // Final Score
  // =========================

  const score = Math.min(
    100,
    skillsScore +
    experienceScore +
    educationScore +
    keywordScore
  );

  // =========================
  // Candidate Name
  // =========================

  const candidateName =
    resumeText
      .split("\n")
      .find(
        line =>
          line.trim().length > 3 &&
          line.trim().length < 40
      )
      ?.trim() ||
    "Unknown";

  // =========================
  // Recommendation
  // =========================

  let recommendation = "";

  if (score >= 80) {

    recommendation =
      "Excellent match for this role.";

  } else if (score >= 60) {

    recommendation =
      "Good match for this role.";

  } else if (score >= 40) {

    recommendation =
      "Average match for this role.";

  } else {

    recommendation =
      "Low match for this role.";
  }

  return {

    candidateName,

    score,

    matchedSkills,

    missingSkills,

    summary: `
${recommendation}

Skills Match: ${skillsScore}/40
Experience Relevance: ${experienceScore}/30
Education Alignment: ${educationScore}/20
Keyword Similarity: ${keywordScore}/10
`.trim()

  };
};

module.exports = {
  scoreResume
};