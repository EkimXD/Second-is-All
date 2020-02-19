import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CabCarritoEntity } from './cab-carrito.entity';

@Injectable()
export class CabCarritoService {

  constructor(
    @InjectRepository(CabCarritoEntity)
    private _repositorioCabCarrito: Repository<CabCarritoEntity>
  ) {}

  encontrarUno(id: number): Promise<CabCarritoEntity | undefined> {
    return this._repositorioCabCarrito
      .findOne(id);
  }

  crearUno(cab: CabCarritoEntity) {
    return this._repositorioCabCarrito
      .save(cab);
  }

  borrarUno(id: number): Promise<DeleteResult> {
    return this._repositorioCabCarrito
      .delete(id);
  }

  actualizarUno(
    id: number,
    cab: CabCarritoEntity
  ): Promise<CabCarritoEntity> {
    cab.id = id;
    return this._repositorioCabCarrito
      .save(cab); // UPSERT
  }

  buscar(
    where: any = {},
    relations:any=[],
    skip: number = 0,
    take: number = 10,
    order: any = {
      id: 'DESC'
    }
  ): Promise<CabCarritoEntity[]> {
    return this._repositorioCabCarrito
      .find({
        where: where,
        skip: skip,
        take: take,
        order: order,
      });
  }
}
