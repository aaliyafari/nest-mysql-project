import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePricingRuleDto {
  @IsNotEmpty()
  locationId: number;

  @IsString()
  timeRangeStart: string;

  @IsString()
  timeRangeEnd: string;

  @IsNumber()
  basePrice: number;

  @IsNumber()
  multiplier: number;

  @IsOptional()
  @IsString()
  description?: string;
}
