import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DetCarritoEntity } from '../det_carrito/det-carrito.entity';
import {UsuarioEntity} from "../usuario/usuario.entity";
import {CategoriaEntity} from "../categoria/categoria.entity";

@Entity('productos')
export class ProductoEntity {

    @PrimaryGeneratedColumn({
        type:'int',
        unsigned:true,
        name:'id_producto',
        comment:'identificador del producto'
    })
    id:number;

    @Index({
        unique:false
    })
    @Column({
        type:'varchar',
        nullable:false,
        name:'nombre_producto',
        comment:'Nombre del producto'
    })
    nombre:string;

    @Column({
        type:'varchar',
        nullable:false,
        name:'descripcion_producto',
        comment:'Descripcion del producto'
    })
    descripcion:string;

    @Column({
        type:'double',
        nullable:false,
        name:'costo_producto',
        comment:'Costo del producto'
    })
    costo:number;

    @ManyToOne(
        type => UsuarioEntity,
        cliente=>cliente.producto
    )
    usuario:UsuarioEntity;

    @OneToMany(
      type => DetCarritoEntity,
      detalle=>detalle.producto
    )
    detalle:DetCarritoEntity[];

    @ManyToOne(
        type => CategoriaEntity,
        categoria=>categoria.producto
    )
    categoria:CategoriaEntity;
}
