import {BadRequestException, Body, Controller, Delete, Get, Param, Post, Res, Session} from '@nestjs/common';
import { CabCarritoService } from './cab-carrito.service';
import { CabCarritoEntity } from './cab-carrito.entity';
import { CabCarritoCreateDto } from './cab-carrito.create-dto';
import { validate } from 'class-validator';
import { DeleteResult } from 'typeorm';
import { errorComparator } from 'tslint/lib/verify/lintError';
import { DetCarritoService } from '../det_carrito/det-carrito.service';

@Controller('cab-carrito')
export class CabCarritoController {
  constructor(
    private readonly _cabCarritoService: CabCarritoService,
    private readonly _detCarritoService: DetCarritoService,
  ) {
  }

  @Get('sayhey')
  async sayhey() {
    return 'cab-carrito';
  }

  @Post()
  async crearCab(
    @Body('direccion') direccion: string,
    @Session() session,
    @Res()res
  ): Promise<CabCarritoEntity> {
    if (session.usuario !== undefined) {
      let cabecera = this.generarCabecera();
      cabecera.direccion = direccion;
      const validacion = await validate(this.carritoDTO(cabecera));
      if (validacion.length === 0) {
        cabecera.usuario = session.usuario.id_usuario;
        return this._cabCarritoService.crearUno(cabecera);
      } else {
        throw new BadRequestException('Error en validacion');
      }
    } else {
      throw new BadRequestException('No existe sesion activa');
    }
  }

  @Delete(':id')
  async eliminarCabecera(
    @Param('id')id: string,
    @Session()session,
  ): Promise<DeleteResult | void> {
    if (session.usuario !== undefined) {
      return this.esPropietario(id, session)
        .then(
          bandera => {
            if (bandera) {
              return this._cabCarritoService.borrarUno(+id);
            } else {
              throw  new BadRequestException('No posee permisos para realizar esta accion');
            }
          },
        )
        .catch(
          reason => {
            console.log(reason.toString());
          },
        );
    } else {
      throw  new BadRequestException('No Existe usuario logeado');
    }
  }

  @Post(':id')
  async editarDireccionCabecera(
    @Param('id') id: string,
    @Body('direccion') direccion: string,
    @Session() session,
  ): Promise<CabCarritoEntity | void> {
    if (session.usuario !== undefined) {
      return this.esPropietario(id, session)
        .then(
          async bandera => {
            if (bandera) {
              return this._cabCarritoService.encontrarUno(+id);
            } else {
              throw  new BadRequestException('No posee permisos para realizar esta accion');
            }
          },
        )
        .then(
          value => {
            value.direccion = direccion;
            return this._cabCarritoService.actualizarUno(+id, value);
          },
        )
        .catch(
          reason => {
            console.log(reason.toString());
          },
        );
    } else {
      throw  new BadRequestException('No Existe usuario logeado');
    }
  }

  @Post('/comprar/:id')
  async comprarCabecera(
    @Param('id') id: string,
    @Session() session,
    @Res() res,
  ): Promise<CabCarritoEntity | void> {
    if (session.usuario !== undefined) {
      return this.esPropietario(id, session)
        .then(
          async bandera => {
            if (bandera) {
              return this._cabCarritoService.encontrarUno(+id);
            } else {
              throw  new BadRequestException('No posee permisos para realizar esta accion');
            }
          },
        )
        .then(
          value => {
            const f = new Date();
            value.estado = 'Comprado';
            this.actualizarCabecera(+id);
            value.fecha = `${f.getFullYear()}/${f.getMonth() + 1}/${f.getDate()}`;
            this.crearCab('N/A', session,res);
            return this._cabCarritoService.actualizarUno(+id, value);
          },
        )
        .catch(
          reason => {
            throw new BadRequestException(reason);
          },
        );
    } else {
      throw  new BadRequestException('No Existe usuario logeado');
    }
  }

  actualizarCabecera(
    id: number,
  ): Promise<CabCarritoEntity | void> {
    return this._cabCarritoService.encontrarUno(+id)
      .then(
        async value => {
          value.total = await this.getTotal(+id);
          return this._cabCarritoService.actualizarUno(+id, value);
        },
      )
      .catch(
        reason => {
          console.log(reason.toString());
        },
      );
  }

  @Get()
  buscarCabeceras(
    @Session()session,
  ): Promise<CabCarritoEntity[]> {
    if (session.usuario !== undefined) {
      const id: number = session.usuario.id_usuario;
      return this._cabCarritoService.buscar({ usuario: id }, [], 0, 10, { fecha: 'DESC' });
    } else {
      throw new BadRequestException('No existe una sesion activa');
    }
  }

  @Get('bAdmin')
  buscarCabecerasAdmin(
    @Session()session,
  ): Promise<CabCarritoEntity[]> {
    if (session.usuario !== undefined) {
      let ban = false;
      session.usuario.roles.forEach(value => {
        if (value === 'AD') {
          ban = true;
        }
      });
      if (ban) {
        const id: number = session.usuario.id_usuario;
        return this._cabCarritoService.buscar({ usuario: id }, [], 0, 10, { fecha: 'DESC' });
      } else {
        throw new BadRequestException('No posee permisos para realizar esta accion');
      }
    } else {
      throw new BadRequestException('No existe una sesion activa');
    }
  }

  private esPropietario(id, session): Promise<boolean> {
    return this._cabCarritoService.buscar({ id: id, usuario: session.usuario.id_usuario })
      .then(
        result => {
          let bandera = false;
          if (result.length !== 0) {
            bandera = true;
          } else {
            session.usuario.roles.forEach(value => {
              if (value === 'AD') {
                bandera = true;
              }
            });
          }
          return bandera;
        },
      );
  }

  private carritoDTO(carrito: CabCarritoEntity): CabCarritoCreateDto {
    let carritoDTO = new CabCarritoCreateDto();
    carritoDTO.estado = carrito.estado;
    carritoDTO.direccion = carrito.direccion;
    carritoDTO.fecha = carrito.fecha;
    carritoDTO.total = carrito.total;
    return carritoDTO;
  }

  private generarCabecera(): CabCarritoEntity {
    const f = new Date();
    let cabecera = new CabCarritoEntity();
    cabecera.fecha = `${f.getFullYear()}/${f.getMonth() + 1}/${f.getDate()}`;
    cabecera.total = 0;
    cabecera.estado = 'Creado';
    return cabecera;
  }

  private getTotal(id: number): Promise<number> {
    let total = 0;
    return this._detCarritoService.buscar({ cab: id })
      .then(
        value => {
          value.forEach(elemento => {
            total += elemento.subtotal;
          });
          return total;
        },
      );
  }
}
