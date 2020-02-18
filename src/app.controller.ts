import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('inicio')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('login')
  login(
    @Res() res,
  ){
    res.render('login/login')
  }
}
