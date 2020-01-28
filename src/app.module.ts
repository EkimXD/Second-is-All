import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RolModule} from "./rol/rol.module";
import {CategoriaModule} from "./categoria/categoria.module";
import {ProductoModule} from "./producto/producto.module";
import {RolEntity} from "./rol/rol.entity";
import {CategoriaEntity} from "./categoria/categoria.entity";
import {ProductoEntity} from "./producto/producto.entity";
import { UsuarioModule } from './usuario/usuario.module';
import { CabeceraModule } from './cabecera/cabecera.module';
import { UsuarioEntity } from './usuario/usuario.entity';

@Module({
    imports: [
        RolModule,
        CategoriaModule,
        ProductoModule,
        UsuarioModule,
        CabeceraModule,
        TypeOrmModule.forRoot(
            {
                name: 'default', // Nombre cadena de Conex.
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: '1234',
                database: 'secondisall',
                dropSchema: true,
                entities: [
                    RolEntity,
                    CategoriaEntity,
                    ProductoEntity,
                    UsuarioEntity,
                    CategoriaEntity,
                ],
                synchronize: true, // Crear -> true , Conectar -> false
            },
        )
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
