-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExtractedSkills" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "skill" TEXT NOT NULL,
    "confidence" INTEGER,
    "skillType" TEXT,
    "parsedResumeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ExtractedSkills_parsedResumeId_fkey" FOREIGN KEY ("parsedResumeId") REFERENCES "ParsedResume" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ExtractedSkills" ("confidence", "createdAt", "id", "parsedResumeId", "skill", "skillType", "updatedAt") SELECT "confidence", "createdAt", "id", "parsedResumeId", "skill", "skillType", "updatedAt" FROM "ExtractedSkills";
DROP TABLE "ExtractedSkills";
ALTER TABLE "new_ExtractedSkills" RENAME TO "ExtractedSkills";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
