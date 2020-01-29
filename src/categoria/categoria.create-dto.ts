import {IsNotEmpty} from "class-validator";

export class CategoriaCreateDto {

    @IsNotEmpty()
    nombre:string;

}
