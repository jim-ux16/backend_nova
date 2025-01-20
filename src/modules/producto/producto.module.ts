import { Module } from '@nestjs/common';
import { ProductoController } from './controllers/producto.controller';
import { ProductoService } from './services/producto.service';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { CarritoComprasService } from './services/carrito-compras.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductoController],
  providers: [ProductoService, CarritoComprasService]
})
export class ProductoModule {}
