/*
  Warnings:

  - Added the required column `jobId` to the `SkillAssessment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SkillAssessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'PARSING',
    "description" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "applicantId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SkillAssessment_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SkillAssessment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobPosting" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SkillAssessment" ("applicantId", "createdAt", "description", "id", "rating", "status", "updatedAt") SELECT "applicantId", "createdAt", "description", "id", "rating", "status", "updatedAt" FROM "SkillAssessment";
DROP TABLE "SkillAssessment";
ALTER TABLE "new_SkillAssessment" RENAME TO "SkillAssessment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
