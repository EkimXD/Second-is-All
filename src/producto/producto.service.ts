import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity';
import { DeleteResult, Like, MoreThan, Repository } from 'typeorm';

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

    // Exactamente el nombre o Exactamente la cedula
    const consultaWhere = [
      {
        nombre: ''
      },
      {
        cedula: ''
      }
    ];

    // Exactamente el nombre o LIKE la cedula
    const consultaWhereLike = [
      {
        nombre: Like('a%')
      },
      {
        cedula: Like('%a')
      }
    ];

    // id sea mayor a 20
    const consultaWhereMoreThan = {
      id: MoreThan(20)
    };

    // id sea igual a x
    const consultaWhereIgual = {
      id: 30
    };

    return this._repositorioProducto
      .find({
        where: where,
        skip: skip,
        take: take,
        order: order,
      });
  }
}
