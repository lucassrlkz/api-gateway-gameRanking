import { ArrayMinSize, IsArray, IsOptional, IsString } from 'class-validator';
import { Event } from '../interfaces/event.interface';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  readonly description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<Event>;
}
