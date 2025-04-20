import { IsDateString, IsNumberString } from 'class-validator';

export class BookingSummaryQueryDto {
  @IsNumberString()
  locationId: string;

  @IsDateString()
  date: string;
}
