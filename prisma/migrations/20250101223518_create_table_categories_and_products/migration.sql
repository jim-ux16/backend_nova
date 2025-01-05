-- CreateTable
CREATE TABLE `CategProd` (
    `codigo` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actuEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CategProd_codigo_key`(`codigo`),
    PRIMARY KEY (`codigo`)
) 
ENGINE=InnoDB
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Producto` (
    `codigo` VARCHAR(191) NOT NULL,
    `imgLink` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL,
    `precio` DECIMAL(8, 2) NOT NULL,
    `codPromo` VARCHAR(191) NULL,
    `catId` VARCHAR(191) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actuEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Producto_codigo_key`(`codigo`),
    PRIMARY KEY (`codigo`)
) 
ENGINE=InnoDB
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Producto` ADD CONSTRAINT `Producto_catId_fkey` FOREIGN KEY (`catId`) REFERENCES `CategProd`(`codigo`) ON DELETE RESTRICT ON UPDATE CASCADE;
