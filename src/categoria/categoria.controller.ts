import {Controller, Get} from "@nestjs/common";


@Controller('categoria')
export class CategoriaController {
    @Get('callme')
    sayName(){
        return 'categoria'
    }
}
