import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, MoreThan, Repository } from 'typeorm';
import {ProductoEntity} from "./producto.entity";

@Injectable()
export class ProductoService {
    constructor(
        @InjectRepository(ProductoEntity)
        private _repositorioProducto: Repository<ProductoEntity>
    ) {}

    encontrarUno(id: number): Promise<ProductoEntity | undefined> {
        return this._repositorioProducto
            .findOne(id);
    }

    crearUno(usuario: ProductoEntity) {
        return this._repositorioProducto
            .save(usuario);
    }

    borrarUno(id: number): Promise<DeleteResult> {
        return this._repositorioProducto
            .delete(id);
    }

    actualizarUno(
        id: number,
        usuario: ProductoEntity
    ): Promise<ProductoEntity> {
        usuario.id = id;
        return this._repositorioProducto
            .save(usuario); // UPSERT
    }

    buscar(
        where: any = {},
        skip: number = 0,
        take: number = 10,
        order: any = {
            id: 'DESC',
            nombre: 'ASC'
        }
    ): Promise<ProductoEntity[]> {
        return this._repositorioProducto
            .find({
                where: where,
                skip: skip,
                take: take,
                order: order,
            });
    }
}
