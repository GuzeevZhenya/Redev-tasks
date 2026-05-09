-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "uniqueLink" TEXT NOT NULL,
    "hasResponded" BOOLEAN NOT NULL DEFAULT false,
    "willAttend" BOOLEAN,
    "guestsCount" INTEGER,
    "message" TEXT,
    "respondedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Guest" ("createdAt", "email", "guestsCount", "hasResponded", "id", "message", "name", "respondedAt", "uniqueLink", "willAttend") SELECT "createdAt", "email", "guestsCount", "hasResponded", "id", "message", "name", "respondedAt", "uniqueLink", "willAttend" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
CREATE UNIQUE INDEX "Guest_email_key" ON "Guest"("email");
CREATE UNIQUE INDEX "Guest_uniqueLink_key" ON "Guest"("uniqueLink");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
