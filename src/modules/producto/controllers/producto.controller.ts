
import { Controller, Get, Post, Render } from '@nestjs/common';
import { ProductoService } from '../services/producto.service';

@Controller('producto')
export class ProductoController {

    constructor(
        private readonly _prodServ:ProductoService
    ){

    }

    
    @Get()
    @Render('productos')
    async root(){

        const list = await this._prodServ.findProducts();
        return {list};

    }

    @Post()
    loadProducts(){
        return this._prodServ.saveProducts();
    }

}
