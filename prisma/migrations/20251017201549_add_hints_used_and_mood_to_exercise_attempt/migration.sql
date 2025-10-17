/*
  Warnings:

  - Added the required column `mood` to the `exercise_attempts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exercise_attempts" ADD COLUMN     "hintsUsed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mood" TEXT NOT NULL;
