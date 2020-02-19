import { BadRequestException, Body, Controller, Get, Post, Query, Session, Delete, Param } from '@nestjs/common';
import { DetCarritoService } from './det-carrito.service';
import { DetCarritoEntity } from './det-carrito.entity';
import { CabCarritoService } from '../cab_carrito/cab-carrito.service';
import { DetCarritoCreateDto } from './det-carrito.create-dto';
import { validate } from 'class-validator';
import { ProductoService } from '../producto/producto.service';
import { CabCarritoEntity } from '../cab_carrito/cab-carrito.entity';
import { DeleteResult } from 'typeorm';
import { CabCarritoController } from '../cab_carrito/cab-carrito.controller';

@Controller('det-carrito')
export class DetCarritoController {

  constructor(
    private readonly _detCarrito: DetCarritoService,
    private readonly _cabCarrito: CabCarritoService,
    private readonly _productoService: ProductoService,
    private readonly _cabeceraControler:CabCarritoController,
  ) {
  }

  @Get('sayhey')
  sayhey() {
    return 'detalle';
  }

  @Post()
  async agregarDetalle(
    @Body() detalle: DetCarritoEntity,
    @Query('idproducto') idProducto: string,
    @Session() session,
  ):Promise<DetCarritoEntity> {
    if (session.usuario !== undefined) {
      return this._productoService.encontrarUno(+idProducto)
        .then(
          async result => {
            const id: number = session.usuario.id_usuario;
            detalle.producto = result;
            detalle.precio = result.costo;
            const validacion=await validate(this.detalleDTO(detalle));
            if(validacion.length===0){
              detalle.subtotal = detalle.cantidad * detalle.precio;
              return this._cabCarrito.buscar({ usuario: id, estado: 'Creado' });
            }else{
              throw new BadRequestException("Error en validacion");
            }
          },
        )
        .then(
          async result => {
            if (result.length > 0) {
              detalle.cab = result[0];
              return this._detCarrito.crearUno(detalle);
            }else {
              await this._cabeceraControler.crearCab('N/A',session);
              this.agregarDetalle(detalle,idProducto,session);
              // throw new BadRequestException("No existe cabecera, cree una e intente denuevo");
            }
          },
        )
        .catch(
          error => {
            throw new BadRequestException(error);
          },
        );
    } else {
      throw new BadRequestException('No se encontro una sesion activa');
    }
  }

  @Delete(":id")
  eliminarDetalle(
    @Param("id") id:string,
    @Session()session,
  ):Promise<DeleteResult|void>{
    if(session.usuario!== undefined){
      return this.esPropietario(id,session)
        .then(
          value => {
            if(value){
              return this._detCarrito.borrarUno(+id);
            }else{
              throw new BadRequestException("no tiene permisos para esta accion");
            }
          }
        ).catch(
          reason => {
            throw new BadRequestException(reason);
          }
      );
    }else{
      throw new BadRequestException("No existe una session activa");
    }
  }

  @Post(":id")
  editarDetalle(
    @Body('cantidad') cantidad:string,
    @Param("id") id:string,
    @Session()session,
  ):Promise<DetCarritoEntity>{
    if(session.usuario!== undefined){
      return this.esPropietario(id,session)
        .then(
          value => {
            if(value){
              return this._detCarrito.encontrarUno(+id);
            }else{
              throw new BadRequestException("no tiene permisos para esta accion");
            }
          }
        ).then(
          value => {
            value.cantidad=+cantidad;
            value.subtotal=+cantidad*value.precio;
            return this._detCarrito.actualizarUno(+id,value);
          }
        )
        .catch(
          reason => {
            throw new BadRequestException(reason);
          }
        );
    }else{
      throw new BadRequestException("No existe una session activa");
    }
  }

  @Get(":idCabecera")
  listarDetalles(
    @Param("idCabecera") idCabecera:string,
    @Session()session,
  ):Promise<DetCarritoEntity[]>{
    if(session.usuario!==undefined){
      const idUser=session.usuario.id_usuario;
      return this._cabCarrito.buscar({id:+idCabecera,usuario:idUser})
        .then(
          value => {
            if(value.length>0){
              return this._detCarrito.buscar({cab:idCabecera},['producto']);
            }else{
              throw new BadRequestException("No posee permisos para realizar esta accion");
            }
          }
        ).catch(
          reason => {
            throw new BadRequestException(reason);
          }
      )
    }else {
      throw new BadRequestException("No existe sesion activa");
    }
  }
  private detalleDTO(detalle: DetCarritoEntity): DetCarritoCreateDto {
    let detalleDTO = new DetCarritoCreateDto();
    detalleDTO.cantidad = detalle.cantidad;
    detalleDTO.precio = detalle.precio;
    return detalleDTO;
  }

  private esPropietario(id:string, session):Promise<boolean>{
    const idUser=session.usuario.id_usuario;
    return this._detCarrito.buscar({id:+id},['cab'])
      .then(
        result=>{
          if(result.length>0){
            const cabCarrito:CabCarritoEntity=result[0].cab;
            return this._cabCarrito.buscar({id:cabCarrito.id,usuario:idUser});
          }else{
            throw new BadRequestException("Error, no existe elemento");
          }
        }
      ).then(
      result=>{
        if(result.length>0){
          return true;
        }else{
          return false;
        }
      }
    )
      .catch(
        reason =>{
          throw new BadRequestException(reason);
        }
      )
  }
}
