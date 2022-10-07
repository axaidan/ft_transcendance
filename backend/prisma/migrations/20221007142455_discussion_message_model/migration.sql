-- CreateTable
CREATE TABLE "discussionMessage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "discussionId" INTEGER NOT NULL,

    CONSTRAINT "discussionMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "discussionMessage" ADD CONSTRAINT "discussionMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussionMessage" ADD CONSTRAINT "discussionMessage_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
