import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CabCarritoEntity } from '../cab_carrito/cab-carrito.entity';
import { ProductoEntity } from '../producto/producto.entity';

@Entity('det_carrito')
export class DetCarritoEntity {

  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id_det_carrito',
    comment: 'identificador de la tabla det-carrito',
  })
  id: number;

  @Column({
    type:"int",
    nullable:false,
    name:"cantidad_det_carrito",
    comment:"Cantidad del detalle"
  })
  cantidad:number;

  @Column({
    type:"double",
    nullable:false,
    name:"precio_det_carrito",
    comment:"Precio del detalle"
  })
  precio:number;

  @Column({
    type:"double",
    nullable:false,
    name:"subtotal_det_carrito",
    comment:"Subtotal del detalle"
  })
  subtotal:number;

  @ManyToOne(
    type => CabCarritoEntity,
    cabCarrito=>cabCarrito.detalle
  )
  cab:CabCarritoEntity;

  @ManyToOne(
    type => ProductoEntity,
    producto=>producto.detalle
  )
  producto:ProductoEntity;
}
