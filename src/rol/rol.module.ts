import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RolEntity} from "./rol.entity";

@Module({
    imports: [
        TypeOrmModule
            .forFeature([
                    RolEntity, // Entidades a usarse dentro
                    // del modulo.
                ],
                'default', // Nombre de la cadena de conex.
            ),
    ],
    // controllers: [
    //     RolController,
    // ],
    // providers: [
    //    RolService,
    // ],
    // exports: [
    //     RolService,
    // ],
})
export class RolModule {

}
