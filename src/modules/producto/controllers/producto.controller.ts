
import { Controller, Get, InternalServerErrorException, Param, Post, Query, Render } from '@nestjs/common';
import { ProductoService } from '../services/producto.service';
import { categoryList } from '@core/data/categorias';

@Controller('producto')
export class ProductoController {

    constructor(
        private readonly _prodServ:ProductoService
    ){

    }

    
    @Get()
    @Render('productos')
    async root(@Query('category') categoryFilter:string, @Query('product_desc') productDesc:string){

        const filters = {};

        if(categoryFilter){
            filters['category'] = categoryFilter;
        }

        if(productDesc){
            filters['desc'] = productDesc;
        }

        const list = await this._prodServ.findProducts(filters);
        return {list, categories: categoryList, filters};

    }

    @Get(':cat_id')
    async loadProductByCategory(@Param('cat_id') catId:string){

        return this._prodServ.saveOneProductCategory(catId);

        
    }

}
