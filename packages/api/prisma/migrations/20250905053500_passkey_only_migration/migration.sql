/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `passkeys` table. All the data in the column will be lost.
  - You are about to drop the column `encryptedData` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `oauth_accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."oauth_accounts" DROP CONSTRAINT "oauth_accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropIndex
DROP INDEX "public"."users_username_key";

-- AlterTable
ALTER TABLE "public"."passkeys" DROP COLUMN "updatedAt",
ADD COLUMN     "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "encryptedData",
DROP COLUMN "username",
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."oauth_accounts";

-- DropTable
DROP TABLE "public"."sessions";

-- CreateTable
CREATE TABLE "public"."server_sessions" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "server_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "server_sessions_token_key" ON "public"."server_sessions"("token");

-- AddForeignKey
ALTER TABLE "public"."server_sessions" ADD CONSTRAINT "server_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
