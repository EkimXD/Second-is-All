import {IsDateString, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength} from "class-validator";


export class ProductoCreateDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @MinLength(5)
    nombre:string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(10)
    @MinLength(3)
    estado:string;

    @IsNotEmpty()
    @IsDateString()
    fecha:string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(10)
    @MinLength(3)
    descripcion:string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    costo:number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    cantidad:number;

}
