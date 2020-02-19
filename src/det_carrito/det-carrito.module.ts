import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetCarritoEntity } from './det-carrito.entity';
import { DetCarritoController } from './det-carrito.controller';
import { DetCarritoService } from './det-carrito.service';
import { CabCarritoService } from '../cab_carrito/cab-carrito.service';
import { CabCarritoEntity } from '../cab_carrito/cab-carrito.entity';
import { ProductoService } from '../producto/producto.service';
import { ProductoEntity } from '../producto/producto.entity';
import { CabCarritoController } from '../cab_carrito/cab-carrito.controller';


@Module({
  imports: [
    TypeOrmModule
      .forFeature([
          DetCarritoEntity,
          CabCarritoEntity,
          ProductoEntity,// Entidades a usarse dentro
          // del modulo.
        ],
        'default', // Nombre de la cadena de conex.
      ),
  ],
  controllers: [
    DetCarritoController,
  ],
  providers: [
    DetCarritoService,
    CabCarritoService,
    ProductoService,
    CabCarritoController,
  ],
  exports: [
    DetCarritoService,
  ],
})
export class DetCarritoModule {

}
