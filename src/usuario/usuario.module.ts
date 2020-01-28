import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';

@Module({
  imports: [
    TypeOrmModule
      .forFeature([
          UsuarioEntity // Entidades a usarse dentro
                        // del modulo.
        ],
        'default' // Nombre de la cadena de conex.
      ),
  ],
  /*controllers: [
    UsuarioController,
  ],
  providers: [
    UsuarioService,
  ],
  exports: [
    UsuarioService,
  ]*/
})
export class UsuarioModule {

}
