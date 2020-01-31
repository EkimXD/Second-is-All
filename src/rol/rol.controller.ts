import {Controller, Get, Query} from "@nestjs/common";
import {RolEntity} from "./rol.entity";
import {RolService} from "./rol.service";


@Controller('rol')
export class RolController {

    constructor(
        private readonly _rolService:RolService,
    ) {}


    @Get('callme')
    sayName(){
        return 'rol'
    }

    @Get('buscar')
    async buscar(
        @Query('skip') skip?: string | number,
        @Query('take') take?: string | number,
        @Query('where') where?: string,
        @Query('order') order?: string,
    ): Promise<RolEntity[]> {
        if (order) {
            try {
                order = JSON.parse(order);
            } catch (e) {
                order = undefined;
            }
        }
        if (where) {
            try {
                where = JSON.parse(where);
            } catch (e) {
                where = undefined;
            }
        }
        if (skip) {
            skip = +skip;
        }
        if (take) {
            take = +take;
        }
        return this._rolService
            .buscar(
                where,
                skip as number,
                take as number,
                order,
            );
    }
}
