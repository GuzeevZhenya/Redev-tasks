-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "uniqueLink" TEXT NOT NULL,
    "hasResponded" BOOLEAN NOT NULL DEFAULT false,
    "willAttend" BOOLEAN,
    "guestsCount" INTEGER DEFAULT 1,
    "message" TEXT,
    "respondedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_email_key" ON "Guest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Guest_uniqueLink_key" ON "Guest"("uniqueLink");
