import {Controller, Get} from "@nestjs/common";


@Controller('producto')
export class ProductoController {

    @Get('callme')
    sayName(){
        return 'producto'
    }
}
