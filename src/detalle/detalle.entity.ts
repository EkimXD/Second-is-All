import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('detalle')
export class DetalleEntity {

  @PrimaryGeneratedColumn({
    type:"int",
    unsigned:true,
    name:"id_detalle",
    comment:"Identificador de la detalle"
  })
  id:number;

  @Index({
    unique: false,
  })
  @Column({
    nullable:false,
    type:'int',
    name: 'cantidad_detalle',
    comment: 'cantidad de la tabla detalle'
  })
  cantidad:number;

  @Index({
    unique: false,
  })
  @Column({
    nullable:true,
    type:'varchar',
    name: 'descripcion_detalle',
    comment: 'Descripcion de la tabla detalle'
  })
  descripcion:string;

  @Index({
    unique: false,
  })
  @Column({
    nullable:true,
    type:'int',
    name: 'total_detalle',
    comment: 'total de la tabla detalle'
  })
  total:number;

}
