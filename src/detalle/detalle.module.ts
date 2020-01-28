import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleEntity } from './detalle.entity';

@Module({
  imports: [
    TypeOrmModule
      .forFeature([
          DetalleEntity, // Entidades a usarse dentro
          // del modulo.
        ],
        'default', // Nombre de la cadena de conex.
      ),
  ],
  /*controllers: [
    DetalleController,
  ],
  providers: [
    CategoriaService,
  ],
  exports: [
    CategoriaService,
  ],*/
})
export class DetalleModule {

}
