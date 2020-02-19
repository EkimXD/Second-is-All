import { Column } from 'typeorm';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class DetCarritoCreateDto {

  @IsNotEmpty()
  @Min(0)
  @Max(100)
  cantidad:number;

  @IsNotEmpty()
  @Min(0.01)
  precio:number;
}
