import { Controller, Get, Post, Param } from '@nestjs/common';
import { ProvidersService } from './providers.service';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  listProviders() {
    return this.providersService.getProviders();
  }

  @Post('sync')
  syncAll() {
    return this.providersService.fetchAll();
  }

  @Post(':name/sync')
  syncOne(@Param('name') name: string) {
    return this.providersService.fetchFromProvider(name);
  }
}
