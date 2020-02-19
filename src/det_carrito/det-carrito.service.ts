import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { DetCarritoEntity } from './det-carrito.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DetCarritoService {
  constructor(
    @InjectRepository(DetCarritoEntity)
    private _detCarritoEntity:Repository<DetCarritoEntity>
  ) {
  }

  encontrarUno(id: number): Promise<DetCarritoEntity | undefined> {
    return this._detCarritoEntity
      .findOne(id);
  }

  crearUno(detalle: DetCarritoEntity) {
    return this._detCarritoEntity
      .save(detalle);
  }

  borrarUno(id: number): Promise<DeleteResult> {
    return this._detCarritoEntity
      .delete(id);
  }

  actualizarUno(
    id: number,
    detalle: DetCarritoEntity
  ): Promise<DetCarritoEntity> {
    detalle.id = id;
    return this._detCarritoEntity
      .save(detalle); // UPSERT
  }

  buscar(
    where: any = {},
    relations:any=[],
    skip: number = 0,
    take: number = 10,
    order: any = {
      id: 'DESC'
    }
  ): Promise<DetCarritoEntity[]> {
    return this._detCarritoEntity
      .find({
        where: where,
        skip: skip,
        take: take,
        order: order,
        relations,
      });
  }
}
