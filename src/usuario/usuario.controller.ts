import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Module,
    Param,
    Post, Query,
    Req,
    Res,
    Session,
} from '@nestjs/common';
import {UsuarioService} from "./usuario.service";
import {UsuarioEntity} from "./usuario.entity";
import {UsuarioCreateDto} from "./usuario.create-dto";
import {validate} from "class-validator";
import {RolService} from "../rol/rol.service";
import {DeleteResult} from "typeorm";
import {UsuarioLoginDto} from "./usuario.login-dto";
import {RolEntity} from "../rol/rol.entity";
import {errorComparator} from "tslint/lib/verify/lintError";


@Controller('usuario')
export class UsuarioController {
    constructor(
        private readonly _usuarioService: UsuarioService,
        private readonly _rolService: RolService,
    ) {
    }

    @Get('login')
    rutaLogin(
      @Res() res,
    ){
        res.render('login/login')
    }

    @Get('principal')
    rutaPrincipal(
      @Res() res,
    ){
        res.render('componentes/principal')
    }

    @Get('rutas/crear-usuario')
    async rutaCrearUsuarios(

      @Query('error') error: string,
      @Res() res,
    ){
        res.render(
          'usuario/rutas/crear-usuario',
          {
              datos: {
                  error,
              },
          }
        );
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

    @Post('login')
    async login(
        @Body('usuario') usuario: string,
        @Body('contrasena') contrasena: string,
        @Session()session,
        @Res() res,
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
                                result.rol.forEach((rol)=>{
                                   arregloRoles.push(rol.nombre);
                                });
                                session.usuario={
                                    id_usuario:result.id_usuario,
                                    usuario:result.nick,
                                    roles:arregloRoles
                                };

                                res.render('usuario/principal?mensaje=Usuario logeado',
                                  {
                                    usuario:result.nick
                                })

                            }else {
                                console.log('Contrasena incorrecta');
                                res.redirect('/inicio/login?error=Contrasena incorrecta',)
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
        @Body() usuario: UsuarioEntity,
        @Res() res,
    ) {
      console.log(usuario)
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
                            // res.redirect(
                            //   '/login/login?mensaje=El usuario fue creado exitosamente',
                            // );
                            res.redirect('/inicio/login?mensaje=Usuario creado exitosamente')
                        } else {
                            res.redirect(
                              '/usuario/rutas/crear-usuario?error=Error del servidor roles',
                            )
                            //throw new BadRequestException('No se puede crear usuario, no existen roles aplicables');
                        }
                    }
                )
                .catch(
                    error => {
                        console.log(error);
                    }
                );
        } else {
            res.redirect(
              '/usuario/rutas/crear-usuario?error=Error validando',
            )
            //throw new BadRequestException(`Error validando \n${validacion}`)
        }

    }

    @Post(':id')
    async editarUsuario(
        @Body()usuario:UsuarioEntity,
        @Param('id')id:string,
        @Session()session,
    ):Promise<UsuarioEntity|void>{
        if(session.usuario!==undefined){
            let ban=false;
            if(session.usuario.id_usuario==id){
                ban=true;
            }else{
                session.usuario.roles.forEach(value=>{
                    if (value=="AD"){
                        ban=true;
                    }
                })
            }
            if(ban){
                let validacion=await validate(this.usuarioDTOtoGE(usuario));
                if (validacion.length==0){
                    return this._usuarioService.encontrarUno(+id)
                        .then(
                            value => {
                                value.correo=usuario.correo;
                                value.nick=usuario.nick;
                                value.contrasena=usuario.contrasena;
                                value.telefono=usuario.telefono;
                                value.fecha_nac=usuario.fecha_nac;
                                value.apellido=usuario.apellido;
                                value.nombre=usuario.nombre;
                                return this._usuarioService.actualizarUno(+id,value);
                            }
                        ).catch(
                            reason => {
                                throw new BadRequestException(reason);
                            }
                        )
                }else{
                    throw new BadRequestException("Error en validacion");
                }
            }else {
                throw new BadRequestException("No posee permisos para realizar esta accion")
            }
        }else{
            throw new BadRequestException("No existe sesion activa");
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
