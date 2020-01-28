import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuario_web')
export class UsuarioEntity {
  @PrimaryGeneratedColumn({
    type:'int',
    unsigned: true,
    name: 'id_usuario',
    comment:'Identificador tabla usuario',
  })
  id_usuario: number;

  @Index({
    unique: false,
  })
  @Column({
    type:'varchar',
    nullable: true,
    name: 'nombre_usuario',
    comment:'Nombre en la tabla usuario',
  })
  nombre?: string;

  @Index({
    unique: false,
  })
  @Column({
    type:'varchar',
    nullable: true,
    name: 'apellido_usuario',
    comment:'Apellido en la tabla usuario',
  })
  apellido?: string;

  @Index({
    unique: true,
  })
  @Column({
    type:'varchar',
    nullable: true,
    name: 'correo_usuario',
    comment:'Correo en la tabla usuario',
  })
  correo?: string;
}
