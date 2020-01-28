import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {RolModule} from "./rol/rol.module";
import {CategoriaModule} from "./categoria/categoria.module";
import {ProductoModule} from "./producto/producto.module";
import {RolEntity} from "./rol/rol.entity";
import {CategoriaEntity} from "./categoria/categoria.entity";
import {ProductoEntity} from "./producto/producto.entity";

@Module({
  imports: [
      RolModule,
      CategoriaModule,
     ProductoModule,
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
          ],
          synchronize: true, // Crear -> true , Conectar -> false
        },
    )
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
