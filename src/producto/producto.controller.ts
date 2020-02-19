import {BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Session} from '@nestjs/common';
import {ProductoEntity} from './producto.entity';
import {validate} from 'class-validator';
import {ProductoService} from './producto.service';
import {ProductoCreateDto} from './producto.create-dto';
import {DeleteResult} from 'typeorm';
import {UsuarioService} from "../usuario/usuario.service";
import {UsuarioEntity} from "../usuario/usuario.entity";
import {CategoriaService} from "../categoria/categoria.service";
import {CategoriaEntity} from "../categoria/categoria.entity";

@Controller('producto')
export class ProductoController {

    constructor(
        private readonly _productoService: ProductoService,
        private readonly _usuarioService: UsuarioService,
        private readonly _categoriaService: CategoriaService,
    ) {
    }

    @Get('sayhey')
    hola() {
        return 'producto';
    }

    @Post()
    async crearProducto(
        @Body() producto: ProductoEntity,
        @Body("idCategoria") idCategoria: string,
        @Session()session,
    ): Promise<ProductoEntity> {
        if (session.usuario !== undefined) {
            const validacion = await validate(this.productoDTO(producto));
            if (validacion.length === 0) {
                producto.usuario = await this.usuario(session.usuario.id_usuario);
                producto.categoria=await this.categoria(+idCategoria);
                return this._productoService.crearUno(producto);
            } else {
                throw new BadRequestException('error en validacion');
            }
        } else {
            throw new BadRequestException('No existe una sesion activa');
        }
    }

    @Post(':id')
    async editarProducto(
        @Param('id') id: string,
        @Body() producto: ProductoEntity,
        @Session()session,
    ): Promise<ProductoEntity> {
        if (session.usuario !== undefined) {
            let ban = false;
            await this._productoService.buscar({id: id, usuario: session.usuario.id_usuario})
                .then(value => {
                    if (value.length > 0) {
                        ban = true;
                    }
                });
            session.usuario.roles.forEach(value => {
                if (value == 'AD') {
                    ban = true;
                }
            });
            if (ban) {
                const validacion = await validate(this.productoDTO(producto));
                if (validacion.length === 0) {
                    return this._productoService.actualizarUno(+id, producto);
                } else {
                    throw new BadRequestException('error en validacion');
                }
            } else {
                throw new BadRequestException('No posee permisos para realizar esta accion');
            }
        } else {
            throw new BadRequestException('No existe una sesion activa');
        }
    }

    @Delete(':id')
    async borrarProducto(
        @Param('id') id: string,
        @Session()session,
    ): Promise<DeleteResult> {
        if (session.usuario !== undefined) {
            let ban = false;
            await this._productoService.buscar({id: id, usuario: session.usuario.id_usuario})
                .then(value => {
                    if (value.length > 0) {
                        ban = true;
                    }
                });
            session.usuario.roles.forEach(value => {
                if (value == 'AD') {
                    ban = true;
                }
            });
            if (ban) {
                return this._productoService.borrarUno(+id);
            } else {
                throw new BadRequestException('No posee permisos para realizar esta accion');
            }
        } else {
            throw new BadRequestException('No existe una sesion activa');
        }
    }

    @Get()
    listarProductos(
        @Query("producto") producto: string,
    ): Promise<ProductoEntity[]> {
        let where = {};
        if (producto !== undefined) {
            where = {nombre: `%${producto}%`}
        }
        return this._productoService.buscar(where);
    }

    @Get(":id")
    buscarProducto(
        @Param("id") id: string,
    ): Promise<ProductoEntity> {
        return this._productoService.encontrarUno(+id);
    }

    productoDTO(producto: ProductoEntity): ProductoCreateDto {
        let productoDTO = new ProductoCreateDto();
        productoDTO.nombre = producto.nombre;
        productoDTO.descripcion = producto.descripcion;
        productoDTO.costo = producto.costo;
        return productoDTO;
    }

    private usuario(id: number): Promise<UsuarioEntity> {
      return this._usuarioService.encontrarUno(id);
    }

    private async categoria(categoria: number):Promise<CategoriaEntity> {
        return this._categoriaService.encontrarUno(categoria);
    }
}
