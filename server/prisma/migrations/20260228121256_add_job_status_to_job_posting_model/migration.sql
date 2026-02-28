-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobPosting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "salaryFrom" INTEGER,
    "salaryTo" INTEGER,
    "level" TEXT,
    "yearsOfExperience" INTEGER,
    "jobType" TEXT NOT NULL DEFAULT 'FULL_TIME',
    "location" TEXT NOT NULL,
    "arrangement" TEXT NOT NULL DEFAULT 'ONSITE',
    "status" TEXT NOT NULL DEFAULT 'DRAFTED',
    "recruiterId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JobPosting_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JobPosting" ("arrangement", "createdAt", "description", "id", "jobType", "level", "location", "recruiterId", "salaryFrom", "salaryTo", "summary", "updatedAt", "yearsOfExperience") SELECT "arrangement", "createdAt", "description", "id", "jobType", "level", "location", "recruiterId", "salaryFrom", "salaryTo", "summary", "updatedAt", "yearsOfExperience" FROM "JobPosting";
DROP TABLE "JobPosting";
ALTER TABLE "new_JobPosting" RENAME TO "JobPosting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
