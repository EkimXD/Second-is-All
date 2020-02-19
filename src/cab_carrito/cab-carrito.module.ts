import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolEntity } from '../rol/rol.entity';
import { RolController } from '../rol/rol.controller';
import { RolService } from '../rol/rol.service';
import { CabCarritoEntity } from './cab-carrito.entity';
import { CabCarritoController } from './cab-carrito.controller';
import { CabCarritoService } from './cab-carrito.service';
import { DetCarritoService } from '../det_carrito/det-carrito.service';
import { DetCarritoEntity } from '../det_carrito/det-carrito.entity';

@Module({
  imports: [
    TypeOrmModule
      .forFeature([
          CabCarritoEntity, // Entidades a usarse dentro
          DetCarritoEntity, // Entidades a usarse dentro
          // del modulo.
        ],
        'default', // Nombre de la cadena de conex.
      ),
  ],
  controllers: [
    CabCarritoController,
  ],
  providers: [
    CabCarritoService,
    DetCarritoService,
  ],
  exports: [
    CabCarritoService,
  ],
})

export class CabCarritoModule {
}
