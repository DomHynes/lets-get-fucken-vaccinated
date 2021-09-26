-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "centreId" TEXT NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_centreId_fkey" FOREIGN KEY ("centreId") REFERENCES "Centre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
