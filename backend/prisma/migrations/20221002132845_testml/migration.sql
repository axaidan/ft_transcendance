-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "login" TEXT NOT NULL,
    "username" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achivments" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "descriptions" TEXT,

    CONSTRAINT "achivments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AchivmentToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_login_key" ON "user"("login");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "achivments_title_key" ON "achivments"("title");

-- CreateIndex
CREATE UNIQUE INDEX "_AchivmentToUser_AB_unique" ON "_AchivmentToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_AchivmentToUser_B_index" ON "_AchivmentToUser"("B");

-- AddForeignKey
ALTER TABLE "_AchivmentToUser" ADD CONSTRAINT "_AchivmentToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "achivments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AchivmentToUser" ADD CONSTRAINT "_AchivmentToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
