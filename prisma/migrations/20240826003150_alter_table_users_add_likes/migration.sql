-- CreateEnum
CREATE TYPE "TweetType" AS ENUM ('Tweet', 'Retweet');

-- AlterTable
ALTER TABLE "tweets" ADD COLUMN     "tweet_type" "TweetType" NOT NULL DEFAULT 'Tweet';

-- CreateTable
CREATE TABLE "replies" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "content" VARCHAR(100) NOT NULL,
    "tweetId" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "replies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "tweets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
