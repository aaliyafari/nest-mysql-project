import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDeskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  locationId: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
