import { IsDateString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 5, description: 'ID of the desk being booked' })
  @IsInt()
  deskId: number;

  @ApiProperty({ example: '2025-04-20T09:00:00Z', description: 'Start time of the booking (ISO 8601)' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2025-04-20T17:00:00Z', description: 'End time of the booking (ISO 8601)' })
  @IsDateString()
  endTime: string;
}
