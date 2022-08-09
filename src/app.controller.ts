import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller({ path: 'route', version: '1' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('obtener')
  getHello(): string {
    return this.appService.getHello();
  }
}
