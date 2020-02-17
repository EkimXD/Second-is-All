import {Body, Controller, Get, Post} from "@nestjs/common";
import {ProductoEntity} from "./producto.entity";
import {ProductoCreateDto} from "./producto.create-dto";
import {validate} from "class-validator";
import {ProductoService} from "./producto.service";


@Controller('producto')
export class ProductoController {

    constructor(
        private readonly _productoService:ProductoService,
    ) {
    }
    @Get('callme')
    sayName(){
        return 'producto'
    }

    @Post()
    async crearProducto(
        @Body() producto:ProductoEntity,
    ){
        const validacion= await validate(this.usuarioDTO(producto));
        if(validacion.length===0){
            this._productoService.crearUno(producto)
                .then(
                    result=>{
                        console.log(result);
                        //todo producto creado
                    }
                )
                .catch(
                    error=>{
                        console.log(error);
                        //todo producto no creado
                    }
                )
        }else{
            console.log(validacion);
            //todo error en validacion
        }
    }

    usuarioDTO(productoEntity:ProductoEntity):ProductoCreateDto{
        let productoDTO=new ProductoCreateDto();
        productoDTO.nombre=productoEntity.nombre;
        productoDTO.cantidad=productoEntity.cantidad;
        productoDTO.costo-productoEntity.costo;
        productoDTO.descripcion=productoEntity.descripcion;
        productoDTO.estado=productoEntity.descripcion;
        productoDTO.fecha=productoEntity.fecha;
        return productoDTO;
    }
}
