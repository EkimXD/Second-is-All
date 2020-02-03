import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Module,
    Param,
    Post,
    Req,
    Res,
    Session
} from "@nestjs/common";
import {UsuarioService} from "./usuario.service";
import {UsuarioEntity} from "./usuario.entity";
import {UsuarioCreateDto} from "./usuario.create-dto";
import {validate} from "class-validator";
import {RolService} from "../rol/rol.service";
import {DeleteResult} from "typeorm";
import {UsuarioLoginDto} from "./usuario.login-dto";
import {RolEntity} from "../rol/rol.entity";


@Controller('usuario')
export class UsuarioController {
    constructor(
        private readonly _usuarioService: UsuarioService,
        private readonly _rolService: RolService,
    ) {
    }

    @Get('callme')
    async sayName() {
        return 'usuario';
    }

    @Get('get-session')
    getSession(
        @Session()session,
    ) {
        return session;
    }

    @Get('logout')
    sessionLogout(
        @Session()session,
        @Req()req
    ) {
        session.usuario = undefined;
        req.session.destroy();
        return 'Deslogueado';
    }

    @Get('login')
    async login(
        @Body('usuario') usuario: string,
        @Body('contrasena') contrasena: string,
        @Session()session
    ) {
        const validacion = await validate(this.usuarioDTOtoLG(usuario, contrasena));
        if (validacion.length === 0) {
            const where = [
                {nick: usuario},
                {correo: usuario}
            ];
            await this._usuarioService.buscar(where,['rol'])
                .then(
                    async resultado => {
                        try {
                            const result:UsuarioEntity=resultado[0];
                            if (result.contrasena===contrasena){
                                let arregloRoles:Array<string>=new Array<string>();
                                result.rol.forEach((rol,index)=>{
                                   arregloRoles.push(rol.nombre);
                                });
                                session.usuario={
                                    id_usuario:result.id_usuario,
                                    usuario:result.nick,
                                    roles:arregloRoles
                                };

                            }else {
                                console.log('Contrasena incorrecta');
                            }
                        }catch (e) {
                            console.log(e);
                            throw new BadRequestException('Imposible crear una nueva sesion, su usuario no existe o exiten duplicados');
                        }
                    }
                )
                .catch(
                    error => {
                        console.log(error);
                    }
                )
        } else {
            throw new BadRequestException('Error en validacion')
        }
    }

    @Delete(':id')
    borrarUsusario(
        @Param('id') id: string
    ): Promise<DeleteResult> {
        try {
            return this._usuarioService.borrarUno(+id);
        } catch (e) {
            console.log(e)
        }
    }

    @Post()
    async crearUsuario(
        @Body() usuario: UsuarioEntity
    ) {

        const validacion = await validate(this.usuarioDTOtoGE(usuario));
        if (validacion.length === 0) {
            const where = [{
                id: 1
            }, {
                id: 2
            }];
            await this._rolService.buscar(where)
                .then(
                    resultado => {
                        if (resultado.length === 2) {
                            usuario.rol = [resultado[0], resultado[1]];
                            this._usuarioService.crearUno(usuario);
                        } else {
                            throw new BadRequestException('No se puede crear usuario, no existen roles aplicables');
                        }
                    }
                )
                .catch(
                    error => {
                        console.log(error);
                    }
                );
        } else {
            throw new BadRequestException(`Error validando \n${validacion}`)
        }

    }

    usuarioDTOtoGE(usuario: UsuarioEntity): UsuarioCreateDto {
        let usuarioDTO = new UsuarioCreateDto();

        usuarioDTO.nombre = usuario.nombre;
        usuarioDTO.apellido = usuario.apellido;
        usuarioDTO.correo = usuario.correo;
        usuarioDTO.contrasena = usuario.contrasena;
        usuarioDTO.fecha_nac = usuario.fecha_nac;
        usuarioDTO.nick = usuario.nick;
        usuarioDTO.telefono = usuario.telefono;

        return usuarioDTO;
    }

    usuarioDTOtoLG(usuario: string, contrasena: string): UsuarioLoginDto {
        let usuarioLoginDto = new UsuarioLoginDto();

        usuarioLoginDto.usuario = usuario;
        usuarioLoginDto.contrasena = contrasena;

        return usuarioLoginDto;
    }
}
