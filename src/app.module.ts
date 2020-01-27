import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
      // aqui modulos
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
              //aqui entities
          ],
          synchronize: true, // Crear -> true , Conectar -> false
        },
    )
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
