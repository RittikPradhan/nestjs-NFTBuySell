import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('getSalePurchaseHistory/:userAddress')
  async getSalePurchaseHistory(@Req() req: Request): Promise<any> {
    return await this.appService.getSalePurchaseHistory(req);
  }
}
