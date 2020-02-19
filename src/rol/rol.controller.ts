import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Session } from '@nestjs/common';
import {RolEntity} from "./rol.entity";
import {RolService} from "./rol.service";
import {RolCreateDto} from "./rol.create-dto";
import {validate} from "class-validator";
import {DeleteResult} from "typeorm";


@Controller('rol')
export class RolController {

    constructor(
        private readonly _rolService:RolService,
    ) {}


    @Get('sayhey')
    sayName(){
        return 'rol'
    }

    @Get('buscar')
    async buscar(
        @Query('skip') skip?: string | number,
        @Query('take') take?: string | number,
        @Query('where') where?: string,
        @Query('order') order?: string,
    ): Promise<RolEntity[]> {
        if (order) {
            try {
                order = JSON.parse(order);
            } catch (e) {
                order = undefined;
            }
        }
        if (where) {
            try {
                where = JSON.parse(where);
            } catch (e) {
                where = undefined;
            }
        }
        if (skip) {
            skip = +skip;
        }
        if (take) {
            take = +take;
        }
        return this._rolService
            .buscar(
                where,
                skip as number,
                take as number,
                order,
            );
    }

    @Post()
    async agregarRol(
        @Body() rol:RolEntity,
        @Session() session,
    ):Promise<RolEntity>{
        if (session.usuario!==undefined){
            let bandera:boolean=false;
            session.usuario.roles.forEach(value=>{
                if(value==="AD"){
                    bandera=true;
                }
            });
            if(bandera){
                const validadion=await validate(this.rolDTo(rol));
                if(validadion.length===0){
                    return this._rolService.crearUno(rol);
                }else{
                    throw new BadRequestException('Error en validacion');
                }
            }else{
                throw new BadRequestException('No tiene permisos');
            }
        }else {
            throw new BadRequestException("No existe una sesion activa");
        }

    }

    @Post(":id")
    async editarRol(
      @Body() rol:RolEntity,
      @Param("id") id:string,
      @Session() session,
    ):Promise<RolEntity>{
        if (session.usuario!==undefined){
            let bandera:boolean=false;
            session.usuario.roles.forEach(value=>{
                if(value==="AD"){
                    bandera=true;
                }
            });
            if(bandera){
                const validadion=await validate(this.rolDTo(rol));
                if(validadion.length===0) {
                    return this._rolService.actualizarUno(+id, rol);
                }else{
                    throw new BadRequestException("Error validando");
                }
            }else{
                throw new BadRequestException("No tiene permisos para realizar esta accion");
            }
        }else{
            throw new BadRequestException("No existe una sesion activa");
        }

    }

    @Delete(':id')
    borrarRol(
        @Param('id')id:string,
        @Session()session
    ):Promise<DeleteResult>{
        if (session.usuario!==undefined){
            let bandera:boolean=false;
            session.usuario.roles.forEach(value=>{
                if(value==="AD"){
                    bandera=true;
                }
            });
            if(bandera){
                return this._rolService.borrarUno(+id);
            }else{
                throw new BadRequestException("No posee permisos para realizar esta accion");
            }
        }else{
            throw new BadRequestException("No existe una sesion activa");
        }
    }

    private rolDTo (rol: RolEntity):RolCreateDto{
        let rolDto=new RolCreateDto();
        rolDto.rol=rol.nombre;
        rolDto.descripcion=rol.descripcion;
        return rolDto;
    }

}
