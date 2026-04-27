-- CreateInitialTables
-- This migration was created from schema.prisma

BEGIN;

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Brief" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactMethod" TEXT NOT NULL,
    "messenger" TEXT,
    "contactTime" TEXT,
    "goal" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "functionalModules" TEXT NOT NULL,
    "valueProposition" TEXT,
    "targetAudience" TEXT,
    "uniqueness" TEXT,
    "competitors" TEXT,
    "existingWork" TEXT,
    "references" TEXT,
    "expectations" TEXT,
    "needAuth" BOOLEAN NOT NULL DEFAULT false,
    "needApi" BOOLEAN NOT NULL DEFAULT false,
    "exampleSites" TEXT,
    "designStyle" TEXT,
    "budget" TEXT NOT NULL,
    "deadline" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "comments" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Brief_pkey" PRIMARY KEY ("id")
);

COMMIT;