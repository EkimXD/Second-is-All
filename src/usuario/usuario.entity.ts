import {Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {RolEntity} from "../rol/rol.entity";

@Entity('usuario_web')
export class UsuarioEntity {
    @PrimaryGeneratedColumn({
        type: 'int',
        unsigned: true,
        name: 'id_usuario',
        comment: 'Identificador tabla usuario',
    })
    id_usuario: number;

    @Index({
        unique: false,
    })
    @Column({
        type: 'varchar',
        nullable: true,
        name: 'nombre_usuario',
        comment: 'Nombre en la tabla usuario',
    })
    nombre?: string;

    @Index({
        unique: false,
    })
    @Column({
        type: 'varchar',
        nullable: true,
        name: 'apellido_usuario',
        comment: 'Apellido en la tabla usuario',
    })
    apellido?: string;

    @Index({
        unique: true,
    })
    @Column({
        type: 'varchar',
        nullable: true,
        name: 'correo_usuario',
        comment: 'Correo en la tabla usuario',
    })
    correo?: string;

    @Index({
        unique: true,
    })
    @Column({
        type: 'varchar',
        nullable: true,
        name: 'telefono_usuario',
        comment: 'telefono en la tabla usuario',
    })
    telefono?: string;

    @Index({
        unique: false,
    })
    @Column({
        type: 'date',
        nullable: true,
        name: 'fecha_nacimiento_usuario',
        comment: 'fecha naciemiento en la tabla usuario',
    })
    fecha_nac?: string;

    @Index({
        unique: true,
    })
    @Column({
        type: 'varchar',
        nullable: true,
        name: 'nick_usuario',
        comment: 'nick en la tabla usuario',
    })
    nick?: string;

    @Index({
        unique: false,
    })
    @Column({
        type: 'varchar',
        nullable: true,
        name: 'contrasenia_usuario',
        comment: 'contraseña en la tabla usuario',
    })
    contrasena?: string;

  @ManyToMany(type => RolEntity)
  roles: RolEntity[];
}
