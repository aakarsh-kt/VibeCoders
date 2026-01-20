-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "Languages" AS ENUM ('cpp', 'python', 'javascript');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeSpacesUserMetadata" (
    "id" TEXT NOT NULL,
    "role" "Roles" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CodeSpacesUserMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeSpaces" (
    "id" TEXT NOT NULL,
    "lang" "Languages" NOT NULL,

    CONSTRAINT "CodeSpaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceData" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "senderId" TEXT NOT NULL,
    "codeSpaceId" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "SpaceData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participants" (
    "userId" TEXT NOT NULL,
    "role" "Roles" NOT NULL,
    "codeSpaceId" TEXT NOT NULL,

    CONSTRAINT "Participants_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserMetadata" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CodeSpacesUserMetadata_id_key" ON "CodeSpacesUserMetadata"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CodeSpacesUserMetadata_userId_key" ON "CodeSpacesUserMetadata"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CodeSpaces_id_key" ON "CodeSpaces"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceData_id_key" ON "SpaceData"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceData_codeSpaceId_key" ON "SpaceData"("codeSpaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Participants_userId_key" ON "Participants"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMetadata_userId_key" ON "UserMetadata"("userId");

-- AddForeignKey
ALTER TABLE "CodeSpacesUserMetadata" ADD CONSTRAINT "CodeSpacesUserMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeSpacesUserMetadata" ADD CONSTRAINT "CodeSpacesUserMetadata_id_fkey" FOREIGN KEY ("id") REFERENCES "CodeSpaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceData" ADD CONSTRAINT "SpaceData_codeSpaceId_fkey" FOREIGN KEY ("codeSpaceId") REFERENCES "CodeSpaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participants" ADD CONSTRAINT "Participants_codeSpaceId_fkey" FOREIGN KEY ("codeSpaceId") REFERENCES "CodeSpaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMetadata" ADD CONSTRAINT "UserMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
