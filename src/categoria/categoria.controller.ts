import {BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Session} from "@nestjs/common";
import {CategoriaService} from "./categoria.service";
import {CategoriaEntity} from "./categoria.entity";
import {CategoriaCreateDto} from "./categoria.create-dto";
import {validate} from "class-validator";
import {DeleteResult, Like} from "typeorm";


@Controller('categoria')
export class CategoriaController {

    constructor(
        private readonly _categoriaService: CategoriaService
    ) {
    }

    @Get('callme')
    sayName() {
        return 'categoria'
    }

    @Post()
    async crearUnaCategoria(
        @Body() categoria: CategoriaEntity,
        @Session() session,
    ): Promise<CategoriaEntity> {
        if(session.usuario!==undefined){
            let ban=false;
            session.usuario.roles.forEach(value=>{
                if(value=="AD"){
                    ban=true;
                }
            });
            if (ban){
                if (categoria) {
                    let categoriadto = new CategoriaCreateDto();
                    categoriadto.nombre = categoria.nombre;
                    const validacion = await validate(categoriadto);
                    if (validacion.length === 0) {
                        try {
                            return this._categoriaService.crearUno(categoria);
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        throw new BadRequestException('Error validando');
                    }
                } else {
                    throw new BadRequestException('No se envia categoria')
                }
            }
            else{
                throw new BadRequestException("no posee permisos para realizar esta accion");
            }
        }else{
            throw new BadRequestException("no existe una session activa");
        }
    }

    @Delete(':id')
    eliminarCategoria(
        @Param('id') idCategoria: string,
        @Session()session,
    ): Promise<DeleteResult> {

        if(session.usuario!==undefined){
            let ban=false;
            session.usuario.roles.forEach(value=>{
                if(value=="AD"){
                    ban=true;
                }
            });
            if (ban){
                if(idCategoria)//todo agregar restriccion en creacion de categorias
                {
                    try {
                        console.log(idCategoria);
                        return this._categoriaService.borrarUno(+idCategoria);
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
            else{
                throw new BadRequestException("no posee permisos para realizar esta accion");
            }
        }else{
            throw new BadRequestException("no existe una session activa");
        }
    }

    @Get()
    buscarCategoria(
        @Query("categoria") categoria:string,
    ):Promise<CategoriaEntity[]>{
        let where={};
        if (categoria){
            where={nombre:Like(`%${categoria}%`)};
        }
        return this._categoriaService.buscar(where);
    }
}
