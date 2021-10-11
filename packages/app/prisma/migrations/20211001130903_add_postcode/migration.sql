-- CreateTable
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TABLE "Postcode" (
    "id" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "location" "public".geography,

    CONSTRAINT "Postcode_pkey" PRIMARY KEY ("id")
);
