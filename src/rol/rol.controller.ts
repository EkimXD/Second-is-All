import {Controller, Get} from "@nestjs/common";


@Controller('rol')
export class RolController {

    @Get('callme')
    sayName(){
        return 'rol'
    }
}
