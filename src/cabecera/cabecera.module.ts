import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CabeceraEntity } from './cabecera.entity';

@Module({
  imports: [
    TypeOrmModule
      .forFeature([
          CabeceraEntity // Entidades a usarse dentro
                        // del modulo.
        ],
        'default' // Nombre de la cadena de conex.
      ),
  ],
  /*controllers: [
    CabeceraController,
  ],
  providers: [
    CabeceraService,
  ],
  exports: [
    CabeceraService,
  ]*/
})
export class CabeceraModule {

}
