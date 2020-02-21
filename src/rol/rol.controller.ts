import {BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Res, Session} from '@nestjs/common';
import {RolEntity} from "./rol.entity";
import {RolService} from "./rol.service";
import {RolCreateDto} from "./rol.create-dto";
import {validate} from "class-validator";
import {DeleteResult, Like} from "typeorm";


@Controller('rol')
export class RolController {

    constructor(
        private readonly _rolService: RolService,
    ) {
    }


    @Get('sayhey')
    sayName() {
        return 'rol'
    }

    @Get('buscar')
    async buscar(
        @Session() session,
        @Res()res,
        @Query('skip') skip?: string | number,
        @Query('take') take?: string | number,
        @Query('rol') where?: string,
        @Query('order') order?: string,
    ) {
        if (session.usuario !== undefined) {
            let bandera: boolean = false;
            session.usuario.roles.forEach(value => {
                if (value === "AD") {
                    bandera = true;
                }
            });
            if (bandera) {
                let where1 = {};
                if (where) {
                    where1 = [
                        {nombre: Like(`%${where}%`)},
                        {descripcion: Like(`%${where}%`)},
                    ];
                }
                const roles = await this._rolService
                    .buscar(
                        where1
                    );
                res.render('rol/ruta/buscar-mostrar-rol',
                    {
                        datos: {
                            rol: roles
                        }
                    });
            } else {
                res.render(
                    'rol/ruta/crear-rol',
                    {
                        datos:{
                            titulo:'No tiene permisos',
                            editable:false
                        }
                    }
                );
            }
        } else {
            res.render(
                'rol/ruta/crear-rol',
                {
                    datos:{
                        titulo:'No tiene permisos',
                        editable:false
                    }
                }
            );
        }

    }

    @Get('/crear')
    async agregar(
        @Body() rol: RolEntity,
        @Session() session,
        @Res()res,
    ) {
        if (session.usuario !== undefined) {
            let bandera: boolean = false;
            session.usuario.roles.forEach(value => {
                if (value === "AD") {
                    bandera = true;
                }
            });
            if (bandera) {
                res.render(
                    'rol/ruta/crear-rol',
                    {
                        datos:{
                            titulo:'Editar rol',
                            editable:true
                        }
                    }
                )
            } else {
                res.render(
                    'rol/ruta/crear-rol',
                    {
                        datos:{
                            titulo:'No tiene permisos',
                            editable:false
                        }
                    }
                );
            }
        } else {
            res.render(
                'rol/ruta/crear-rol',
                {
                    datos:{
                        titulo:'No existe una sesion activa',
                        editable:false
                    }
                }
            );
        }

    }

    @Post()
    async agregarRol(
        @Body() rol: RolEntity,
        @Session() session,
        @Res()res,
    ){
        if (session.usuario !== undefined) {
            let bandera: boolean = false;
            session.usuario.roles.forEach(value => {
                if (value === "AD") {
                    bandera = true;
                }
            });
            if (bandera) {
                const validadion = await validate(this.rolDTo(rol));
                if (validadion.length === 0) {
                    this._rolService.crearUno(rol);
                    res.redirect('/rol/buscar');
                } else {
                    res.render(
                        'rol/ruta/crear-rol',
                        {
                            datos:{
                                titulo:'No tiene permisos',
                                editable:true,
                                error:'error en validacion',
                                rol
                            }
                        }
                    );
                }
            } else {
                res.render(
                    'rol/ruta/crear-rol',
                    {
                        datos:{
                            titulo:'No tiene permisos',
                            editable:false
                        }
                    }
                );
            }
        } else {
            res.render(
                'rol/ruta/crear-rol',
                {
                    datos:{
                        titulo:'No existe una sesion activa',
                        editable:false
                    }
                }
            );
        }

    }

    @Get(":id")
    async editar(
        @Param("id") id: string,
        @Session() session,
        @Res()res,
    ){
        if (session.usuario !== undefined) {
            let bandera: boolean = false;
            session.usuario.roles.forEach(value => {
                if (value === "AD") {
                    bandera = true;
                }
            });
            if (bandera) {
                const rol=await this._rolService.encontrarUno(+id);
                res.render(
                    'rol/ruta/crear-rol',
                    {
                        datos:{
                            titulo:'Editar rol',
                            editable:true,
                            editar:true,
                            rol
                        }
                    }
                )
            } else {
                res.render(
                    'rol/ruta/crear-rol',
                    {
                        datos:{
                            titulo:'No tiene permisos para realizar esta accion',
                            editable:false,
                        }
                    }
                )
            }
        } else {
            res.render(
                'rol/ruta/crear-rol',
                {
                    datos:{
                        titulo:'no existe una session activa',
                        editable:false,
                    }
                }
            );
        }

    }

    @Post(":id")
    async editarRol(
        @Body() rol: RolEntity,
        @Param("id") id: string,
        @Session() session,
        @Res()res,
    ){
        if (session.usuario !== undefined) {
            let bandera: boolean = false;
            session.usuario.roles.forEach(value => {
                if (value === "AD") {
                    bandera = true;
                }
            });
            if (bandera) {
                const validadion = await validate(this.rolDTo(rol));
                if (validadion.length === 0) {
                    this._rolService.actualizarUno(+id, rol);
                    res.redirect("/rol/buscar")
                } else {
                    rol.id= +id;
                    res.render(
                        'rol/ruta/crear-rol',
                        {
                            datos:{
                                titulo:'Editar rol',
                                editable:true,
                                editar:true,
                                error:"Error validando",
                                rol
                            }
                        }
                    );
                }
            } else {
                res.render(
                    'rol/ruta/crear-rol',
                    {
                        datos:{
                            titulo:'No tiene permisos para realizar esta accion',
                            editable:false,
                            editar:true,
                            error:"Error validando",
                            rol
                        }
                    }
                );
            }
        } else {
            res.render(
                'rol/ruta/crear-rol',
                {
                    datos:{
                        titulo:'no existe una session activa',
                        editable:false,
                    }
                }
            )
        }

    }

    @Post('/eliminar/:id')
    borrarRol(
        @Param('id')id: string,
        @Session()session,
        @Res() res,
    ) {
        if (session.usuario !== undefined) {
            let bandera: boolean = false;
            session.usuario.roles.forEach(value => {
                if (value === "AD") {
                    bandera = true;
                }
            });
            if (bandera) {
                res.redirect('/rol/buscar');
                return this._rolService.borrarUno(+id);
            } else {
                throw new BadRequestException("No posee permisos para realizar esta accion");
            }
        } else {
            throw new BadRequestException("No existe una sesion activa");
        }
    }

    private rolDTo(rol: RolEntity): RolCreateDto {
        let rolDto = new RolCreateDto();
        rolDto.rol = rol.nombre;
        rolDto.descripcion = rol.descripcion;
        return rolDto;
    }

}
