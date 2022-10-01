/*
  Warnings:

  - You are about to drop the column `user_id1` on the `Relation` table. All the data in the column will be lost.
  - You are about to drop the column `user_id2` on the `Relation` table. All the data in the column will be lost.
  - Added the required column `userIWatchdId` to the `Relation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Relation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_user_id1_fkey";

-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_user_id2_fkey";

-- AlterTable
ALTER TABLE "Relation" DROP COLUMN "user_id1",
DROP COLUMN "user_id2",
ADD COLUMN     "relation" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userIWatchdId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_userIWatchdId_fkey" FOREIGN KEY ("userIWatchdId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
