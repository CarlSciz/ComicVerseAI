-- Enable pgvector for future semantic search and recommendation embeddings.
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ComicFormat" AS ENUM ('SINGLE_ISSUE', 'GRAPHIC_NOVEL', 'TRADE_PAPERBACK', 'OMNIBUS', 'DIGITAL');

-- CreateEnum
CREATE TYPE "CollectionStatus" AS ENUM ('OWNED', 'WISHLIST', 'READING', 'READ', 'LOANED', 'SOLD');

-- CreateEnum
CREATE TYPE "CreatorRole" AS ENUM ('WRITER', 'ARTIST', 'PENCILLER', 'INKER', 'COLORIST', 'LETTERER', 'COVER_ARTIST', 'EDITOR');

-- CreateEnum
CREATE TYPE "EmbeddingSourceType" AS ENUM ('COMIC', 'SERIES', 'CREATOR', 'USER_NOTE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "email" TEXT,
    "displayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publisher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "publisherId" TEXT NOT NULL,
    "startYear" INTEGER,
    "endYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comic" (
    "id" TEXT NOT NULL,
    "seriesId" TEXT,
    "publisherId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issueNumber" TEXT,
    "volumeLabel" TEXT,
    "format" "ComicFormat" NOT NULL,
    "releaseYear" INTEGER,
    "coverImageUrl" TEXT,
    "primaryColor" TEXT,
    "description" TEXT,
    "isbn" TEXT,
    "upc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComicCreator" (
    "comicId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "role" "CreatorRole" NOT NULL,

    CONSTRAINT "ComicCreator_pkey" PRIMARY KEY ("comicId","creatorId","role")
);

-- CreateTable
CREATE TABLE "UserComic" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "comicId" TEXT NOT NULL,
    "status" "CollectionStatus" NOT NULL DEFAULT 'OWNED',
    "condition" TEXT,
    "storage" TEXT,
    "notes" TEXT,
    "rating" INTEGER,
    "acquiredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserComic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionEmbedding" (
    "id" TEXT NOT NULL,
    "comicId" TEXT,
    "sourceType" "EmbeddingSourceType" NOT NULL,
    "sourceId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "embedding" vector(1536),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectionEmbedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_externalId_key" ON "User"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Publisher_name_key" ON "Publisher"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Publisher_slug_key" ON "Publisher"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_slug_key" ON "Creator"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Series_slug_key" ON "Series"("slug");

-- CreateIndex
CREATE INDEX "Series_publisherId_idx" ON "Series"("publisherId");

-- CreateIndex
CREATE INDEX "Comic_publisherId_idx" ON "Comic"("publisherId");

-- CreateIndex
CREATE INDEX "Comic_seriesId_idx" ON "Comic"("seriesId");

-- CreateIndex
CREATE INDEX "Comic_format_idx" ON "Comic"("format");

-- CreateIndex
CREATE INDEX "Comic_releaseYear_idx" ON "Comic"("releaseYear");

-- CreateIndex
CREATE INDEX "ComicCreator_creatorId_idx" ON "ComicCreator"("creatorId");

-- CreateIndex
CREATE INDEX "UserComic_userId_status_idx" ON "UserComic"("userId", "status");

-- CreateIndex
CREATE INDEX "UserComic_comicId_idx" ON "UserComic"("comicId");

-- CreateIndex
CREATE UNIQUE INDEX "UserComic_userId_comicId_key" ON "UserComic"("userId", "comicId");

-- CreateIndex
CREATE INDEX "CollectionEmbedding_comicId_idx" ON "CollectionEmbedding"("comicId");

-- CreateIndex
CREATE INDEX "CollectionEmbedding_sourceType_sourceId_idx" ON "CollectionEmbedding"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "CollectionEmbedding_embedding_hnsw_idx"
ON "CollectionEmbedding"
USING hnsw ("embedding" vector_cosine_ops)
WHERE "embedding" IS NOT NULL;

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comic" ADD CONSTRAINT "Comic_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comic" ADD CONSTRAINT "Comic_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComicCreator" ADD CONSTRAINT "ComicCreator_comicId_fkey" FOREIGN KEY ("comicId") REFERENCES "Comic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComicCreator" ADD CONSTRAINT "ComicCreator_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserComic" ADD CONSTRAINT "UserComic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserComic" ADD CONSTRAINT "UserComic_comicId_fkey" FOREIGN KEY ("comicId") REFERENCES "Comic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionEmbedding" ADD CONSTRAINT "CollectionEmbedding_comicId_fkey" FOREIGN KEY ("comicId") REFERENCES "Comic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
