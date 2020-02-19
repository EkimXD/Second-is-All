import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ProductoEntity} from './producto.entity';
import {ProductoController} from './producto.controller';
import {ProductoService} from './producto.service';
import {UsuarioEntity} from "../usuario/usuario.entity";
import {UsuarioService} from "../usuario/usuario.service";
import {CategoriaService} from "../categoria/categoria.service";
import {CategoriaEntity} from "../categoria/categoria.entity";

@Module({
    imports: [
        TypeOrmModule
            .forFeature([
                    ProductoEntity, // Entidades a usarse dentro
                    UsuarioEntity, // Entidades a usarse dentro
                    CategoriaEntity, // Entidades a usarse dentro
                    // del modulo.
                ],
                'default', // Nombre de la cadena de conex.
            ),
    ],
    controllers: [
        ProductoController,
    ],
    providers: [
        ProductoService,
        UsuarioService,
        CategoriaService,
    ],
    exports: [
        ProductoService,
    ],
})

export class ProductoModule {

}
