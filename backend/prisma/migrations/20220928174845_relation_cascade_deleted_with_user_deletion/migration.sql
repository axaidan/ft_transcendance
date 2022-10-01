-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_user_id1_fkey";

-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_user_id2_fkey";

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_user_id1_fkey" FOREIGN KEY ("user_id1") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_user_id2_fkey" FOREIGN KEY ("user_id2") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
