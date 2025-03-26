import { IsEnum, IsOptional, IsString, IsDateString, IsArray, ValidateNested, IsBoolean, IsIn } from 'class-validator';
import { TaskPriority, TaskStatus } from '../interfaces/task.interface';
import { Type } from 'class-transformer';

const RECURRENCE_PATTERNS = ['daily', 'weekly', 'monthly', 'yearly', 'none'] as const;
export type RecurrencePattern = typeof RECURRENCE_PATTERNS[number];

export class RecurrenceDto {
  @IsString()
  @IsIn(RECURRENCE_PATTERNS, {
    message: `Pattern must be one of: ${RECURRENCE_PATTERNS.join(', ')}`
  })
  pattern?: RecurrencePattern;

  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  nextOccurrence?: Date;
}

export class UpdateRecurrenceDto {
  @IsOptional()
  @IsString()
  @IsIn(RECURRENCE_PATTERNS, {
    message: `Pattern must be one of: ${RECURRENCE_PATTERNS.join(', ')}`
  })
  pattern?: RecurrencePattern;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  nextOccurrence?: Date;

  @IsOptional()
  updateAllFuture?: boolean;
}

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsDateString()
  @IsOptional()
  dueDate: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => RecurrenceDto)
  recurrence?: RecurrenceDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  dependencies?: string[];
}

export class UpdateTaskDto {
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsDateString()
  dueDate: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateRecurrenceDto)
  recurrence?: UpdateRecurrenceDto | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dependencies?: string[];

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;
}