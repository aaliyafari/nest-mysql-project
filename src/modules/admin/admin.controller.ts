import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { BookingSummaryQueryDto } from './dto/booking-summary.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('admin')
@ApiTags('admin') 
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('booking-summary')
  @ApiOperation({ summary: 'Get booking summary by location and date' })
  @ApiQuery({ name: 'locationId', type: Number, required: true })
  @ApiQuery({ name: 'date', type: String, required: true, description: 'Date in YYYY-MM-DD format' })
  @ApiResponse({ status: 200, description: 'Returns booking summary for the given location and date' })
  getSummary(@Query() query: BookingSummaryQueryDto) {
    const locationId = parseInt(query.locationId);
    return this.adminService.getBookingSummary(locationId, query.date);
  }
}
