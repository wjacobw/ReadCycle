import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  IsDate,
  IsNumber,
  IsUrl,
  Min,
  Max,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  authors: string[];

  @IsNotEmpty()
  @IsString()
  publisher: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  publishedDate: Date;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  pageCount: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsString({ each: true })
  categories: string[];

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  averageRating?: number;

  @IsNotEmpty()
  @IsUrl()
  image?: string;

  @IsNotEmpty()
  @IsString()
  language: string;

  @IsNotEmpty()
  @IsString()
  isbn: string; 
}
