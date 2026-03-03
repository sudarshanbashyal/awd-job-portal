// packages
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

// libs
import {
  STATUS_CHANGED_FILEPATH,
  APPLICATION_RECEIVED_FILEPATH,
} from "./email-templates";

// prisma
import { JobApplicationStatus } from "generated/prisma/enums";

// types
interface ApplicationReceivedEmailVars {
  firstName: string;
  jobTitle: string;
}

interface StatusUpdatedEmailVars {
  firstName: string;
  jobTitle: string;
  newStatus: JobApplicationStatus;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_SMTP_FROM,
    pass: process.env.GMAIL_SMTP_PW,
  },
});

export async function sendMail(
  receiverEmail: string,
  subject: string,
  content: string,
) {
  try {
    const info = await transporter.sendMail({
      from: `"Hire.ly" <${process.env.GMAIL_SMTP_FROM}>`,
      to: receiverEmail,
      subject: subject,
      html: content,
    });
    console.log(info);
  } catch (error) {
    console.error(error);
  }
}

const renderTemplate = async <T extends object>(
  filename: string,
  variables: T,
) => {
  try {
    const filePath = path.join(__dirname, "email-templates", filename);
    let htmlContent = fs.readFileSync(filePath).toString();
    for (let key in variables) {
      htmlContent = htmlContent.replace(`{{${key}}}`, variables[key] as string);
    }
    return htmlContent;
  } catch (error) {
    return null;
  }
};

export const sendApplicationReceivedEmail = async (
  receiverEmail: string,
  emailVariables: ApplicationReceivedEmailVars,
) => {
  try {
    const template = await renderTemplate(
      APPLICATION_RECEIVED_FILEPATH,
      emailVariables,
    );
    if (template)
      await sendMail(receiverEmail, "Application received", template);
  } catch (e) {
    console.error(e);
  }
};

export const sendStatusUpdatedEmail = async (
  receiverEmail: string,
  emailVariables: StatusUpdatedEmailVars,
) => {
  try {
    const template = await renderTemplate(STATUS_CHANGED_FILEPATH, {
      ...emailVariables,
      newStatus: emailVariables.newStatus
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase()),
    });
    if (template)
      await sendMail(receiverEmail, "Application updated", template);
  } catch (e) {
    console.error(e);
  }
};
