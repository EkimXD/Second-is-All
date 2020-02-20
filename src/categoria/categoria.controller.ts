import {BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Res, Session} from "@nestjs/common";
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

    @Get("/crear")
    crearCartegoria(
        @Res()res,
        @Session() session
    ){
        if(session.usuario!==undefined){
            let ban=false;
            session.usuario.roles.forEach(value=>{
                if(value=="AD"){
                    ban=true;
                }
            });
            if (ban){
                res.render('categoria/ruta/crear-categoria',
                    {
                        datos:{
                            titulo:"Crear categoria",
                            editable:true
                        }

                });
            }
            else{
                res.render('categoria/ruta/crear-categoria',
                    {
                        datos:{
                            titulo:"No posee permisos para realizar esta accion",
                            editable:false
                        }

                    });
            }
        }else{
            res.render('categoria/ruta/crear-categoria',
                {
                    datos:{
                        titulo:"No existe una session activa",
                        editable:false
                    }

                });
        }
    }

    @Post()
    async crearUnaCategoria(
        @Body() categoria: CategoriaEntity,
        @Session() session,
        @Res()res,
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
                            res.render(
                                'categoria/ruta/buscar-mostrar-categoria'
                            );
                            return this._categoriaService.crearUno(categoria);
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        res.render(
                            'categoria/ruta/crear-categoria',
                            {
                                datos:{
                                    titulo:"Crear categoria",
                                    error:'Error validando',
                                    editable:true,
                                    categoria,
                                }
                            }
                        );
                    }
                } else {
                    res.render(
                        'categoria/ruta/crear-categoria',
                        {
                            datos:{
                                titulo:"Crear categoria",
                                error:'No se envia categoria',
                                editable:true,
                            }
                        }
                    );
                }
            }
            else{
                res.render(
                    'categoria/ruta/crear-categoria',
                    {
                        datos:{
                            titulo:'no posee permisos para realizar esta accion',
                            editable:false,
                        }

                    }
                );
            }
        }else{
            res.render(
                'categoria/ruta/crear-categoria',
                {
                    datos:{
                        titulo:'no existe una session activa',
                        editable:false,
                    }

                }
            );
        }
    }

    @Get("/crear/:id")
    EditarCartegoria(
        @Param("id")
        @Res()res,
        @Session() session
    ){
        if(session.usuario!==undefined){
            let ban=false;
            session.usuario.roles.forEach(value=>{
                if(value=="AD"){
                    ban=true;
                }
            });
            if (ban){
                res.render('categoria/ruta/crear-categoria',
                    {
                        datos:{
                            titulo:"Crear categoria",
                            editable:true
                        }

                    });
            }
            else{
                res.render('categoria/ruta/crear-categoria',
                    {
                        datos:{
                            titulo:"No posee permisos para realizar esta accion",
                            editable:false
                        }

                    });
            }
        }else{
            res.render('categoria/ruta/crear-categoria',
                {
                    datos:{
                        titulo:"No existe una session activa",
                        editable:false
                    }

                });
        }
    }

    @Post(":id")
    async editarUnaCategoria(
        @Body() categoria: CategoriaEntity,
        @Param("id")id:string,
        @Session() session,
        @Res()res,
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
                            res.render(
                                'categoria/ruta/buscar-mostrar-categoria'
                            );
                            return this._categoriaService.actualizarUno(+id,categoria);
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        res.render(
                            'categoria/ruta/crear-categoria',
                            {
                                datos:{
                                    titulo:"Editar categoria",
                                    error:'Error validando',
                                    editable:true,
                                    categoria,
                                }
                            }
                        );
                    }
                } else {
                    res.render(
                        'categoria/ruta/crear-categoria',
                        {
                            datos:{
                                titulo:"Editar categoria",
                                error:'No se envia categoria',
                                editable:true,
                            }
                        }
                    );
                }
            }
            else{
                res.render(
                    'categoria/ruta/crear-categoria',
                    {
                        datos:{
                            titulo:'no posee permisos para realizar esta accion',
                            editable:false,
                        }

                    }
                );
            }
        }else{
            res.render(
                'categoria/ruta/crear-categoria',
                {
                    datos:{
                        titulo:'no existe una session activa',
                        editable:false,
                    }

                }
            );
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
    async buscarCategoria(
        @Query("categoria") categoria:string,
        @Res()res,
    ):Promise<CategoriaEntity[]>{
        let where={};
        if (categoria){
            where={nombre:Like(`%${categoria}%`)};
        }
        const categorias=await this._categoriaService.buscar(where);
        res.render('categoria/ruta/buscar-mostrar-categoria',
            {
                categorias
            });
        return this._categoriaService.buscar(where);
    }
}
