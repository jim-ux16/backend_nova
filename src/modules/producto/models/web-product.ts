export interface IWebProduct{
    codigo: string,
    imgLink: string,
    link:string,
    desc: string,
    stock: number,
    precio: number,
    codPromo: string | null,
    catId: string

}

export type IWebProductWithoutCatId = Omit<IWebProduct, 'catId'>;