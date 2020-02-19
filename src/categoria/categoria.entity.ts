import {Column, Entity, Index, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ProductoEntity} from "../producto/producto.entity";


@Entity('categoria')
export class CategoriaEntity {

    @PrimaryGeneratedColumn({
        type:"int",
        unsigned:true,
        name:"id_categoria",
        comment:"Identificador de la tabla"
    })
    id:number;

    @Index({
        unique:true,
    })
    @Column({
        nullable:false,
        type:'varchar',
        name: 'nombre_categoria',
        comment: 'Nombre de la categoria'
    })
    nombre:string;

    @Column({
        nullable:true,
        type:'varchar',
        name: 'descripcion_categoria',
        comment: 'Descripcion de la categoria'
    })
    descripcion:string;

    @OneToMany(
        type=>ProductoEntity,
        producto=>producto.categoria
    )
    producto:ProductoEntity[];
}
