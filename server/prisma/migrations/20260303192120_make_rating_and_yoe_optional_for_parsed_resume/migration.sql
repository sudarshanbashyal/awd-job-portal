-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ParsedResume" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'PARSING',
    "yearsOfExperience" REAL,
    "rating" INTEGER,
    "applicationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ParsedResume_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "JobApplication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ParsedResume" ("applicationId", "createdAt", "id", "rating", "status", "updatedAt", "yearsOfExperience") SELECT "applicationId", "createdAt", "id", "rating", "status", "updatedAt", "yearsOfExperience" FROM "ParsedResume";
DROP TABLE "ParsedResume";
ALTER TABLE "new_ParsedResume" RENAME TO "ParsedResume";
CREATE UNIQUE INDEX "ParsedResume_applicationId_key" ON "ParsedResume"("applicationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
