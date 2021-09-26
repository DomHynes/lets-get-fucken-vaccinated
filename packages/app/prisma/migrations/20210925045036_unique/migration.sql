/*
  Warnings:

  - A unique constraint covering the columns `[time,centreId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Appointment_time_centreId_key" ON "Appointment"("time", "centreId");
