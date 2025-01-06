import { categoryList } from '@core/data/categorias';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { IWebProduct, IWebProductWithoutCatId } from '../models/web-product';
import { PrismaService } from '@modules/prisma/services/prisma.service';
import * as chalk from 'chalk';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ProductoService {

    constructor(
        private readonly _prismaServ:PrismaService
    ){}

    async findProducts(filters:any){

        try{

            let where = {};

            if(filters.category){
                where['catId'] = {
                    contains : filters.category
                }
            }

            if(filters.desc){
                where['desc'] = {contains: filters.desc}
            }

            return await this._prismaServ.producto.findMany({
                where
            });

        }catch(error){
            throw new InternalServerErrorException(error);
        }



    }

    @Cron('* * 7 * * *', {
        timeZone: 'America/Lima'
    })
    async saveProducts(){

        for (const cat of categoryList) {

            try{
                
                const productList = await this.extractFromPage(cat.codigo);

                const productListWithCat:IWebProduct[] = productList.map((prod:any) =>{
                    return {...prod, catId: cat.codigo}
                });

                await this._prismaServ.producto.deleteMany({
                    where: {
                        catId: cat.codigo
                    }
                })

                await this._prismaServ.producto.createMany({
                    data: productListWithCat
                })
                
                console.log(`Category '${cat.nombre}' saved successfully`);
                
            }catch(error){

                console.error(`Error while uploading category ${cat.nombre} with code ${cat.codigo}: `+error);

            }
        }


    }


    async extractFromPage(productCode:string):Promise<IWebProductWithoutCatId[]>{

        
        /*---*/
        console.log(`${chalk.black.bgGreen('1')} ${chalk.bold('Starting page extractor - Cat: ' + productCode)}`)
        
        const browser = await puppeteer.launch({slowMo: 200});
        const page = await browser.newPage();

        await page.authenticate({username: process.env.PAGE_USERNAME, password: process.env.PAGE_PASSWORD});
        
        await page.goto('https://www.deltron.com.pe/login.php?prev=/modulos/productos/items/ctBuscador/templates/buscador_web_v1.php', {waitUntil: 'domcontentloaded', timeout: 5 * 60 * 1000});
        await page.goto('https://www.deltron.com.pe/modulos/productos/items/ctBuscador/templates/buscador.php', {waitUntil: 'networkidle0', timeout: 5 * 60*1000});

        await page.evaluate(()=>{
            document.getElementById('chkStock')?.click();
        });

        await page.select('#GrupoLineaId', productCode);
        
        await new Promise((res) => setTimeout(res, 5000));

        console.log(`${chalk.black.bgGreen('2')} ${chalk.bold('Extracting info')}`);

        const productList = await page.evaluate(()=>{

            const tableBody = document.getElementById('tableBody');
            const rowList = tableBody?.querySelectorAll(':scope > tbody > tr');

            
            let infoList = [];

            for (let index = 0; index < (rowList.length  - 1); index++) {



                if(index > 0 ){

                    const row = rowList[index];
                    

                    //Código promoción
                    const imageList = row.getElementsByTagName('img');

                    let codigoPromocion = null;

                    if (imageList.length === 3) {
                        let fullContent = null;

                        if(imageList[1].hasAttribute("onmouseover")){

                            fullContent = (imageList[1].attributes as any).onmouseover.textContent;
                            codigoPromocion = fullContent.split("'")[1].split("_")[1];
                        }
                        
                    }

                    //Price
                    const spanList = row.getElementsByTagName("span");
                    
                    let notCotainsText = true;
                    let containsIndex = 3;
                    let rowPrice;
                    while(notCotainsText){
                        if(spanList[containsIndex].innerText.includes("IGV")){
                            rowPrice = spanList[containsIndex].innerText;
                            notCotainsText = false;
                        };

                        containsIndex++;
                    }

        
                    infoList.push({
                        codigo: row.getElementsByTagName('a')[0].text,
                        imgLink: imageList[0].src,
                        link: row.getElementsByTagName('a')[0].href,
                        desc: row.getElementsByTagName('b')[1].innerText,
                        stock: Number(row.getElementsByTagName('label')[0].innerText) || 100,
                        precio: Number(rowPrice.replaceAll(",", "").replace("US $ ", "").replace(" + IGV", "")),
                        codPromo: codigoPromocion,
                    });
                }
                
            }
            return infoList;
        

        });

        console.log(`${chalk.black.bgGreen('3')} ${chalk.bold('End of the extraction')}`)

        await browser.close();

        return productList;

        /*---*/

    }
}
