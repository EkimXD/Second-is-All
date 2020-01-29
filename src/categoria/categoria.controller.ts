import {BadRequestException, Body, Controller, Delete, Get, Param, Post, Session} from "@nestjs/common";
import {CategoriaService} from "./categoria.service";
import {CategoriaEntity} from "./categoria.entity";
import {CategoriaCreateDto} from "./categoria.create-dto";
import {validate} from "class-validator";
import {DeleteResult} from "typeorm";


@Controller('categoria')
export class CategoriaController {

    constructor(
        private readonly _categoriaService:CategoriaService
    ) {}

    @Get('callme')
    sayName(){
        return 'categoria'
    }

    @Post()
    async crearUnaCategoria(
        @Body() categoria: CategoriaEntity,
        @Session() session,

    ) :Promise<CategoriaEntity>{
        if (categoria) {//todo agregar restriccion en creacion de categorias
            let categoriadto = new CategoriaCreateDto();
            categoriadto.nombre = categoria.nombre;
            const validacion = await validate(categoriadto);
            if (validacion.length===0){
                try{
                    return this._categoriaService.crearUno(categoria);
                //todo modificar esto cuando se haga el front
                }catch (error) {
                    console.log(error);
                }
            }else{
                throw new BadRequestException('Error validando');
                //todo modificar esto cuando se haga el front
            }
        } else {
            throw new BadRequestException('No se envia categoria')
            //todo modificar esto cuando se haga el front
        }
    }

    @Delete(':id')
    eliminarCategoria(
        @Param('id') idCategoria:string,
    ):Promise<DeleteResult>{
        try {
            console.log(idCategoria);
            return this._categoriaService.borrarUno(+idCategoria);
        }catch (e) {
            console.log(e);
        }
    }
}
