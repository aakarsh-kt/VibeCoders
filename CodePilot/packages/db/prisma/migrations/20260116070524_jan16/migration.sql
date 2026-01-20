/*
  Warnings:

  - You are about to drop the `CodeSpaces` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CodeSpacesUserMetadata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Participants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpaceData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserMetadata` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('INSERT', 'DELETE', 'REPLACE');

-- DropForeignKey
ALTER TABLE "CodeSpacesUserMetadata" DROP CONSTRAINT "CodeSpacesUserMetadata_id_fkey";

-- DropForeignKey
ALTER TABLE "CodeSpacesUserMetadata" DROP CONSTRAINT "CodeSpacesUserMetadata_userId_fkey";

-- DropForeignKey
ALTER TABLE "Participants" DROP CONSTRAINT "Participants_codeSpaceId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceData" DROP CONSTRAINT "SpaceData_codeSpaceId_fkey";

-- DropForeignKey
ALTER TABLE "UserMetadata" DROP CONSTRAINT "UserMetadata_userId_fkey";

-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "CodeSpaces";

-- DropTable
DROP TABLE "CodeSpacesUserMetadata";

-- DropTable
DROP TABLE "Participants";

-- DropTable
DROP TABLE "SpaceData";

-- DropTable
DROP TABLE "UserMetadata";

-- DropEnum
DROP TYPE "Languages";

-- DropEnum
DROP TYPE "Roles";

-- CreateTable
CREATE TABLE "CodeSpaceMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "CodeSpaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeSpace" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodeSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "OperationType" NOT NULL,
    "startLine" INTEGER NOT NULL,
    "startCol" INTEGER NOT NULL,
    "endLine" INTEGER,
    "endCol" INTEGER,
    "content" TEXT,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Snapshot" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CodeSpaceMember_spaceId_idx" ON "CodeSpaceMember"("spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "CodeSpaceMember_userId_spaceId_key" ON "CodeSpaceMember"("userId", "spaceId");

-- CreateIndex
CREATE INDEX "Operation_spaceId_version_idx" ON "Operation"("spaceId", "version");

-- CreateIndex
CREATE INDEX "Snapshot_spaceId_version_idx" ON "Snapshot"("spaceId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "CodeSpaceMember" ADD CONSTRAINT "CodeSpaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeSpaceMember" ADD CONSTRAINT "CodeSpaceMember_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "CodeSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "CodeSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "CodeSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
