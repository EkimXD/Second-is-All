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
                            res.redirect(
                                '/categoria'
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

    @Get(":id")
    async EditarCartegoria(
        @Param("id")id:string,
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
                const categoria=await this._categoriaService.encontrarUno(+id);
                res.render('categoria/ruta/crear-categoria',
                    {
                        datos:{
                            titulo:"Editar categoria",
                            editable:true,
                            editar:true,
                            categoria
                        }

                    });
            }
            else{
                res.render('categoria/ruta/crear-categoria',
                    {
                        datos:{
                            titulo:"No posee permisos para realizar esta accion",
                            editable:false,
                            editar:true,
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
    ){
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
                            await this._categoriaService.actualizarUno(+id,categoria);
                            res.redirect(
                                '/categoria'
                            );
                        } catch (error) {
                            console.log(error);
                        }
                    } else {
                        categoria.id= +id;
                        res.render(
                            'categoria/ruta/crear-categoria',
                            {
                                datos:{
                                    titulo:"Editar categoria",
                                    error:'Error validando',
                                    editable:true,
                                    editar:true,
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
                                editar:true,
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

    @Post('/eliminar/:id')
    eliminarCategoria(
        @Param('id') idCategoria: string,
        @Session()session,
        @Res()res,
    ) {
        if(session.usuario!==undefined){
            let ban=false;
            session.usuario.roles.forEach(value=>{
                if(value=="AD"){
                    ban=true;
                }
            });
            if (ban){
                if(idCategoria)
                {
                    try {
                        this._categoriaService.borrarUno(+idCategoria);
                        res.redirect("/categoria");

                    } catch (e) {
                        res.render(
                            'categoria/ruta/crear-categoria',
                            {
                                datos:{
                                    titulo:e.toString(),
                                    editable:false,
                                }

                            }
                        );
                    }
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
                datos:{
                    categorias
                }
            });
        return this._categoriaService.buscar();
    }
}
