export const getParseResumePrompt = (
  jobDescription: string,
  extractedResume: string,
) => {
  const prompt = `
You are an AI system that evaluates resumes against job descriptions.

Here is the job description:
${jobDescription}

Here is the text extracted from the resume:
${extractedResume}

Tasks:
1. Extract hard skills from the resume.
2. Extract soft skills from the resume.
3. Determine total professional experience in years (number only).
4. Rate the resume out of 10 based on how well it matches the job description.

Rules:
- Use ONLY the resume content to extract skills and experience.
- Base the rating strictly on alignment with the job description.
- Respond ONLY in valid JSON.
- Do not include explanations or extra text.

Response format example. Follow this format strictly, and do not add any other information outside the json format.
{
  "hardSkills": [],
  "softSkills": [],
  "experienceInYears": number(float with single decimal),
  "rating": number(int)
}
Do not omit the keys, instead in case of missing/empty values, set arrays as empty, and experience as 0.
`;

  return prompt;
};

export const getResumeAssessmentPrompt = (
  jobDescription: string,
  extractedResume: string,
) => {
  const prompt = `
You are an AI system that evaluates resumes against job descriptions.

Here is the job description:
${jobDescription}

Here is the text extracted from the resume:
${extractedResume}

Tasks:
1. Evaluate the resume against the job description.
2. Rate the resume out of 10 based on how well it matches the job description.
3. Provide a short 1 sentence summary of the evaluation. For example: "Overall your application looks good, but here are some points...", "Your resume doesn't properly match...." based on the rating.
4. Provide a list of suggestions (max 5) about the things to improve.

Rules:
- Use ONLY the resume content to evaluate resume.
- Base the rating strictly on alignment with the job description.
- Respond ONLY in valid JSON.
- Do not include explanations or extra text.

Response format example. Follow this format strictly, and do not add any other information outside the json format.
{
  "summary": string,
  "suggestedImprovements": string[],
  "rating": number(int)
}

Make the summary and suggested improvements sentences short and concise without filler words (max 25-30 words).
Focus on user instead of resume. "This resume showcases" vs "You showcase".
`;

  return prompt;
};
