// packages
import { PDFParse } from "pdf-parse";
import { GoogleGenAI } from "@google/genai";

// libs
import { getParseResumePrompt, getResumeAssessmentPrompt } from "./prompts";

// prisma
import { prisma } from "./prisma";
import { ParsedResume } from "generated/prisma/browser";
import { ParsedResumeStatus, SkillType } from "../../generated/prisma/enums";

const geminiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const GEMINI_MODEL = "gemini-2.5-flash";
const MAX_RETRY = 3;

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
  retry: number = 1,
  parseResult?: ParsedResume,
): Promise<void> => {
  const parsedResume =
    parseResult ||
    (await prisma.parsedResume.create({
      data: {
        applicationId,
      },
    }));

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
    console.log(retry, retry);
    if (retry <= MAX_RETRY)
      return parseResumeDetails(
        applicationId,
        resumePath,
        jobDescription,
        ++retry,
        parsedResume,
      );
    else {
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
