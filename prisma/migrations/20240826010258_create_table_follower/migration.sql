/*
  Warnings:

  - The values [Retweet] on the enum `TweetType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TweetType_new" AS ENUM ('Tweet', 'Reply');
ALTER TABLE "tweets" ALTER COLUMN "tweet_type" DROP DEFAULT;
ALTER TABLE "tweets" ALTER COLUMN "tweet_type" TYPE "TweetType_new" USING ("tweet_type"::text::"TweetType_new");
ALTER TYPE "TweetType" RENAME TO "TweetType_old";
ALTER TYPE "TweetType_new" RENAME TO "TweetType";
DROP TYPE "TweetType_old";
ALTER TABLE "tweets" ALTER COLUMN "tweet_type" SET DEFAULT 'Tweet';
COMMIT;

-- CreateTable
CREATE TABLE "followers" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "follower_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "followers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
