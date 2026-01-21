/*
  Warnings:

  - Added the required column `name` to the `CodeSpace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CodeSpace" ADD COLUMN     "name" TEXT;

-- Backfill existing rows so we can make the column required.
UPDATE "CodeSpace" SET "name" = "language" WHERE "name" IS NULL;

ALTER TABLE "CodeSpace" ALTER COLUMN "name" SET NOT NULL;
