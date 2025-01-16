-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "images" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
