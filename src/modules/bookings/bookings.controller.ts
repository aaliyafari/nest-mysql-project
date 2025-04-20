import { Controller, Post, Patch, Param, Body, ParseIntPipe, UseGuards, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface'; 
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('bookings')
@ApiBearerAuth()
@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly service: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  async book(@Body() dto: CreateBookingDto, @CurrentUser() user: JwtPayload) {
    const booking = await this.service.create({ ...dto, userId: user.id });
    return booking;
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
  async cancel(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    const booking = await this.service.findBookingById(id);
  
    if (user.role !== 'admin' && booking.user.id !== user.id) {
      throw new ForbiddenException('You do not have permission to cancel this booking');
    }
  
    return this.service.cancel(id, user.id, user.role);  
  }
  
  
  

  
  

  @Patch(':id/check-in')
  @ApiOperation({ summary: 'Check in to a booking' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Booking checked in successfully' })
  async checkInBooking(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    const booking = await this.service.findBookingById(id);
    
    if (user.role !== 'admin' && booking.user.id !== user.id) {
      throw new UnauthorizedException('You do not have permission to check in to this booking');
    }
  
    return this.service.checkInBooking(id);
  }

  @Post('/simulate-auto-cancel')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Simulate auto-cancellation of bookings (Admin only)' })
  @ApiResponse({ status: 200, description: 'Auto-cancel simulation complete' })
  autoCancel() {
    return this.service.simulateAutoCancel();
  }
}
