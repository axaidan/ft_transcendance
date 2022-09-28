-- CreateTable
CREATE TABLE "Relation" (
    "id" SERIAL NOT NULL,
    "user_id1" INTEGER NOT NULL,
    "user_id2" INTEGER NOT NULL,

    CONSTRAINT "Relation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_user_id1_fkey" FOREIGN KEY ("user_id1") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_user_id2_fkey" FOREIGN KEY ("user_id2") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
