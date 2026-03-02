/*
  Warnings:

  - You are about to drop the column `companyName` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Education` table. All the data in the column will be lost.
  - Added the required column `course` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instituteName` to the `Education` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Education" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "instituteName" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "startedAt" DATETIME NOT NULL,
    "endedAt" DATETIME,
    "applicantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Education_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Education" ("applicantId", "createdAt", "description", "endedAt", "id", "location", "startedAt", "updatedAt") SELECT "applicantId", "createdAt", "description", "endedAt", "id", "location", "startedAt", "updatedAt" FROM "Education";
DROP TABLE "Education";
ALTER TABLE "new_Education" RENAME TO "Education";
CREATE UNIQUE INDEX "Education_applicantId_key" ON "Education"("applicantId");
CREATE TABLE "new_ProfessionalExperience" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "endedAt" DATETIME,
    "description" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProfessionalExperience_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProfessionalExperience" ("applicantId", "companyName", "createdAt", "description", "endedAt", "id", "location", "role", "startedAt", "updatedAt") SELECT "applicantId", "companyName", "createdAt", "description", "endedAt", "id", "location", "role", "startedAt", "updatedAt" FROM "ProfessionalExperience";
DROP TABLE "ProfessionalExperience";
ALTER TABLE "new_ProfessionalExperience" RENAME TO "ProfessionalExperience";
CREATE UNIQUE INDEX "ProfessionalExperience_applicantId_key" ON "ProfessionalExperience"("applicantId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
