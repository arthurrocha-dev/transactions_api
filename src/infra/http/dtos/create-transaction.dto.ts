import { IsNumber, IsISO8601, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ example: 123.45 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: new Date().toISOString() })
  @IsISO8601()
  timestamp: string;
}
