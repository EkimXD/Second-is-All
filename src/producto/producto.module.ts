import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductoController} from "./producto.controller";
import {ProductoService} from "./producto.service";
import {ProductoEntity} from "./producto.entity";

@Module({
    imports: [
        TypeOrmModule
            .forFeature([
                    ProductoEntity, // Entidades a usarse dentro
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
    ],
    exports: [
        ProductoService,
    ],
})
export class ProductoModule {

}
