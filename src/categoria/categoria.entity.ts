import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm";


@Entity('categoria')
export class CategoriaEntity {

    @PrimaryGeneratedColumn({
        type:"int",
        unsigned:true,
        name:"id_categoria",
        comment:"Identificador de la tabla"
    })
    id:number;

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

}
