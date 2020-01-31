import {Column, Index, PrimaryGeneratedColumn} from "typeorm";
import {IsDateString, IsEmail, IsNotEmpty, MaxLength, MinLength} from "class-validator";

export class UsuarioCreateDto {

    @IsNotEmpty()
    @MaxLength(100)
    nombre: string;

    @IsNotEmpty()
    @MaxLength(100)
    apellido: string;

    @IsNotEmpty()
    @IsEmail()
    correo: string;


    telefono?: string;

    @IsDateString()
    fecha_nac?: string;

    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(20)
    nick: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(50)
    contrasena: string;
}
