// packages
import { PDFParse } from "pdf-parse";
import { GoogleGenAI } from "@google/genai";

// libs
import { getParseResumePrompt, getResumeAssessmentPrompt } from "./prompts";

// prisma
import { prisma } from "./prisma";
import { ParsedResumeStatus, SkillType } from "../../generated/prisma/enums";

const geminiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const GEMINI_MODEL = "gemini-2.5-flash";

// types
interface ParsedResumeResponse {
  hardSkills: string[];
  softSkills: string[];
  experienceInYears: number;
  rating: number;
}

interface ResumeAssessmentResponse {
  summary: string;
  suggestedImprovements: string[];
  rating: number;
}

const parsingTest = {
  hardSkills: [
    "Software Engineering",
    "Web Engineering",
    "Mobile Application Development",
    "Application Programming",
    "Database Principles",
    "Software Development Methodologies",
    "Web Systems & Technologies",
    "Programming",
    "Computer Science Fundamentals",
    "Systems Analysis and Design",
    "Website Development",
    "Project Management",
  ],
  softSkills: ["Communication", "leadership"],
  experienceInYears: 1,
  rating: 2,
};

const assessmentTest = {
  summary:
    "You showcase extensive full-stack experience with React/Next.js, Node.js, databases, and cloud platforms, demonstrating strong ownership and collaboration skills.",
  suggestedImprovements: [
    "Quantify the impact and outcomes of your implemented features with metrics.",
    "Explicitly mention your experience debugging production issues if applicable.",
    "Add any experience with CI/CD pipelines to further align with bonus points.",
    "Highlight instances where you balanced speed with quality in your work.",
    "Consider adding a brief summary emphasizing end-to-end feature ownership.",
  ],
  rating: 9,
};

const parsePdfText = async (resumeLink: string) => {
  try {
    const parser = new PDFParse({ url: `src/registry/resume/${resumeLink}` });
    const result = await parser.getText();
    return result.pages.map((page) => page.text).join("\n");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const parseResumeDetails = async (
  applicationId: string,
  resumePath: string,
  jobDescription: string,
) => {
  const parsedResume = await prisma.parsedResume.create({
    data: {
      applicationId,
    },
  });

  try {
    const parsedText = await parsePdfText(resumePath);
    if (!parsedText) throw new Error();

    const prompt = getParseResumePrompt(jobDescription, parsedText);

    const response = await geminiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });
    if (!response.text) throw new Error();

    const cleanedJson = response?.text
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedJson: ParsedResumeResponse = JSON.parse(cleanedJson);
    if (!isValidParsedResumeResponse(parsedJson)) throw new Error();
    console.log(parsedJson);

    await saveParsedResumeDetails(parsedResume.id, parsedJson);
  } catch (error) {
    await prisma.parsedResume.update({
      where: {
        id: parsedResume.id,
      },
      data: {
        status: ParsedResumeStatus.FAILED,
      },
    });
    console.error(error);
  }
};

const saveParsedResumeDetails = async (
  parsedResumeId: string,
  data: ParsedResumeResponse,
) => {
  try {
    const hardSkills = data.hardSkills.map((skill) => ({
      skill,
      skillType: SkillType.HARD_SKILL,
      parsedResumeId,
    }));
    const softSkills = data.softSkills.map((skill) => ({
      skill,
      skillType: SkillType.SOFT_SKILL,
      parsedResumeId,
    }));

    await prisma.extractedSkills.createMany({
      data: [...hardSkills, ...softSkills],
    });

    await prisma.parsedResume.update({
      where: {
        id: parsedResumeId,
      },
      data: {
        yearsOfExperience: data.experienceInYears,
        rating: data.rating,
        status: ParsedResumeStatus.PARSED,
      },
    });
    console.log("Resume parsed and saved.");
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};

export const assessApplication = async (
  applicantId: string,
  jobId: string,
  resumePath: string,
  jobDescription: string,
) => {
  try {
    const parsedText = await parsePdfText(resumePath);
    if (!parsedText) throw new Error();

    const prompt = getResumeAssessmentPrompt(jobDescription, parsedText);

    const response = await geminiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });
    if (!response.text) throw new Error();

    const cleanedJson = response?.text
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedJson: ResumeAssessmentResponse = JSON.parse(cleanedJson);
    if (!isValidAssessmentResponse(parsedJson)) throw new Error();

    return await saveSkillAssessment(applicantId, jobId, parsedJson);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const saveSkillAssessment = async (
  applicantId: string,
  jobId: string,
  data: ResumeAssessmentResponse,
) => {
  try {
    const skillAssessment = await prisma.skillAssessment.create({
      data: {
        applicantId,
        jobId,
        status: ParsedResumeStatus.PARSED,
        rating: data.rating,
        description: JSON.stringify(data),
      },
    });

    return skillAssessment;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const isValidParsedResumeResponse = (obj: any) => {
  try {
    return (
      Array.isArray(obj?.hardSkills) &&
      Array.isArray(obj?.softSkills) &&
      typeof obj?.experienceInYears === "number" &&
      typeof obj?.rating === "number"
    );
  } catch (error) {
    console.error(error);
    return false;
  }
};

const isValidAssessmentResponse = (obj: any) => {
  try {
    return (
      Array.isArray(obj?.suggestedImprovements) &&
      typeof obj?.summary === "string" &&
      typeof obj?.rating === "number"
    );
  } catch (error) {
    console.error(error);
    return false;
  }
};
