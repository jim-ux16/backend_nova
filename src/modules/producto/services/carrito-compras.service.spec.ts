import { Test, TestingModule } from '@nestjs/testing';
import { CarritoComprasService } from './carrito-compras.service';

describe('CarritoComprasService', () => {
  let service: CarritoComprasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarritoComprasService],
    }).compile();

    service = module.get<CarritoComprasService>(CarritoComprasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
