import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CategoriaEntity} from "./categoria.entity";
import {CategoriaController} from "./categoria.controller";
import {CategoriaService} from "./categoria.service";

@Module({
    imports: [
        TypeOrmModule
            .forFeature([
                    CategoriaEntity, // Entidades a usarse dentro
                    // del modulo.
                ],
                'default', // Nombre de la cadena de conex.
            ),
    ],
    controllers: [
        CategoriaController,
    ],
    providers: [
        CategoriaService,
    ],
    exports: [
        CategoriaService,
    ],
})
export class CategoriaModule {

}
