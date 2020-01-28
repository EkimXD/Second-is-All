import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cabecera')
export class CabeceraEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    name: 'id_cabecera',
    comment: 'Identificador tabla cabecera',
  })
  id_cabecera: number;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'nombre_cabecera',
    comment: 'Nombre en la tabla cabecera',
  })
  nombre?: string;
  

  @Index({
    unique: false,
  })
  @Column({
    type: 'date',
    nullable: true,
    name: 'fecha_cabecera',
    comment: 'fecha en la tabla cabecera',
  })
  fecha?: string;

  @Index({
    unique: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'direccion_cabecera',
    comment: 'direccion en la tabla cabecera',
  })
  direccion?: string;
}
