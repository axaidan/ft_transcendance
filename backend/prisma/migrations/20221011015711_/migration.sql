/*
  Warnings:

  - You are about to drop the `Avatar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_avatarId_fkey";

-- DropTable
DROP TABLE "Avatar";

-- CreateTable
CREATE TABLE "avatar" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL,
    "public_id" INTEGER NOT NULL,

    CONSTRAINT "avatar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "avatar_url_key" ON "avatar"("url");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "avatar"("id") ON DELETE SET NULL ON UPDATE CASCADE;
