import {BadRequestException, Body, Controller, Delete, Get, Param, Post, Query} from "@nestjs/common";
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


    @Get('callme')
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
    ):Promise<RolEntity>{
        let rolDto=new RolCreateDto();
        rolDto.rol=rol.nombre;
        rolDto.descripcion=rol.descripcion;
        const validadion=await validate(rolDto);
        if(validadion.length===0){
            return this._rolService.crearUno(rol);
        }else{
            throw new BadRequestException('Error en validacion');
        }
    }

    @Delete(':id')
    borrarRol(
        @Param('id')id:string,
    ):Promise<DeleteResult>{
        return this._rolService.borrarUno(+id);
    }


}
