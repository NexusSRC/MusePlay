-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "thumbnaidBig" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "thumbnailSml" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '';
