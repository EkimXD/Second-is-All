import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity('producto')
export class ProductoEntity {

    @PrimaryGeneratedColumn({
        type:'int',
        unsigned:true,
        name:'id_producto',
        comment:'Identificador de la tabla'
    })
    id:number;

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
        name:'estado_uso_producto',
        comment:'Que tan usado esta el producto'
    })
    estado:string;

    @Column({
        type:'varchar',
        nullable:false,
        name:'fecha_publicacion_producto',
        comment:'Fecha de publicacion del producto'
    })
    fecha:string;

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

    @Column({
        type:'int',
        nullable:false,
        name:'cantidad_producto',
        comment:'Cantidad del producto'
    })
    cantidad:number;

}
