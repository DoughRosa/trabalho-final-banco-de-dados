/*
  Warnings:

  - Added the required column `content` to the `tweet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tweet" ADD COLUMN     "content" VARCHAR(100) NOT NULL;
