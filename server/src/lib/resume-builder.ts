// packages
import fs from "fs";
import PDFDocument from "pdfkit";

// prisma
import {
  User,
  Skills,
  Applicant,
  Education,
  ProfessionalExperience,
} from "generated/prisma/browser";

const PAGE_MARGIN = 50;
const PAGE_BOTTOM = 750;
type PDFFile = PDFKit.PDFDocument;

export const generateResumeFromProfile = (
  applicant: Applicant,
  user: User,
  skills: Skills[],
  educations: Education[],
  experiences?: ProfessionalExperience[],
) => {
  try {
    const outputPath = "resume.pdf";
    const doc: PDFFile = new PDFDocument({
      margin: PAGE_MARGIN,
    });

    doc.pipe(fs.createWriteStream(outputPath));

    renderHeader(doc, user, applicant);
    experiences?.length && renderExperience(doc, experiences);
    renderEducation(doc, educations);
    renderSkills(doc, skills);

    doc.end();
  } catch (e) {
    console.error(e);
    return null;
  }
};

function ensureSpace(doc: PDFFile, neededSpace = 40) {
  if (doc.y + neededSpace > PAGE_BOTTOM) {
    doc.addPage();
    doc.y = PAGE_MARGIN;
  }
}

function sectionTitle(doc: PDFFile, title: string) {
  ensureSpace(doc, 40);

  doc.moveDown().font("Helvetica-Bold").fontSize(14).text(title.toUpperCase());

  doc.moveDown(0.3).moveTo(PAGE_MARGIN, doc.y).lineTo(550, doc.y).stroke();
}

function renderHeader(doc: PDFFile, user: User, applicant: Applicant) {
  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .text(`${applicant.firstName} ${applicant.lastName}`);

  doc
    .moveDown(0.3)
    .font("Helvetica")
    .fontSize(11)
    .text(`${user.email} | ${applicant.phoneNumber} | ${applicant.location}`);
}

function renderExperience(doc: PDFFile, experience: ProfessionalExperience[]) {
  sectionTitle(doc, "Experience");

  experience.forEach((job) => {
    ensureSpace(doc, 80);

    doc
      .moveDown()
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(`${job.role} — ${job.companyName}`);

    doc
      .font("Helvetica-Oblique")
      .fontSize(10)
      .text(`${job.startedAt} - ${job.endedAt || "current"}`);

    doc.moveDown(0.3);

    job.description.split("\n").forEach((bullet) => {
      const bulletHeight = doc.heightOfString(`• ${bullet}`, {
        width: 500,
      });

      ensureSpace(doc, bulletHeight);

      doc.font("Helvetica").fontSize(11).text(`• ${bullet}`, {
        indent: 10,
        width: 500,
      });
    });
  });
}

function renderEducation(doc: PDFFile, education: Education[]) {
  sectionTitle(doc, "Education");

  education.forEach((edu) => {
    ensureSpace(doc, 50);

    doc
      .moveDown()
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(`${edu.course} — ${edu.instituteName}`);

    doc
      .font("Helvetica-Oblique")
      .fontSize(10)
      .text(`${edu.startedAt} - ${edu.endedAt || "current"}`);

    edu.description &&
      doc.moveDown().font("Helvetica-Bold").fontSize(10).text(edu.description);
  });
}

function renderSkills(doc: PDFFile, skills: Skills[]) {
  sectionTitle(doc, "Skills");
  doc.moveDown();

  const skillsText = skills.map((skill) => skill.skill).join(" • ");
  const height = doc.heightOfString(skillsText, { width: 500 });

  ensureSpace(doc, height);

  doc.font("Helvetica").fontSize(11).text(skillsText, { width: 500 });
}
