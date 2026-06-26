-- CreateTable
CREATE TABLE "Cuota" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "montoEsperado" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cuota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PagoCuota" (
    "id" SERIAL NOT NULL,
    "alumnoId" INTEGER NOT NULL,
    "cuotaId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "monto" DECIMAL(12,2) NOT NULL,
    "observacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PagoCuota_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cuota_mes_anio_key" ON "Cuota"("mes", "anio");

-- CreateIndex
CREATE UNIQUE INDEX "PagoCuota_alumnoId_cuotaId_key" ON "PagoCuota"("alumnoId", "cuotaId");

-- AddForeignKey
ALTER TABLE "PagoCuota" ADD CONSTRAINT "PagoCuota_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PagoCuota" ADD CONSTRAINT "PagoCuota_cuotaId_fkey" FOREIGN KEY ("cuotaId") REFERENCES "Cuota"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
