import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class CreateArticleDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  identifierValue: string;

  @IsNotEmpty()
  @IsString()
  user: User;
}
