import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { UnifiedService } from './unified.service';

@Controller('products')
export class UnifiedController {
  constructor(private readonly unifiedService: UnifiedService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('provider') provider?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.unifiedService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      provider,
      category,
      search,
    });
  }

  @Get('stats')
  getStats() {
    return this.unifiedService.getStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.unifiedService.findOne(id);
  }
}
